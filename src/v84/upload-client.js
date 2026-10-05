import { Upload } from 'tus-js-client';
const sessions = new Map();
let busy = false;
async function json(url, options = {}) {
  const response = await fetch(url, { credentials: 'same-origin', ...options });
  const data = await response.json().catch(() => ({ error: 'The service is unavailable. Please retry.' }));
  if (!response.ok) throw new Error(data.error || 'Please retry.');
  return data;
}
export async function sendIntake(kind, payload, files, progress) {
  if (busy) throw new Error('Another submission is uploading. Please wait.');
  busy = true;
  const beforeUnload = event => { event.preventDefault(); event.returnValue = ''; };
  window.addEventListener('beforeunload', beforeUnload);
  try {
    const fingerprint = JSON.stringify({ payload, files: files.map(({ file, purpose }) => [file.name, file.size, file.lastModified, purpose]) });
    let session = sessions.get(kind);
    if (!session || session.fingerprint !== fingerprint || session.expiresAt < Date.now()) {
      progress('Preparing your submission...');
      session = { ...await json('/api/intake/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, payload, files: files.map(({ file, purpose }) => ({ name: file.name, size: file.size, mime: file.type, purpose })) }) }), fingerprint };
      sessions.set(kind, session);
    } else if (session.files.some(file => !file.complete)) {
      const renewed = await json(`/api/intake/${session.id}/refresh`, { method: 'POST', headers: { 'X-Upload-Token': session.token } });
      for (const file of session.files) {
        const update = renewed.files.find(item => item.id === file.id);
        if (update) file.signature = update.signature;
      }
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i].file, remote = session.files[i];
      if (remote.complete) continue;
      await new Promise((resolve, reject) => {
        const upload = new Upload(file, {
          endpoint: session.uploadEndpoint,
          uploadUrl: remote.uploadUrl || undefined,
          headers: { 'x-signature': remote.signature },
          chunkSize: 6 * 1024 * 1024,
          retryDelays: [0, 1000, 3000, 5000],
          storeFingerprintForResuming: false,
          metadata: { bucketName: session.bucket, objectName: remote.objectKey, contentType: remote.mime, cacheControl: '0' },
          onUploadUrlAvailable() { remote.uploadUrl = upload.url; },
          onProgress(sent,total) { progress(`Uploading ${i + 1} of ${files.length}: ${Math.floor(sent / total * 100)}%`); },
          onError() { reject(new Error('Upload interrupted. Your files are still selected; please retry.')); },
          onSuccess() { remote.complete = true; resolve(); }
        });
        upload.start();
      });
    }
    progress('Saving your submission...');
    const receipt = await json(`/api/intake/${session.id}/finish`, { method: 'POST', headers: { 'X-Upload-Token': session.token } });
    sessions.delete(kind);
    return receipt;
  } finally {
    busy = false;
    window.removeEventListener('beforeunload', beforeUnload);
  }
}
