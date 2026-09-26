# Favicon 1a (2026-09-25)

Package from the owner (`package-as-received.zip`, note in
`HANDOFF-AS-RECEIVED.md`). The favicon is the G cut from the slanted
GOOOL wordmark (GA-01-F artwork, not retyped) over the red rule, on an
ink tile with rounded corners. White #FFFFFF, rule #C52D32, tile #0A0A0A.

| File | Size | Use |
|---|---|---|
| `files/favicon.ico` | 16, 32, 48 px | browser tab, bookmarks |
| `files/icon.png` | 512 × 512 | Next.js app icon, Android, PWA |
| `files/apple-icon.png` | 180 × 180 | iOS home screen |

## Applied (2026-09-25)

The three files sit in `src/app/` and Next.js serves them by convention
(`/favicon.ico`, `/icon.png`, `/apple-icon.png`). `src/app/icon.svg`, the
previous echo-mark favicon, was deleted so it cannot take precedence.
No hard-coded icon paths existed in the layout metadata.

## Not done

The handoff also asks for the retired echo mark to be removed from the
brand everywhere (logo SVGs, two inactive products, archived imagery).
That is a separate, destructive sweep and was not part of the owner's
instruction for this package; it needs its own go-ahead.
