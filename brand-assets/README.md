# brand-assets

The single source that Claude Design, Grok Imagine and Higgsfield are
pointed at. Everything here is a reference for making assets; the code
never imports from it.

```
brand-assets/
  avatars/                     the four fixed people (Greg, Jeff, Alex, Andrew)
    README.md                  rules of the set
    PROMPTS.md                 character cards and the Grok Imagine prompts that made them
    AVATARS.md                 roster, source file per view, pixel size, THUMBNAIL flags
    <name>/<name>_{front,back,left,right}.png  (+ alex_movement.mp4)
  prompts/
    claude-design-tasks.md     Prompt 0 brand brief, the 12 Claude Design tasks,
                               and the Grok Imagine product and lifestyle appendix
    live-catalog-for-grok.md   everything for sale today, per product, with Grok prompts
    grok-scene-prompts.md      the ledge scene: every prompt run on 2026-09-30, what landed, the ball and mark descriptions
  reels/
    reel-01-wear-the-feeling/  BRIEF.md (shot-by-shot remake plan), reference.mp4,
                               contact-sheet.png, the product images and lockups Grok needs
  instagram/
    feed/  story/  reel/       everything we are thinking of posting, by placement; README has sizes and rules
  README.md                    this index
```

Where things came from: `prompts/claude-design-tasks.md` is the file
`goool-claude-design-prompts.md` saved to Downloads on 2026-09-30, copied
verbatim.

One caution for anyone reading the prompt guide: it describes the line as
planned (three tri-blend colorways, the 3413 performance tee, quarter zip,
fleece short). What exists today is whatever goool.shop sells; the live
catalog in `src/lib/products.ts` is the source of truth for products,
colorways and prices, and the guide does not change it.
