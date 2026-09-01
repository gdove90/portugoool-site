# Verify the GOOOL POD sample packet against the spec manifest
# (GOOOL_POD_SAMPLE_SPECIFICATIONS.pdf p.7). Run after extracting
# GOOOL_FILES_FOR_PORTUGOOOL.zip into the repo root:
#   python scripts/verify-pod-packet.py
import hashlib, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
PACKET = ROOT / "designs" / "GOOOL_POD_SAMPLE_PACKET"

# folder, filename, sha256 prefix (from the packet manifest), (w, h) or None
MANIFEST = [
    ("01_Performance_Tee_Artwork", "GOOOL_SAMPLE_01_ST720_BADGE_FRONT_5IN.png", "ca2f9bbcac8e", (1500, 1920)),
    ("02_Hoodie_Artwork", "GOOOL_SAMPLE_02_IND4000_WORDMARK_FRONT_6.75IN.png", "e853b475085f", (2025, 703)),
    ("03_Casual_Tee_Artwork", "GOOOL_SAMPLE_03_4810GD_WORDMARK_FRONT_6.75IN.png", "e853b475085f", (2025, 703)),
    ("04_Cap_Embroidery_Artwork", "GOOOL_SAMPLE_04_OTTO31069_WORDMARK_FRONT_EMBROIDERY_REFERENCE.png", "661f917ecd0c", (1125, 390)),
    ("04_Cap_Embroidery_Artwork", "GOOOL_SAMPLE_04_OTTO31069_WORDMARK_FRONT_EMBROIDERY_REFERENCE.pdf", "55ec1e78db0d", None),
    ("04_Cap_Embroidery_Artwork", "GOOOL_SAMPLE_04_OTTO31069_SOUND_OF_VICTORY_RIGHT_SIDE.svg", "e6eadbb366f5", None),
    ("04_Cap_Embroidery_Artwork", "GOOOL_SAMPLE_04_OTTO31069_SOUND_OF_VICTORY_RIGHT_SIDE.png", "83a35c5f6376", (675, 258)),
    ("05_Private_Label_Artwork", "GOOOL_PRIVATE_LABEL_APPAREL_MASTER.png", "02ce4d42b769", None),
]

def png_size(data: bytes):
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    return int.from_bytes(data[16:20], "big"), int.from_bytes(data[20:24], "big")

failures = 0
for folder, name, sha_prefix, dims in MANIFEST:
    # accept the file under the named folder or flat in the packet root
    candidates = [PACKET / folder / name, PACKET / name]
    p = next((c for c in candidates if c.exists()), None)
    if p is None:
        print(f"MISSING  {folder}/{name}")
        failures += 1
        continue
    data = p.read_bytes()
    h = hashlib.sha256(data).hexdigest()
    ok_hash = h.startswith(sha_prefix)
    size = png_size(data) if name.endswith(".png") else None
    ok_dims = True
    dim_note = ""
    if dims and size:
        # spec dims are rounded to whole px in the manifest; allow +/-1
        ok_dims = abs(size[0] - dims[0]) <= 1 and abs(size[1] - dims[1]) <= 1
        dim_note = f" {size[0]}x{size[1]}"
    status = "OK      " if (ok_hash and ok_dims) else "FAIL    "
    if not (ok_hash and ok_dims):
        failures += 1
    detail = f"sha {h[:12]} {'==' if ok_hash else '!='} {sha_prefix}{dim_note}"
    print(f"{status}{name}  {detail}")

print()
if failures:
    print(f"{failures} problem(s) — do NOT use this packet for production until resolved.")
    sys.exit(1)
print("Packet verified: all files match the spec manifest. Cleared for production use.")
