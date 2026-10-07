const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { createClient } = require('@supabase/supabase-js');
const { Upload } = require('tus-js-client');

// Keys arrive through stdin from the authorized CLI, never through argv or files.
async function main() {
  let input = '';
  for await (const part of process.stdin) input += part;
  const keys = JSON.parse(input);
  const service = keys.find(key => key.name === 'service_role')?.api_key;
  const anon = keys.find(key => key.name === 'anon')?.api_key;
  assert(service && anon, 'Required project key labels missing');
  const url = 'https://oexibflpshttgzmdvhpr.supabase.co';
  const options = { auth: { persistSession: false, autoRefreshToken: false } };
  const client = createClient(url, service, options);
  const browser = createClient(url, anon, options);
  const bucket = 'goool-intake', id = randomUUID(), fileId = randomUUID();
  const objectKey = `release-verification/${id}/boundary-fixture`;
  const checked = result => {
    if (result.error) {
      console.error(`Provider error code: ${result.error.code || result.error.statusCode || 'unknown'}`);
      throw new Error('Provider operation failed');
    }
    return result.data;
  };
  let created = false;
  try {
    const storage = checked(await client.storage.getBucket(bucket));
    assert.equal(storage.public, false);
    assert.equal(Number(storage.file_size_limit), 104857600);
    const denied = await browser.from('intake_submissions').select('id').limit(1);
    assert(denied.error, 'Anonymous intake reads must be denied');
    console.log('PASS private bucket and anonymous database denial');
    checked(await client.rpc('intake_begin', {
      p_record: { id, kind: 'video', category: 'release-verification', name: 'Release Verification Fixture', email: 'release-fixture@example.test', team: '', payload: { fixture: true }, consent: { fixture: true }, upload_token_hash: 'fixture-token-hash', upload_expires_at: new Date(Date.now() + 3600000).toISOString() },
      p_files: [{ id: fileId, name: 'boundary-fixture.mp4', mime: 'video/mp4', size: 104857600, objectKey, purpose: 'main' }]
    }));
    created = true;
    const signed = checked(await client.storage.from(bucket).createSignedUploadUrl(objectKey));
    console.log(`Scoped token shape: ${typeof signed.token}, ${String(signed.token).split('.').length} segments`);
    // This synthetic boundary fixture tests transport/capacity, not video playback.
    const bytes = Buffer.alloc(104857600);
    bytes.write('ftyp', 4, 'ascii');
    await new Promise((resolve, reject) => {
      const upload = new Upload(bytes, {
        endpoint: 'https://oexibflpshttgzmdvhpr.storage.supabase.co/storage/v1/upload/resumable/sign',
        headers: { 'x-signature': signed.token, apikey: anon }, chunkSize: 6 * 1024 * 1024,
        retryDelays: [0, 1000, 3000], storeFingerprintForResuming: false,
        metadata: { bucketName: bucket, objectName: objectKey, contentType: 'video/mp4', cacheControl: '0' },
        onError: error => {
          console.error(`Resumable upload HTTP status: ${error.originalResponse?.getStatus() || 'unavailable'}`);
          const body = error.originalResponse?.getBody() || '';
          try {
            const diagnostic = JSON.parse(body);
            const message = String(diagnostic.message || diagnostic.error || '').replaceAll(signed.token, '[redacted]').replaceAll(service, '[redacted]').replaceAll(anon, '[redacted]').replace(/eyJ[A-Za-z0-9_.-]+/g, '[redacted]');
            console.error(`Provider diagnostic: ${message.slice(0, 180)}`);
          } catch {}
          if (/maximum.*size|size.*limit|exceed|too large/i.test(body)) console.error('Provider rejected the configured file-size boundary');
          if (/signature|token|jwt|unauthorized/i.test(body)) console.error('Provider rejected scoped upload authorization');
          reject(new Error('100 MiB resumable provider upload failed'));
        },
        onSuccess: resolve
      });
      upload.start();
    });
    const download = checked(await client.storage.from(bucket).createSignedUrl(objectKey, 60));
    const head = await fetch(download.signedUrl, { method: 'HEAD' });
    assert(head.ok);
    assert.equal(Number(head.headers.get('content-length')), 104857600);
    const publicRead = await fetch(`${url}/storage/v1/object/public/${bucket}/${objectKey}`, { method: 'HEAD' });
    assert(!publicRead.ok, 'Private fixture must not have public download access');
    console.log('PASS real 100 MiB signed resumable upload, exact size and private download');
    const wrong = checked(await client.rpc('intake_finish', { p_id: id, p_token_hash: 'wrong' }));
    assert.equal(wrong, null);
    const first = checked(await client.rpc('intake_finish', { p_id: id, p_token_hash: 'fixture-token-hash' }));
    const second = checked(await client.rpc('intake_finish', { p_id: id, p_token_hash: 'fixture-token-hash' }));
    assert.deepEqual(first, second);
    assert.equal(first.id, id);
    console.log('PASS real atomic receipt, wrong-token denial and idempotent retry');
    checked(await client.rpc('intake_mark_deleting', { p_id: id }));
    const removed = checked(await client.from('intake_submissions').select('name,email,payload,state').eq('id', id).single());
    assert.equal(removed.state, 'deleting');
    assert.equal(removed.email, '');
    assert.deepEqual(removed.payload, {});
    console.log('PASS real deletion tombstone and personal-data scrub');
  } finally {
    checked(await client.storage.from(bucket).remove([objectKey]));
    if (created) checked(await client.from('intake_submissions').delete().eq('id', id));
    const remaining = checked(await client.storage.from(bucket).list(`release-verification/${id}`));
    assert.equal(remaining.length, 0, 'Verification fixture cleanup failed');
    console.log('PASS verification fixture removed; no customer records touched');
  }
}
main().catch(() => { console.error('FAIL cloud verification; no credentials logged. Review provider configuration.'); process.exitCode = 1; });
