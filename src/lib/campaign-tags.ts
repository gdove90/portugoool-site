/** Only short campaign labels travel from the landing URL to the order. */
export function campaignTag(value: string | null | undefined): string | null {
  const tag = value?.trim().toLowerCase();
  return tag && /^[a-z][a-z0-9_-]{0,63}$/.test(tag) ? tag : null;
}

export const campaignFields = ['campaign', 'source', 'medium'] as const;
type CampaignField = typeof campaignFields[number];
export type CampaignTags = Partial<Record<CampaignField, string>>;

export function campaignTags(read: (field: CampaignField) => string | null | undefined): CampaignTags {
  const tags: CampaignTags = {};
  for (const field of campaignFields) {
    const tag = campaignTag(read(field));
    if (tag) tags[field] = tag;
  }
  return tags;
}
