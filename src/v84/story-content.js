// Canonical approved story markup, shared with the reference import.
export function storyMarkup(hero) {
  return hero({
    kind: 'collection-hero our-world-hero',
    image: '/v84/editorial/our-world-staircase-20261108.webp',
    imageAlt: 'Three stages of an athlete ascending a white tiled staircase in GOAL Athletics apparel, with red GOAL Athletics lettering on the wall',
    label: '',
    title: 'Our roots.<br>Our future.',
    subtitle: 'A goal is just the beginning.<br>Then comes the work.',
    actions: '<a class="btn white depth-button story-cta" href="/shop">Shop GOAL Athletics <span class="mobile-hide-emoji-arrow" aria-hidden="true">↗</span></a>',
    bottom: true,
    bottomContent: '<span class="story-bottom-rule" aria-hidden="true"></span><span>BORN IN RHODE ISLAND. INSPIRED BY SOCCER.</span>',
  }) + `
<section class="story-open">
  <h2>The GOAL<br>mindset.</h2>
  <div class="story-moments" id="brand-purpose">
    <p><span>01</span>Soccer is our heritage.</p>
    <p><span>02</span>Athleticwear is our identity.</p>
    <p><span>03</span>Evolution is our purpose.</p>
  </div>
</section>
<section class="story-split">
  <div class="story-photo"><img src="/v84/editorial/our-world-recovery-20261108.png" alt="Athlete in a navy GOAL Athletics hoodie seated beside a floodlit field" loading="lazy" width="1122" height="1402" style="object-position:center top"></div>
  <div class="story-statement">
    <div class="story-opening">
      <h2 class="story-brand"><img src="/brand/goal-athletics-horizontal-black-v13.png" alt="GOAL Athletics" width="3000" height="821" loading="lazy"></h2>
      <p class="story-sentence">GOAL Athletics is rooted in Rhode Island and inspired by soccer. The game shaped our identity: the discipline, the shared ambition, and the commitment to keep getting better. We carry that spirit beyond the pitch into athleticwear for training, play, and recovery, whatever your sport. Evolution is our purpose. It guides the brand we’re building and reflects the people we’re building it for: people with something to work toward, and the drive to keep going.</p>
    </div>
  </div>
</section>
<section class="story-close">
  <p class="eyebrow">THE ATHLETIC CYCLE. ACROSS SPORTS.</p>
  <h2><span>Train. Play. Recover.</span><span>Then go again.</span></h2>
  <div class="story-shop-links">
    <a class="btn white depth-button story-cta" href="/men">Shop men <span class="mobile-hide-emoji-arrow" aria-hidden="true">↗</span></a>
    <a class="btn white depth-button story-cta" href="/women">Shop women <span class="mobile-hide-emoji-arrow" aria-hidden="true">↗</span></a>
  </div>
</section>`;
}
