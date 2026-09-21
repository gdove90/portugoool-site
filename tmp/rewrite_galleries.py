import re, io

CAP = "Concept render. Not a photograph of a manufactured sample."

def arr(items, indent):
    pad = " " * indent
    lines = ["["]
    for src, alt in items:
        lines.append(pad + "  {")
        lines.append(pad + '    src: "/products/' + src + '",')
        lines.append(pad + '    alt: "' + alt + '",')
        lines.append(pad + '    caption: "' + CAP + '",')
        lines.append(pad + "  },")
    lines.append(pad + "]")
    return "\n".join(lines)

def four(k, name, c, model_files=None):
    items = [
        ("GOOOL_STD_%s_FRONT.webp" % k, "%s in %s, front view" % (name, c)),
        ("GOOOL_STD_%s_BACK.webp" % k, "%s in %s, back view" % (name, c)),
    ]
    if model_files:
        items += model_files
    else:
        items += [
            ("GOOOL_STADIUM_%s_FRONT.webp" % k, "Model wearing the %s in %s outside a stadium, front view" % (name, c)),
            ("GOOOL_STADIUM_%s_BACK.webp" % k, "Model wearing the %s in %s outside a stadium, back view" % (name, c)),
        ]
    return items

def athletics_models(prefix, name):
    return [
        (prefix + "_MODEL_FRONT.webp", "Model wearing the %s outside a stadium, front view" % name),
        (prefix + "_MODEL_BACK.webp", "Model wearing the %s outside a stadium, back view" % name),
    ]

MAP = {
 "GOOOL_MOCKUP_01_ST720_PERFORMANCE_TEE_BLACK.png": four("PERFORMANCE_BLACK", "GOOOL Performance Badge Tee", "black"),
 "GOOOL_MOCKUP_05_ST720_PERFORMANCE_TEE_WHITE_V2.png": four("PERFORMANCE_WHITE", "GOOOL Performance Badge Tee", "white"),
 "GOOOL_MOCKUP_08_ST720_PERFORMANCE_TEE_TRUE_ROYAL_V3.png": four("PERFORMANCE_ROYAL", "GOOOL Performance Badge Tee", "true royal"),
 "GOOOL_MOCKUP_02_IND4000_HOODIE_BLACK.png": four("HOODIE_BLACK", "GOOOL Core Hoodie", "black"),
 "GOOOL_MOCKUP_06_IND4000_HOODIE_BONE_V2.png": four("HOODIE_BONE", "GOOOL Core Hoodie", "bone"),
 "GOOOL_MOCKUP_03_4810GD_CASUAL_TEE_WASHED_BLACK.png": four("CASUAL_WASHED_BLACK", "GOOOL Casual Wordmark Tee", "washed black"),
 "GOOOL_MOCKUP_07_4810GD_CASUAL_TEE_WASHED_GREY_V2.png": four("CASUAL_WASHED_GREY", "GOOOL Casual Wordmark Tee", "washed grey"),
 "GOOOL_MOCKUP_04_OTTO31069_CAP_BLACK_NATURAL.png": four("TOUCHLINE_CAP", "GOOOL Touchline Cap", "black and natural"),
 "GOOOL_ATHLETICS_01_MODERN_SPORT_FRONT.webp": four("MODERN_SPORT", "GOOOL Athletics Modern Sport Tee", "black",
    athletics_models("GOOOL_ATHLETICS_01_MODERN_SPORT", "GOOOL Athletics Modern Sport Tee")),
 "GOOOL_ATHLETICS_02_VARSITY_FRONT.webp": four("VARSITY", "GOOOL Athletics Varsity Tee", "washed black",
    athletics_models("GOOOL_ATHLETICS_02_VARSITY", "GOOOL Athletics Varsity Tee")),
 "GOOOL_ATHLETICS_03_MINIMAL_CLUB_FRONT.webp": four("MINIMAL_CLUB", "GOOOL Athletics Minimal Club Tee", "natural cream",
    athletics_models("GOOOL_ATHLETICS_03_MINIMAL_CLUB", "GOOOL Athletics Minimal Club Tee")),
 "GOOOL_ATHLETICS_CIRCLE_08_BADGE_TEE.webp": four("CIRCULAR_BADGE", "GOOOL Athletics Circular Badge Tee", "ivory"),
 "GOOOL_ATHLETICS_CIRCLE_09_CENTER_CREWNECK.webp": four("CIRCULAR_CREWNECK", "GOOOL Athletics Circular Center Crewneck", "gray heather"),
}

src = open("src/lib/products.ts", encoding="utf-8").read()
out = io.StringIO()
i = 0
count = 0
pat = re.compile(r"images: \[")
while True:
    m = pat.search(src, i)
    if not m:
        out.write(src[i:])
        break
    start = m.end() - 1
    depth = 0
    j = start
    while True:
        ch = src[j]
        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                break
        j += 1
    body = src[start:j + 1]
    first = re.search(r'src: "/products/([^"]+)"', body)
    key = first.group(1) if first else None
    if key in MAP:
        indent = m.start() - src.rfind("\n", 0, m.start()) - 1
        out.write(src[i:m.end() - 1])
        out.write(arr(MAP[key], indent))
        count += 1
    else:
        out.write(src[i:j + 1])
    i = j + 1

open("src/lib/products.ts", "w", encoding="utf-8", newline="\n").write(out.getvalue())
print("replaced arrays:", count)
