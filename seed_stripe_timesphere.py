"""
The Time Sphere — Stripe Product Seeder
Run once to create Pro and Elite subscription products in Stripe.

Usage:
    STRIPE_SECRET_KEY=sk_live_xxx python seed_stripe_timesphere.py

After running, copy the printed price IDs to Railway environment variables:
    STRIPE_PRO_MONTHLY_PRICE_ID
    STRIPE_PRO_ANNUAL_PRICE_ID
    STRIPE_ELITE_MONTHLY_PRICE_ID
    STRIPE_ELITE_ANNUAL_PRICE_ID

Safe to run multiple times — checks for existing products by name.
"""
import os, sys

try:
    import stripe
except ImportError:
    sys.exit("Run: pip install stripe")

stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', '')
if not stripe.api_key:
    sys.exit("Set STRIPE_SECRET_KEY environment variable before running.")

mode = 'LIVE' if stripe.api_key.startswith('sk_live_') else 'TEST'
print(f"\n{'='*50}")
print(f"The Time Sphere — Stripe Product Seeder ({mode} MODE)")
print(f"{'='*50}\n")

def get_or_create_product(name, description):
    results = stripe.Product.search(query=f'name:"{name}"', limit=1)
    if results['data']:
        p = results['data'][0]
        print(f"  Found existing product: {p['id']} — {name}")
        return p['id']
    p = stripe.Product.create(name=name, description=description)
    print(f"  Created product: {p['id']} — {name}")
    return p['id']

def get_or_create_price(product_id, unit_amount, currency, interval, interval_count, nickname):
    prices = stripe.Price.list(product=product_id, active=True, limit=20)
    for price in prices['data']:
        rec = price.get('recurring') or {}
        if (price['unit_amount'] == unit_amount and
                rec.get('interval') == interval and
                rec.get('interval_count') == interval_count):
            print(f"    Found existing price: {price['id']} — {nickname}")
            return price['id']
    p = stripe.Price.create(
        product=product_id,
        unit_amount=unit_amount,
        currency=currency,
        recurring={'interval': interval, 'interval_count': interval_count},
        nickname=nickname,
    )
    print(f"    Created price: {p['id']} — {nickname}")
    return p['id']

print("Creating Pro Plan ($12/mo · $99/yr)...")
pro_id = get_or_create_product(
    'The Time Sphere Pro',
    'Ad-free, unlimited Time Zone Converter, Meeting Planner, save favorite cities.'
)
pro_monthly = get_or_create_price(pro_id, 1200, 'usd', 'month', 1, 'Pro Monthly $12')
pro_annual  = get_or_create_price(pro_id, 9900, 'usd', 'year',  1, 'Pro Annual $99')

print("\nCreating Elite Plan ($69/mo · $599/yr)...")
elite_id = get_or_create_product(
    'The Time Sphere Elite',
    'Charter Flight Finder, Executive Route Builder, AI Venue Recommendations, Sanctum Mode UI.'
)
elite_monthly = get_or_create_price(elite_id,  6900, 'usd', 'month', 1, 'Elite Monthly $69')
elite_annual  = get_or_create_price(elite_id, 59900, 'usd', 'year',  1, 'Elite Annual $599')

print(f"\n{'='*50}")
print("DONE — Copy these to Railway environment variables:")
print(f"{'='*50}")
print(f"STRIPE_PRO_MONTHLY_PRICE_ID={pro_monthly}")
print(f"STRIPE_PRO_ANNUAL_PRICE_ID={pro_annual}")
print(f"STRIPE_ELITE_MONTHLY_PRICE_ID={elite_monthly}")
print(f"STRIPE_ELITE_ANNUAL_PRICE_ID={elite_annual}")
print(f"\nAlso add to Railway:")
print(f"STRIPE_SECRET_KEY=<your key>")
print(f"CLERK_PUBLISHABLE_KEY=<your Clerk publishable key>")
print(f"{'='*50}\n")
