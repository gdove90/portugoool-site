# Disposable loopback-only commerce fixture. Start PostgREST separately on 4243.
param([Parameter(Mandatory=$true)][string]$OrdersDir)
$fixtureRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$resolvedOrders = [System.IO.Path]::GetFullPath($OrdersDir)
if (Test-Path -LiteralPath $resolvedOrders) { throw 'Choose a fresh fixture directory; existing records are preserved.' }
$env:STORE_OPEN='true'
$env:NEXT_PUBLIC_MIGRATION_PREVIEW='false'
$env:NEXT_DIST_DIR='.next-integration'
$env:ORDERS_TEST_STORE=$resolvedOrders
$env:NEXT_PUBLIC_SUPABASE_URL='http://127.0.0.1:4243'
$env:SUPABASE_SERVICE_ROLE_KEY='fixture-only-not-a-real-key'
$env:STRIPE_SECRET_KEY='sk_test_dummy_key_not_real'
$env:STRIPE_WEBHOOK_SECRET='whsec_test_local_secret'
$env:APLIIQ_APP_ID='fixture-only'
$env:APLIIQ_SHARED_SECRET='test_apliiq_shared_secret'
$env:APLIIQ_SUBMIT_ENABLED='true'
$env:APLIIQ_API_BASE='http://127.0.0.1:4242'
$env:APLIIQ_TIMEOUT_MS='1000'
$env:FULFILLMENT_OPS_KEY='test_ops_key_0123456789abcdef'
$env:RESEND_API_KEY=''
$env:PREVIEW_KEY=''
$env:NETLIFY=''
$networkFixture = (Join-Path $PSScriptRoot 'network-local.cjs').Replace('\','/')
$env:NODE_OPTIONS='--require "'+$networkFixture+'"'
Set-Location -LiteralPath $fixtureRoot
npm run dev -- --hostname 127.0.0.1 --port 3040
