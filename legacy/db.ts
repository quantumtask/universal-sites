import { v4 as uuidv4 } from 'uuid';
import type { Deal, DealStatus } from '../types/index.js';

const now = new Date().toISOString();

const CALLERS = [
  'Sipho M', 'Ayesha K', 'Thabo N', 'Riya P', 'Luca B',
  'Zanele D', 'Marco F', 'Priya S', 'Kwame A', 'Ingrid V',
];

function makeDeal(overrides: Partial<Deal>): Deal {
  const quoted = overrides.quotedPrice ?? 0;
  const cost = overrides.costPrice ?? 0;
  return {
    id: uuidv4(),
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    website: '',
    callerName: CALLERS[0],
    status: 'new',
    quotedPrice: quoted,
    costPrice: cost,
    margin: quoted - cost,
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

export const db: Deal[] = [
  makeDeal({ businessName: 'Sunrise Plumbing', contactName: 'Dave Rossouw', phone: '082 111 2233', callerName: 'Sipho M', status: 'closed_won', quotedPrice: 18000, costPrice: 4000, notes: 'Needed e-commerce for parts', createdAt: '2024-12-01T09:00:00Z' }),
  makeDeal({ businessName: 'Golden Gate Bakery', contactName: 'Sandra Venter', phone: '073 445 6677', callerName: 'Ayesha K', status: 'quoted', quotedPrice: 12000, costPrice: 3000, notes: 'Menu + online ordering', createdAt: '2025-01-10T11:00:00Z' }),
  makeDeal({ businessName: 'Apex Legal', contactName: 'Brian Dlamini', phone: '011 234 5678', callerName: 'Thabo N', status: 'interested', quotedPrice: 25000, costPrice: 6000, notes: 'Needs case management portal', createdAt: '2025-02-15T14:00:00Z' }),
  makeDeal({ businessName: 'Fresh Threads', contactName: 'Naledi Khumalo', phone: '084 321 4455', callerName: 'Riya P', status: 'closed_won', quotedPrice: 15000, costPrice: 3500, notes: 'Fashion boutique Shopify', createdAt: '2025-01-22T10:00:00Z' }),
  makeDeal({ businessName: 'Peak Auto', contactName: 'Gerrie Botha', phone: '072 998 7766', callerName: 'Luca B', status: 'contacted', quotedPrice: 10000, costPrice: 2500, notes: 'Basic 5-page site', createdAt: '2025-03-01T08:00:00Z' }),
  makeDeal({ businessName: 'City Dental', contactName: 'Dr Fatima Hassan', phone: '011 876 5432', callerName: 'Zanele D', status: 'closed_won', quotedPrice: 22000, costPrice: 5000, notes: 'Booking system + patient portal', createdAt: '2025-02-05T09:30:00Z' }),
  makeDeal({ businessName: 'Mountain Gym', contactName: 'Kyle Peters', phone: '082 555 1234', callerName: 'Marco F', status: 'closed_lost', quotedPrice: 8000, costPrice: 2000, notes: 'Went with freelancer', createdAt: '2025-01-18T12:00:00Z' }),
  makeDeal({ businessName: 'Bloom Florists', contactName: 'Mary Steyn', phone: '074 222 3344', callerName: 'Priya S', status: 'new', quotedPrice: 0, costPrice: 0, notes: 'Called back Thursday', createdAt: '2025-03-10T16:00:00Z' }),
  makeDeal({ businessName: 'Coastal Stays', contactName: 'Jan van Wyk', phone: '083 667 8899', callerName: 'Kwame A', status: 'quoted', quotedPrice: 30000, costPrice: 7000, notes: 'Booking engine, multi-property', createdAt: '2025-03-05T11:00:00Z' }),
  makeDeal({ businessName: 'TechFix SA', contactName: 'Mpho Sithole', phone: '011 345 6789', callerName: 'Ingrid V', status: 'closed_won', quotedPrice: 14000, costPrice: 3200, notes: 'Repair shop + ticketing', createdAt: '2025-02-28T09:00:00Z' }),
];

export { CALLERS };

export function computeMargin(quoted: number, cost: number): number {
  return quoted - cost;
}
