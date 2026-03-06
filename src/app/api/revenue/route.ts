import { NextResponse } from 'next/server';

const STRIPE_KEY = process.env.STRIPE_RESTRICTED_KEY || process.env.STRIPE_API_KEY;

export async function GET() {
  if (!STRIPE_KEY) {
    return NextResponse.json({ mrr: 0, subscribers: 0, error: 'No Stripe key configured' });
  }

  try {
    const res = await fetch(
      'https://api.stripe.com/v1/subscriptions?limit=100&status=active&expand[]=data.items',
      {
        headers: { Authorization: `Bearer ${STRIPE_KEY}` },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      console.error('Stripe error:', await res.text());
      return NextResponse.json({ mrr: 0, subscribers: 0, error: 'Stripe request failed' });
    }

    const data = await res.json();
    const subscriptions = data.data ?? [];

    let mrr = 0;
    for (const sub of subscriptions) {
      for (const item of sub.items?.data ?? []) {
        const amount = item.price?.unit_amount ?? 0;
        const interval = item.price?.recurring?.interval;
        const intervalCount = item.price?.recurring?.interval_count ?? 1;
        const qty = item.quantity ?? 1;

        let monthly = 0;
        if (interval === 'month') monthly = (amount * qty) / intervalCount;
        else if (interval === 'year') monthly = (amount * qty) / (12 * intervalCount);
        else if (interval === 'week') monthly = (amount * qty * 52) / (12 * intervalCount);
        mrr += monthly;
      }
    }

    const mrrDollars = Math.round(mrr / 100);
    return NextResponse.json({
      mrr: mrrDollars,
      subscribers: subscriptions.length,
      goal: 10000,
      pct: Math.round((mrrDollars / 10000) * 100),
    });
  } catch (err) {
    console.error('Revenue fetch error:', err);
    return NextResponse.json({ mrr: 0, subscribers: 0, error: String(err) });
  }
}
