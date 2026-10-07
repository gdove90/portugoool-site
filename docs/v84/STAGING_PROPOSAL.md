# Isolated staging proposal

Decision pending: one new Supabase Pro organization with one Micro project, separate from the production GOOOL organization. Published baseline is US $25/month plus tax: Pro subscription plus one Micro project offset by the included compute credit. Check the actual checkout total before purchase. Do not add extra projects, add-ons or disable the spend cap. Compute and some add-ons are outside the spend cap.

Production remains on its existing Free organization. Free's 50 MB maximum file limit cannot support the agreed 100 MiB clips. In staging set global and private bucket limits to 104857600 bytes, with the application retaining its separate 20 MiB crest limit. Use direct resumable uploads, not Netlify request-body uploads.

Disable public signup. Owner email confirmed 2026-10-06: hello@goool.shop. Provision the owner through the approved Auth flow only after staging is approved, and allowlist the verified user UUID server-side. An email address alone is not an authorization check. Password creation stays with the owner. Anonymous and ordinary authenticated users must have no direct table or bucket access. No production service credentials are copied.

Apply the reviewed intake-only SQL to staging, configure a private bucket, then verify real upload/renewal, completion, private download, deletion, cleanup and non-owner rejection. Use test-only commerce and email integrations with live supplier submission blocked. Deploy to a dedicated staging site after reviewing its actual hosting cost and environment scope. No production branch merge or deployment is authorized by this proposal.

Sources checked 2026-10-06:
- https://supabase.com/pricing
- https://supabase.com/docs/guides/storage/uploads/file-limits
- https://supabase.com/docs/guides/platform/manage-your-usage/compute
- https://supabase.com/docs/guides/platform/cost-control
