import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db, computeMargin, CALLERS } from '../db.js';
import type { Deal, DealStatus, CreateDealBody, UpdateDealBody, Stats } from '../types/index.js';

const router = Router();

const VALID_STATUSES: DealStatus[] = [
  'new', 'contacted', 'interested', 'quoted', 'closed_won', 'closed_lost',
];

// GET /api/deals
router.get('/', (req: Request, res: Response) => {
  let results = [...db];

  if (req.query.status) {
    results = results.filter(d => d.status === req.query.status);
  }
  if (req.query.caller) {
    results = results.filter(d => d.callerName === req.query.caller);
  }
  if (req.query.q) {
    const q = (req.query.q as string).toLowerCase();
    results = results.filter(d =>
      d.businessName.toLowerCase().includes(q) ||
      d.contactName.toLowerCase().includes(q) ||
      d.phone.includes(q)
    );
  }

  results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  res.json(results);
});

// GET /api/deals/stats
router.get('/stats', (_req: Request, res: Response) => {
  const wonDeals = db.filter(d => d.status === 'closed_won');

  const byStatus = VALID_STATUSES.reduce((acc, s) => {
    acc[s] = db.filter(d => d.status === s).length;
    return acc;
  }, {} as Record<DealStatus, number>);

  const totalRevenue = wonDeals.reduce((s, d) => s + d.quotedPrice, 0);
  const totalMargin = wonDeals.reduce((s, d) => s + d.margin, 0);
  const avgMarginPct = totalRevenue > 0 ? Math.round((totalMargin / totalRevenue) * 100) : 0;

  const byCallerRevenue: Record<string, number> = {};
  CALLERS.forEach(c => { byCallerRevenue[c] = 0; });
  wonDeals.forEach(d => {
    byCallerRevenue[d.callerName] = (byCallerRevenue[d.callerName] ?? 0) + d.margin;
  });

  const stats: Stats = {
    totalDeals: db.length,
    byStatus,
    totalRevenue,
    totalMargin,
    avgMarginPct,
    byCallerRevenue,
  };

  res.json(stats);
});

// GET /api/deals/:id
router.get('/:id', (req: Request, res: Response) => {
  const deal = db.find(d => d.id === req.params.id);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });
  return res.json(deal);
});

// POST /api/deals
router.post('/', (req: Request, res: Response) => {
  const body = req.body as CreateDealBody;

  if (!body.businessName || !body.contactName || !body.phone || !body.callerName) {
    return res.status(400).json({ error: 'businessName, contactName, phone, callerName are required' });
  }

  if (!CALLERS.includes(body.callerName)) {
    return res.status(400).json({ error: `callerName must be one of: ${CALLERS.join(', ')}` });
  }

  const quoted = body.quotedPrice ?? 0;
  const cost = body.costPrice ?? 0;
  const now = new Date().toISOString();

  const deal: Deal = {
    id: uuidv4(),
    businessName: body.businessName,
    contactName: body.contactName,
    phone: body.phone,
    email: body.email ?? '',
    website: body.website ?? '',
    callerName: body.callerName,
    status: body.status ?? 'new',
    quotedPrice: quoted,
    costPrice: cost,
    margin: computeMargin(quoted, cost),
    notes: body.notes ?? '',
    createdAt: now,
    updatedAt: now,
  };

  db.push(deal);
  return res.status(201).json(deal);
});

// PATCH /api/deals/:id
router.patch('/:id', (req: Request, res: Response) => {
  const idx = db.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Deal not found' });

  const body = req.body as UpdateDealBody;
  const deal = db[idx];

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  if (body.callerName && !CALLERS.includes(body.callerName)) {
    return res.status(400).json({ error: `callerName must be one of: ${CALLERS.join(', ')}` });
  }

  const quoted = body.quotedPrice !== undefined ? body.quotedPrice : deal.quotedPrice;
  const cost = body.costPrice !== undefined ? body.costPrice : deal.costPrice;

  const updated: Deal = {
    ...deal,
    ...body,
    quotedPrice: quoted,
    costPrice: cost,
    margin: computeMargin(quoted, cost),
    updatedAt: new Date().toISOString(),
  };

  db[idx] = updated;
  return res.json(updated);
});

// DELETE /api/deals/:id
router.delete('/:id', (req: Request, res: Response) => {
  const idx = db.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Deal not found' });
  db.splice(idx, 1);
  return res.status(204).send();
});

export default router;
