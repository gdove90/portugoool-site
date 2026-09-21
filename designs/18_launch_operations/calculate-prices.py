from pathlib import Path
import json,math
ROOT=Path(__file__).resolve().parent
def calculate(data):
 a=data['model_assumptions'];out=[];groups={}
 costs=['supplier_garment_and_decoration_usd','label_unit_usd','label_application_usd','packaging_usd','supplier_shipping_usd','other_variable_costs_usd','setup_amortization_usd']
 denominator=1-a['domestic_card_fee_fraction']-a['return_reprint_reserve_fraction_of_item_price']-a['target_contribution_fraction_of_item_price']
 if denominator<=0:raise ValueError('Invalid margin/fee assumptions')
 for v in data['variants']:
  missing=[k for k in costs+['customer_shipping_charge_usd'] if not isinstance(v.get(k),(int,float)) or isinstance(v.get(k),bool) or v[k]<0]
  if not v.get('quote_verified') or not v.get('quote_evidence') or not v.get('quote_checked_at_utc'):missing.append('verified quote evidence and date')
  floor=None
  if not missing:
   shipping=v['customer_shipping_charge_usd'];fee=a['domestic_card_fee_fraction'];tax=a['illustrative_tax_collected_usd']
   floor=max(0,(sum(v[k] for k in costs)+a['fixed_card_fee_usd']+fee*(shipping+tax)-shipping)/denominator)
  row={'slug':v['slug'],'color':v['color'],'size':v['size'],'missing':missing,'calculated_floor_usd':math.ceil(floor*100)/100 if floor is not None else None}
  out.append(row);groups.setdefault(v['slug'],[]).append(row)
 product_prices=[]
 for slug,rows in groups.items():
  complete=all(r['calculated_floor_usd'] is not None for r in rows);step=a['retail_round_up_increment_usd']
  if step<=0:raise ValueError('Rounding increment must be positive')
  amount=math.ceil(max(r['calculated_floor_usd'] for r in rows)/step)*step if complete else None
  product_prices.append({'slug':slug,'uniform_price_candidate_usd':amount,'status':'cost_model_candidate_requires_final_review' if complete else 'blocked_unverified_costs','website_publish_authorized':False})
 return {'status':'all_costs_verified_review_required' if all(not r['missing'] for r in out) else 'blocked_unverified_costs','variants':out,'products':product_prices}
if __name__=='__main__':
 result=calculate(json.loads((ROOT/'COST-INPUTS.json').read_text(encoding='utf8')))
 (ROOT/'PRICE-CALCULATION.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf8')
 print(json.dumps({'status':result['status'],'variants':len(result['variants']),'unverified_variants':sum(bool(v['missing']) for v in result['variants']),'prices_published':False}))
