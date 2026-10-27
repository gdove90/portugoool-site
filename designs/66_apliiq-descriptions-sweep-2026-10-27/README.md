# Apliiq design descriptions: brand copy sweep — 2026-10-27

Owner rule (2026-10-27): product descriptions never sound like a
print-on-demand company. They talk about the benefits of wearing the
piece (movement, comfort, what it is good for), drawn from the maker's
specs and reworded in brand language. No supplier names, blank codes or
on-demand wording.

Audit of the 36 live Apliiq designs' description field (`#designedDescription`,
read through same-origin iframes in the owner's Chrome):

| Product | Designs | Before | After |
|---|---|---|---|
| GA Matchday Cap, Stacked Stadium Cap | 8 | brand copy already ("Made for the match...") | left as is |
| Warm-Up Tee | 6206620, 6206254, 6206255, 6206257, 6206263, 6206681 | supplier default ("Elevate Your Workout with the Sustainable...") | brand copy below |
| Match Day Tee | 6206229, 6206234, 6206236, 6206239, 6206241, 6206251 | supplier default | brand copy below |
| Core Shorts | 6208695, 6208705, 6208713 | supplier default ("Customize Your Comfort with Men's Active...") | brand copy below |
| Heritage Hoodie | 6210750, 6210742, 6210734, 6210732 | supplier default ("The Foundation Hoodie Behind Serious Brands") | brand copy below |
| Core Hoodie | 6206733, 6206746, 6206741, 6206737 | supplier default | brand copy below |
| Core Everyday Raincoat | 6240401, 6240414, 6240424 | brand copy already ("From warm-ups to whatever's next") | left as is |
| Core Jogger | 6242924, 6242929 | supplier default | rewritten earlier today (designs/65) |

## Copy applied

**Warm-Up Tee.** Made for the first touch of the session. A lightweight recycled performance knit that wicks sweat and dries fast, so it stays light through rondos, sprints and the cool-down. Set-in sleeves follow the line of the shoulder and leave your arm its full swing, and the taped neck sits smooth with nothing raw against the skin. GA monogram on the chest, GOAL ATHLETICS stacked across the upper back.

**Match Day Tee.** The tee for the day it counts. A lightweight recycled performance knit wicks sweat and dries fast, from the warm-up to the final whistle and the walk out after. Set-in sleeves move with the shoulder and the taped neck sits smooth against the skin, so nothing pulls your focus from the game. GA monogram and GOAL ATHLETICS lockup across the chest, clean back.

**Core Shorts.** Short, light and quick. A featherweight stretch fabric moves with every stride and dries fast, and the split sides give your kick its full swing. An elastic waist with an outside drawcord stays put through sprints and shuttles, while two side pockets and a zip back pocket keep keys safe for the whole session. GA monogram on the left leg just above the hem, clean back.

**Heritage Hoodie / Core Hoodie.** Heavyweight warmth for the touchline, the drive home and the cold mornings before training. Ten-ounce fleece with a soft brushed inside holds the heat in, and the fleece-lined hood keeps the wind off your neck. Ribbed cuffs hold the sleeve where you want it, the kangaroo pocket takes cold hands, and the generous cut hangs the way a hoodie should, with room to layer over a tee. Heritage: GA monogram on the chest and a small GA on the left sleeve above the cuff. Core: GA monogram and GOAL ATHLETICS lockup across the chest.

Method: in a same-origin iframe per design, set the jHtmlArea editor
(`ta.jhtmlareaObject.html(html); updateTextArea()`), click the yellow
save under the title, then reload and read the field back.

Verified 2026-10-27 by reloading every design: all 23 rewritten fields read back as the brand copy (empty reads during the first pass were a timing race before the field populated).
