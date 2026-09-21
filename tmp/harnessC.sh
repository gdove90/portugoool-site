export ORDERS_TEST_STORE=./tmp/orders-envgate-store
export APLIIQ_APP_ID=test_app_id
export APLIIQ_SHARED_SECRET=test_apliiq_shared_secret
export APLIIQ_SUBMIT_ENABLED=true
export STRIPE_WEBHOOK_SECRET=whsec_test_local_secret
export FULFILLMENT_OPS_KEY=test_ops_key_0123456789abcdef
exec npm run dev -- -p 3997
