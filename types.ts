
export type ContentType = 'Post' | 'Video' | 'Photo' | 'Reel';
export type Platform = 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn' | 'Twitter' | 'Facebook';
export type ContentStatus = 'Planned' | 'Posted';
export type FinanceType = 'Income' | 'Expense' | 'Ad Budget';

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  handle: string;
}

export interface ContentItem {
  id: string;
  brandId: string;
  type: ContentType;
  platform: Platform;
  status: ContentStatus;
  date: string; // ISO string
  title: string;
  caption: string;
  notes: string;
}

export interface FinanceEntry {
  id: string;
  brandId: string;
  type: FinanceType;
  amount: number;
  description: string;
  date: string;
}

export interface PlannerState {
  brands: Brand[];
  content: ContentItem[];
  finances: FinanceEntry[];
}
