export type DealStatus =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'quoted'
  | 'closed_won'
  | 'closed_lost';

export interface Deal {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  website: string;         // their current (bad) website or none
  callerName: string;
  status: DealStatus;
  quotedPrice: number;     // what we charge the client
  costPrice: number;       // what it costs us to build
  margin: number;          // derived: quotedPrice - costPrice
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDealBody {
  businessName: string;
  contactName: string;
  phone: string;
  email?: string;
  website?: string;
  callerName: string;
  status?: DealStatus;
  quotedPrice?: number;
  costPrice?: number;
  notes?: string;
}

export interface UpdateDealBody extends Partial<CreateDealBody> {
  status?: DealStatus;
  quotedPrice?: number;
  costPrice?: number;
}

export interface Stats {
  totalDeals: number;
  byStatus: Record<DealStatus, number>;
  totalRevenue: number;    // sum of quotedPrice for closed_won
  totalMargin: number;     // sum of margin for closed_won
  avgMarginPct: number;
  byCallerRevenue: Record<string, number>;
}
