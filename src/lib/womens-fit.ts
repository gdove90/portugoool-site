export interface FitFact { label: string; value: string }
export interface WomensFit { summary: string; facts: FitFact[] }

function profile(summary: string, fit: string, length: string, stretch: string, sizing: string): WomensFit {
  return { summary, facts: [
    { label: "Fit", value: fit },
    { label: "Length & coverage", value: length },
    { label: "Fabric & stretch", value: stretch },
    { label: "Choosing your size", value: sizing },
  ] };
}

// Customer-facing guidance, reviewed garment by garment on 2026-11-07.
// Source measurements and review limitations live in docs/catalog, not here.
export const WOMENS_FIT: Record<string, WomensFit> = {
  "80000000-0000-4000-8000-000000000017": profile(
    "Regular women's cut with room through the body. Compare bust and back body length before choosing your size.",
    "Regular women's cut with room through the body and set-in short sleeves.",
    "Full-length tee with a straight hem. Body length is measured at the back, from the high shoulder point to the hem.",
    "100% polyester interlock, 3.8 oz. No added spandex.",
    "Start with the body bust range, then compare the flat bust width and back length with a tee you like. For more room, choose the larger measurements."
  ),
  "80000000-0000-4000-8000-000000000018": profile(
    "Fitted stretch layer with a mock neck and thumbhole sleeves. Compare bust, shoulder, body and sleeve measurements for your preferred room to layer.",
    "Fitted through the body, with a mock neck and set-in long sleeves.",
    "Straight body hem and thumbhole cuffs. Check both body and sleeve length for the coverage you prefer.",
    "91% polyester / 9% spandex, 165 gsm stretch knit.",
    "Compare bust and shoulder widths with a fitted stretch top. Check sleeve length from the shoulder seam. For a layer underneath, choose measurements with enough extra room."
  ),
  "80000000-0000-4000-8000-000000000019": profile(
    "Women's tapered training pant with an adjustable drawcord waist and ankle zippers. Choose using waist, hip and inseam measurements.",
    "Women's cut with an adjustable drawcord waist, side pockets and a tapered leg.",
    "Full-length legs with extended ankle zippers. Inseam varies by size; it is measured from the crotch seam to the hem.",
    "100% recycled polyester double knit. No added spandex; adjust the waist with the drawcord.",
    "Check both body waist and hip ranges. If they fall in different rows, use the larger size, then compare the flat waist, hip and inseam with pants you own."
  ),
  "80000000-0000-4000-8000-000000000020": profile(
    "Classic women's fit with a mid-length body and semi-set-in sleeves. Compare bust width and body length with a hoodie you like.",
    "Classic women's fit with semi-set-in sleeves, a drawcord-free hood and ribbed cuffs and hem.",
    "Mid-length body. Check the shoulder-to-hem measurement for your preferred coverage.",
    "52% cotton / 48% polyester fleece, 8 oz. Pre-shrunk, with no added spandex.",
    "Compare flat bust width and body length with a similar hoodie. For room to layer, choose extra width with the body length you prefer."
  ),
  "80000000-0000-4000-8000-000000000021": profile(
    "Close cut through the body, narrower than the Core Training Tee at the same size. Compare bust, shoulder and body measurements.",
    "Close cut through the body and shoulders, with a crew neck and set-in short sleeves.",
    "Straight hem and a shorter body than the Core Training Tee at the same size. Check the body-length column for coverage.",
    "100% polyester, 130 gsm. No added spandex.",
    "Compare bust and shoulder widths with a tee that fits comfortably. This tee is narrower than the Core Training Tee at the same letter size; use its own chart."
  ),
  "80000000-0000-4000-8000-000000000022": profile(
    "Relaxed short with a wide stretch waistband and built-in liner. Inseam varies from 3.5 to 4.25 inches across the offered sizes.",
    "Relaxed leg opening, wide flat knit waistband and a built-in liner, with an exterior waistband phone pocket.",
    "Short cut with a curved hem. Inseam is 3.5 in for S/M, 3.75 in for L/XL and 4.25 in for XXL; the table also converts to centimeters.",
    "90% polyester / 10% spandex shell; 86% polyester / 14% spandex waistband; 100% polyester liner.",
    "Check both body waist and hip ranges, then compare flat waist and hip widths. If your waist and hips fall in different rows, use the larger size. Check the inseam for your size."
  ),
  "80000000-0000-4000-8000-000000000025": profile(
    "Fitted cropped racerback with fixed straps and an underbust band. Compare both bust and underbust widths with a similar stretch bra.",
    "Fitted pull-on racerback with fixed shoulder straps and a scoop neck.",
    "Cropped body with a fitted underbust band. Check the shoulder-to-hem length for coverage.",
    "89% polyester / 11% spandex, 230 gsm stretch knit.",
    "Compare the relaxed bust, underbust and body length with a similar stretch bra. S–XL are letter sizes; no cup-size conversion or impact-support rating is published for this style."
  ),
  "80000000-0000-4000-8000-000000000026": profile(
    "Fitted high-rise leggings with ankle-length legs. Compare relaxed waist and hip widths; full length is measured from waistband to hem.",
    "Fitted from the high-rise elastic waist through the leg to the ankle.",
    "Ankle-length cut. Full length is waistband to hem, not inseam; where the hem sits depends on your height and proportions.",
    "75% nylon / 25% spandex, 220 gsm stretch knit.",
    "Compare relaxed waist and hip widths with stretch leggings you own. These unstretched flat widths are not body circumferences. Check full length before choosing your size."
  ),
};

export function womensFitFor(productId: string): WomensFit | undefined {
  return WOMENS_FIT[productId];
}
