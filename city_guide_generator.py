#!/usr/bin/env python3
"""
Time Sphere Monthly City Guide Generator
Generates monthly city guide blog articles for all Time Sphere cities using
OpenRouter's web search capability.

Usage:
  python city_guide_generator.py --batch 10          # 10-city test batch (July 2026)
  python city_guide_generator.py --city houston      # single city
  python city_guide_generator.py --all               # all 215+ cities
  python city_guide_generator.py --month july --year 2026  # specific month/year
"""

import os
import sys
import json
import time
import re
import argparse
import urllib.parse
from datetime import datetime
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: 'requests' not installed. Run: pip install requests")
    sys.exit(1)

try:
    from zoneinfo import ZoneInfo
    HAS_ZONEINFO = True
except ImportError:
    HAS_ZONEINFO = False

# ─── Paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR  = Path(__file__).parent
ENV_PATH    = Path(r'C:\OMD\Akio\.env')
BLOG_DIR    = SCRIPT_DIR / 'blog'
APPJS_PATH  = SCRIPT_DIR / 'app.js'
CARDS_JSON  = SCRIPT_DIR / 'blog_cards_update.json'
SITEMAP_TXT = SCRIPT_DIR / 'new_sitemap_entries.txt'
FAILED_LOG  = SCRIPT_DIR / 'failed_cities.txt'

# ─── OpenRouter config ─────────────────────────────────────────────────────────
OR_BASE        = 'https://openrouter.ai/api/v1/chat/completions'
RESEARCH_MODEL = 'deepseek/deepseek-chat-v3-0324:online'
GENERATE_MODEL = 'deepseek/deepseek-chat-v3-0324'
REQUEST_DELAY  = 2  # seconds between cities

# ─── Content filters ───────────────────────────────────────────────────────────
BANNED = [
    'cures', 'treats', 'heals', 'diagnoses', 'before and after',
    'lose weight', 'weight loss', 'medical', 'clinical', 'proven to',
]

# ─── Month constants ───────────────────────────────────────────────────────────
MONTH_NAMES = ['January','February','March','April','May','June',
               'July','August','September','October','November','December']
MONTH_SLUGS = ['january','february','march','april','may','june',
               'july','august','september','october','november','december']

# ─── TripAdvisor geo IDs ───────────────────────────────────────────────────────
TA_GEO = {
    'houston':'g56003',     'new-york':'g60763',    'los-angeles':'g32655',
    'chicago':'g35805',     'phoenix':'g31310',     'philadelphia':'g60795',
    'san-antonio':'g60956', 'san-diego':'g60750',   'dallas':'g55711',
    'seattle':'g60878',     'denver':'g33388',      'boston':'g60745',
    'miami':'g34438',       'atlanta':'g60898',     'portland':'g52024',
    'austin':'g30196',      'nashville':'g55229',   'london':'g186338',
    'paris':'g187147',      'tokyo':'g298184',      'sydney':'g255060',
    'toronto':'g155019',    'dubai':'g295424',      'amsterdam':'g188590',
    'berlin':'g187323',     'rome':'g187791',       'madrid':'g187514',
    'singapore':'g294265',  'hong-kong':'g294217',  'seoul':'g294197',
    'bangkok':'g293916',    'istanbul':'g293974',   'cairo':'g294201',
}

# Cities with dedicated Moving To pages
MOVING_TO_CITIES = {'houston', 'austin', 'miami', 'new-york'}

# ─── Curated Unsplash photo IDs (static, no source.unsplash.com) ───────────────
CITY_PHOTO_IDS = {
    'houston':     {'hero':'photo-1600596542815-ffad4c1539a9','neighborhood':'photo-1558618666-fcd25c85cd64','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1519331379826-f10be5486c6f'},
    'new-york':    {'hero':'photo-1496442226666-8d4d0e62e6e9','neighborhood':'photo-1534430480872-3498386e7856','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1534430480872-3498386e7856'},
    'chicago':     {'hero':'photo-1494522855154-9297ac14b55f','neighborhood':'photo-1477959858617-67f85cf4f1df','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1507525428034-b723cf961d3e'},
    'los-angeles': {'hero':'photo-1444723121867-7a241cacace9','neighborhood':'photo-1510519138101-570d1dca3d66','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1501179691627-eeaa65ea017c'},
    'miami':       {'hero':'photo-1589083130544-0d6a2926e519','neighborhood':'photo-1535498730771-e735b998cd64','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1507525428034-b723cf961d3e'},
    'austin':      {'hero':'photo-1531218150217-54595bc2b934','neighborhood':'photo-1558492426-df04a45c5efc','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1504280390367-361c6d9f38f4'},
    'denver':      {'hero':'photo-1648441095877-90406e6ba04d','neighborhood':'photo-1546422401-68b415cbf8de','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1464822759023-fed622ff2c3b'},
    'seattle':     {'hero':'photo-1502175353174-a7a70e73b362','neighborhood':'photo-1574515944794-d6dedc7150de','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1507525428034-b723cf961d3e'},
    'atlanta':     {'hero':'photo-1575917649705-5b59aaa12e6b','neighborhood':'photo-1569761316261-9a8696fa2ca3','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1504280390367-361c6d9f38f4'},
    'nashville':   {'hero':'photo-1514320291840-2e0a9bf2a9ae','neighborhood':'photo-1558618047-3c8c76ca7d13','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1504280390367-361c6d9f38f4'},
    'default':     {'hero':'photo-1477959858617-67f85cf4f1df','neighborhood':'photo-1569761316261-9a8696fa2ca3','food':'photo-1414235077428-338989a2e8c0','events':'photo-1492684223066-81342ee5ff30','outdoors':'photo-1504280390367-361c6d9f38f4'},
}

# ─── 10-city test batch ────────────────────────────────────────────────────────
BATCH_10 = [
    {'id':'houston',     'name':'Houston',     'tz':'America/Chicago',     'state':'Texas',       'country':'USA'},
    {'id':'chicago',     'name':'Chicago',     'tz':'America/Chicago',     'state':'Illinois',    'country':'USA'},
    {'id':'new-york',    'name':'New York',    'tz':'America/New_York',    'state':'New York',    'country':'USA'},
    {'id':'los-angeles', 'name':'Los Angeles', 'tz':'America/Los_Angeles', 'state':'California',  'country':'USA'},
    {'id':'miami',       'name':'Miami',       'tz':'America/New_York',    'state':'Florida',     'country':'USA'},
    {'id':'austin',      'name':'Austin',      'tz':'America/Chicago',     'state':'Texas',       'country':'USA'},
    {'id':'denver',      'name':'Denver',      'tz':'America/Denver',      'state':'Colorado',    'country':'USA'},
    {'id':'seattle',     'name':'Seattle',     'tz':'America/Los_Angeles', 'state':'Washington',  'country':'USA'},
    {'id':'atlanta',     'name':'Atlanta',     'tz':'America/New_York',    'state':'Georgia',     'country':'USA'},
    {'id':'nashville',   'name':'Nashville',   'tz':'America/Chicago',     'state':'Tennessee',   'country':'USA'},
]


# ─── Helpers ───────────────────────────────────────────────────────────────────

def load_env():
    env = {}
    try:
        for line in ENV_PATH.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    return env


def parse_cities_from_appjs():
    """Extract all cities from app.js CITIES array."""
    text = APPJS_PATH.read_text(encoding='utf-8')
    pattern = r"id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*tz:\s*'([^']+)'"
    return [{'id': m[0], 'name': m[1], 'tz': m[2]} for m in re.findall(pattern, text)]


def get_utc_offset_str(tz_name):
    if not HAS_ZONEINFO:
        return 'UTC'
    try:
        tz = ZoneInfo(tz_name)
        total_sec = datetime.now(tz).utcoffset().total_seconds()
        h = int(total_sec // 3600)
        m = int(abs(total_sec) % 3600 // 60)
        sign = '+' if h >= 0 else ''
        if h == 0 and m == 0:
            return 'UTC'
        return f"UTC{sign}{h}:{m:02d}" if m else f"UTC{sign}{h}"
    except Exception:
        return 'UTC'


def get_tz_display(tz_name):
    """Return a human-friendly timezone name like CST or EST."""
    abbrevs = {
        'America/New_York':    'EST/EDT',
        'America/Chicago':     'CST/CDT',
        'America/Denver':      'MST/MDT',
        'America/Los_Angeles': 'PST/PDT',
        'America/Phoenix':     'MST',
        'America/Anchorage':   'AKST',
        'Pacific/Honolulu':    'HST',
        'Europe/London':       'GMT/BST',
        'Europe/Paris':        'CET/CEST',
        'Europe/Berlin':       'CET/CEST',
        'Europe/Rome':         'CET/CEST',
        'Europe/Madrid':       'CET/CEST',
        'Europe/Amsterdam':    'CET/CEST',
        'Europe/Istanbul':     'TRT',
        'Europe/Moscow':       'MSK',
        'Asia/Tokyo':          'JST',
        'Asia/Singapore':      'SGT',
        'Asia/Hong_Kong':      'HKT',
        'Asia/Seoul':          'KST',
        'Asia/Kolkata':        'IST',
        'Asia/Bangkok':        'ICT',
        'Asia/Dubai':          'GST',
        'Australia/Sydney':    'AEST/AEDT',
        'America/Toronto':     'EST/EDT',
        'America/Sao_Paulo':   'BRT',
        'America/Mexico_City': 'CST/CDT',
        'Africa/Cairo':        'EET',
        'Africa/Johannesburg': 'SAST',
    }
    return abbrevs.get(tz_name, tz_name.split('/')[-1].replace('_', ' '))


def ta_urls(city_id, city_name):
    geo = TA_GEO.get(city_id)
    slug = city_name.replace(' ', '_')
    if geo:
        rest = f"https://www.tripadvisor.com/Restaurants-{geo}-{slug}.html"
        attr = f"https://www.tripadvisor.com/Attractions-{geo}-Activities-{slug}.html"
    else:
        q = urllib.parse.quote_plus(city_name)
        rest = f"https://www.tripadvisor.com/Search?q=restaurants+{q}"
        attr = f"https://www.tripadvisor.com/Search?q=attractions+{q}"
    return rest, attr


def build_images(city_id, city_name):
    """Return 5 static Unsplash image URLs using curated photo IDs."""
    ids = CITY_PHOTO_IDS.get(city_id) or CITY_PHOTO_IDS['default']
    return {
        'hero':         f"https://images.unsplash.com/{ids['hero']}?w=1600&q=80",
        'neighborhood': f"https://images.unsplash.com/{ids['neighborhood']}?w=800&q=80",
        'events':       f"https://images.unsplash.com/{ids['events']}?w=800&q=80",
        'food':         f"https://images.unsplash.com/{ids['food']}?w=800&q=80",
        'outdoors':     f"https://images.unsplash.com/{ids['outdoors']}?w=800&q=80",
    }


def related_articles(city_id, city_name):
    if city_id in MOVING_TO_CITIES:
        slug = city_id if city_id != 'new-york' else 'new-york'
        r1 = {'url': f'/blog/moving-to-{slug}-guide', 'tag': 'Relocation Guide',
              'title': f'The Complete Guide to Moving to {city_name}'}
        r2 = {'url': '/blog/best-cities-for-digital-nomads-2026', 'tag': 'Digital Nomad Guide',
              'title': 'The 10 Best Cities for Digital Nomads in 2026'}
    else:
        r1 = {'url': '/blog/best-cities-for-digital-nomads-2026', 'tag': 'Digital Nomad Guide',
              'title': 'The 10 Best Cities for Digital Nomads in 2026'}
        r2 = {'url': '/blog/world-time-zones-for-remote-workers', 'tag': 'Remote Work',
              'title': 'How to Manage World Time Zones as a Remote Worker'}
    return r1, r2


# ─── OpenRouter API ────────────────────────────────────────────────────────────

def call_openrouter(messages, model, api_key, max_tokens=2000):
    resp = requests.post(
        OR_BASE,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://www.thetimesphere.com',
            'X-Title': 'Time Sphere City Guide Generator',
        },
        json={'model': model, 'messages': messages, 'max_tokens': max_tokens},
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json()['choices'][0]['message']['content']


def research_city(city, month_name, year, api_key):
    """Run 3 web search queries and return combined research context."""
    name = city['name']
    state = city.get('state', '')
    loc = f"{name}, {state}" if state else name
    queries = [
        f"What are the top events, news, and things happening in {loc} in {month_name} {year}?",
        f"What is the cost of living in {loc} in {year}? Include average rent, groceries, and neighborhood costs.",
        f"Best restaurants, neighborhoods, and local attractions to experience in {loc} in {month_name} {year}?",
    ]
    parts = []
    for i, q in enumerate(queries, 1):
        print(f"    [{i}/3] Researching: {q[:70]}...")
        try:
            result = call_openrouter(
                [{'role': 'user', 'content': q}],
                RESEARCH_MODEL, api_key, max_tokens=1200,
            )
            parts.append(f"=== Research {i} ===\n{result.strip()}")
            time.sleep(1)
        except Exception as e:
            print(f"    [!] Research {i} failed: {e}")
            parts.append(f"=== Research {i} ===\n[Data unavailable]")
    return '\n\n'.join(parts)


def generate_article(city, month_name, year, research_ctx, api_key):
    """Generate article title, description, and HTML body."""
    name = city['name']
    state = city.get('state', '')
    loc = f"{name}, {state}" if state else name
    utc_offset = get_utc_offset_str(city.get('tz', 'UTC'))

    system = f"""You are a professional travel writer for The Time Sphere (thetimesphere.com), a world clock and city guide website.

Write a 950-1050 word monthly city guide about {loc} for {month_name} {year}.

REQUIRED OUTPUT FORMAT — start your response with exactly these 3 lines then "---":
TITLE: [Engaging article title, 55-75 chars, include city and month/year]
DESCRIPTION: [SEO meta description, 140-160 chars, include city and month]
---
[Article HTML body below]

ARTICLE STRUCTURE — use exactly these HTML tags and markers:
<p>[Opening hook: vivid, specific, makes the reader want to visit {name} this {month_name}]</p>

<h2>{month_name} Highlights in {name}</h2>
<p>[Current month events, seasonal happenings, what makes {month_name} special here]</p>
<!-- IMG_NEIGHBORHOODS -->

<h2>Best Neighborhoods to Explore</h2>
<p>[2-3 specific neighborhoods with authentic character. Bold neighborhood names with <strong>.]</p>

<h2>Cost of Living Snapshot</h2>
<p>[Rent ranges, meal costs, transport costs, relative affordability vs. other cities]</p>

<h2>Things To Do in {month_name}</h2>
<p>[5-7 specific activities unique to this city and this month]</p>
<!-- IMG_EVENTS -->

<h2>Local Food Scene</h2>
<p>[3-4 restaurant or cuisine recommendations with personality]</p>
<!-- IMG_FOOD -->

<h2>Before You Go</h2>
<p>[2-3 practical tips specific to {month_name}: weather, what to pack, booking advice]</p>
<!-- IMG_OUTDOORS -->

RULES:
- Output ONLY the 3-line header + "---" + article HTML. No extra prose.
- Use only <h2>, <p>, <strong>, <ul>, <li> tags in the body.
- Insert the 4 image markers exactly as shown — they will be replaced with real photos.
- Be specific to this city and this month. No generic filler.
- DO NOT use: {', '.join(BANNED)}
- DO NOT include a <h1> tag — the page template provides the headline."""

    user = f"""Write the {month_name} {year} city guide for {loc}.

Use this research to inform accurate, current details:

{research_ctx}

Insert the 4 image markers at exactly the positions shown in the structure."""

    print(f"    [4/4] Generating article...")
    content = call_openrouter(
        [{'role': 'system', 'content': system}, {'role': 'user', 'content': user}],
        GENERATE_MODEL, api_key, max_tokens=2800,
    )

    # Parse header
    lines = content.split('\n', 4)
    title = f"{name} in {month_name} {year} — Things To Do, Eat & See"
    description = f"Your complete guide to {name} in {month_name} {year} — events, restaurants, neighborhoods, cost of living, and local tips."
    body = content

    if len(lines) >= 4 and lines[0].startswith('TITLE:'):
        title = lines[0].replace('TITLE:', '').strip()[:80]
        if lines[1].startswith('DESCRIPTION:'):
            description = lines[1].replace('DESCRIPTION:', '').strip()[:165]
        if lines[2].strip() == '---':
            body = '\n'.join(lines[3:]).strip()

    return title, description, body


def compliance_check(text):
    low = text.lower()
    return [p for p in BANNED if p in low]


def sanitize_body(body):
    """Convert any leaked markdown to HTML and clean up artifacts."""
    body = re.sub(r'^##\s+(.+)$', r'<h2>\1</h2>', body, flags=re.MULTILINE)
    body = re.sub(r'^###\s+(.+)$', r'<h3>\1</h3>', body, flags=re.MULTILINE)
    body = re.sub(r'^#\s+(.+)$', r'<h2>\1</h2>', body, flags=re.MULTILINE)
    body = re.sub(r'\*\*([^*\n]{1,80})\*\*', r'<strong>\1</strong>', body)
    body = re.sub(r'\*([^*\n]{1,60})\*', r'<em>\1</em>', body)
    # Remove any stray backtick code blocks
    body = re.sub(r'```[^`]*```', '', body, flags=re.DOTALL)
    return body.strip()


def inject_tz_tip(body, city_name, tz_name, utc_offset):
    """Inject TZ tip callout before the 'Things To Do' section."""
    tip = f"""
<div class="tz-tip">
  <span class="tz-tip-label">&#9200; Time Zone Tip</span>
  <p>{city_name} runs on {tz_name} ({utc_offset}). Planning remote work or scheduling meetings from {city_name}? <a href="/" style="color:#f0a830;">The Time Sphere</a> tracks live local time for {city_name} and every city your team is in. <a href="/upgrade" style="color:#f0a830;">Time Sphere Pro</a> adds a Meeting Planner so you never need to do time zone math manually.</p>
</div>
"""
    match = re.search(r'<h2[^>]*>\s*Things To Do', body, re.IGNORECASE)
    if match:
        pos = match.start()
        return body[:pos] + tip + body[pos:]
    # Fallback: inject after the 3rd closing </p>
    closes = [m.end() for m in re.finditer(r'</p>', body)]
    if len(closes) >= 3:
        pos = closes[2]
        return body[:pos] + tip + body[pos:]
    return body + tip


def inject_images(body, images):
    """Replace image markers with real img tags."""
    replacements = {
        '<!-- IMG_NEIGHBORHOODS -->': f'<img class="article-inline-img" src="{images["neighborhood"]}" alt="neighborhood" loading="lazy" />',
        '<!-- IMG_EVENTS -->':        f'<img class="article-inline-img" src="{images["events"]}" alt="events" loading="lazy" />',
        '<!-- IMG_FOOD -->':          f'<img class="article-inline-img" src="{images["food"]}" alt="food scene" loading="lazy" />',
        '<!-- IMG_OUTDOORS -->':      f'<img class="article-inline-img" src="{images["outdoors"]}" alt="outdoors" loading="lazy" />',
    }
    for marker, tag in replacements.items():
        body = body.replace(marker, tag)
    return body


# ─── HTML Assembly ─────────────────────────────────────────────────────────────

def build_html(city, month_name, month_slug, year, title, description, body, images):
    city_id   = city['id']
    city_name = city['name']
    state     = city.get('state', '')
    country   = city.get('country', 'USA')
    tz_name   = city.get('tz', 'UTC')
    tz_display = get_tz_display(tz_name)
    utc_offset = get_utc_offset_str(tz_name)
    location   = f"{city_name}, {state}" if state else f"{city_name}, {country}"

    # Process body
    body = sanitize_body(body)
    body = inject_images(body, images)
    body = inject_tz_tip(body, city_name, tz_display, utc_offset)

    slug      = f"{city_id}-{month_slug}-{year}"
    canonical = f"https://www.thetimesphere.com/blog/{slug}"
    hero_url  = images['hero']
    hero_url_safe = hero_url.replace("'", "%27")
    read_time = max(5, len(re.findall(r'\w+', body)) // 200)

    ta_rest, ta_attr = ta_urls(city_id, city_name)
    rel1, rel2 = related_articles(city_id, city_name)

    title_enc = urllib.parse.quote(title)
    desc_enc  = urllib.parse.quote(description)
    hero_enc  = urllib.parse.quote(hero_url)
    canon_enc = urllib.parse.quote(canonical)

    share_tweet = f"https://twitter.com/intent/tweet?url={canon_enc}&text={title_enc}"
    share_pin   = f"https://pinterest.com/pin/create/button/?url={canon_enc}&media={hero_enc}&description={desc_enc}"

    hero_date = f"{month_name} 1, {year}"
    hero_tag  = f"City Guide &middot; {city_name}"

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':
  new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  }})(window,document,'script','dataLayer','GTM-MV8F5SJK');</script>
  <!-- End Google Tag Manager -->
  <!-- Microsoft Clarity -->
  <script type="text/javascript">
      (function(c,l,a,r,i,t,y){{
          c[a]=c[a]||function(){{(c[a].q=c[a].q||[]).push(arguments)}};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      }})(window, document, "clarity", "script", "xo8c0uxerk");
  </script>
  <!-- End Microsoft Clarity -->
  <!-- TravelPayouts Drive -->
  <script nowprocket data-noptimize="1" data-cfasync="false" data-no-defer="1">
    (function () {{
        var script = document.createElement("script");
        script.async = 1;
        script.src = 'https://emrldtp.cc/NTUyNDAw.js?t=552400';
        document.head.appendChild(script);
    }})();
  </script>
  <!-- End TravelPayouts Drive -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} &mdash; The Time Sphere</title>
  <meta name="description" content="{description}" />
  <link rel="canonical" href="{canonical}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="The Time Sphere" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:url" content="{canonical}" />
  <meta property="og:image" content="{hero_url}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{description}" />
  <meta name="twitter:image" content="{hero_url}" />
  <meta name="pinterest:description" content="{description}" />
  <meta name="pinterest:image" content="{hero_url}" />
  <link rel="stylesheet" href="/style.css" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1746427124448734"
       crossorigin="anonymous"></script>
  <style>
    .article-hero{{position:relative;width:100%;height:420px;overflow:hidden}}
    .article-hero img{{width:100%;height:100%;object-fit:cover;display:block}}
    .article-hero-overlay{{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(5,8,16,.2) 0%,rgba(5,8,16,.65) 60%,rgba(5,8,16,.92) 100%);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:36px 20px;text-align:center}}
    .article-hero-tag{{font-size:.62rem;letter-spacing:.15em;text-transform:uppercase;color:#f0a830;margin-bottom:10px}}
    .article-hero h1{{font-family:'Playfair Display',Georgia,serif;font-size:clamp(1.4rem,3.5vw,2.2rem);color:#fff;line-height:1.25;max-width:720px;text-shadow:0 2px 12px rgba(0,0,0,.6);margin-bottom:8px}}
    .article-hero-date{{font-size:.7rem;color:rgba(255,255,255,.5)}}
    .article-inline-img{{display:block;width:100%;max-width:700px;height:280px;object-fit:cover;border-radius:8px;margin:28px auto}}
    .tz-tip{{border-left:4px solid #f0a830;background:rgba(240,168,48,.07);border-radius:0 8px 8px 0;padding:18px 22px;margin:32px 0}}
    .tz-tip-label{{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:#f0a830;font-weight:700;margin-bottom:8px;display:block}}
    .tz-tip p{{margin:0;font-size:.88rem;line-height:1.7}}
    .related-articles{{margin:40px 0 24px;padding-top:28px;border-top:1px solid rgba(255,255,255,.08)}}
    .related-articles h3{{font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:#f0a830;margin-bottom:16px}}
    .related-link{{display:flex;align-items:flex-start;gap:10px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);text-decoration:none;color:inherit}}
    .related-link:last-child{{border-bottom:none}}
    .related-link:hover .related-link-title{{color:#f0a830}}
    .related-link-arrow{{color:#f0a830;font-size:1.1rem;line-height:1.4;flex-shrink:0}}
    .related-link-body{{display:flex;flex-direction:column;gap:2px}}
    .related-link-tag{{font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.4)}}
    .related-link-title{{font-size:.9rem;font-weight:600;transition:color .2s}}
    .share-row{{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:20px 0 8px;border-top:1px solid rgba(255,255,255,.08);margin-top:24px}}
    .share-label{{font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.4)}}
    .share-btn{{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:7px 14px;font-size:.78rem;color:inherit;text-decoration:none;cursor:pointer;font-family:inherit;transition:background .15s}}
    .share-btn:hover{{background:rgba(255,255,255,.12)}}
    .share-btn svg{{width:15px;height:15px;fill:currentColor;vertical-align:middle}}
    @media(max-width:600px){{.article-hero{{height:280px}}.article-inline-img{{height:200px}}}}
  </style>
</head>
<body class="aurora-bg">
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MV8F5SJK"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <header>
    <div class="container">
      <nav id="main-nav">
        <a href="/" class="logo">The <span>Time</span> Sphere</a>
        <button class="nav-hamburger" id="nav-hamburger" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <ul id="nav-menu">
          <li><a href="/">World Clock</a></li>
          <li><a href="/moving-to/">Moving To</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/upgrade" class="nav-upgrade">Upgrade</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <div class="container">
    <div class="ad-slot ad-top">Advertisement</div>
  </div>

  <!-- ARTICLE HERO -->
  <div class="article-hero">
    <img src="{hero_url_safe}"
         alt="{city_name} city guide {month_name} {year}"
         loading="eager" />
    <div class="article-hero-overlay">
      <span class="article-hero-tag">{hero_tag}</span>
      <h1>{title}</h1>
      <div class="article-hero-date">{hero_date} &nbsp;&middot;&nbsp; {read_time} min read</div>
    </div>
  </div>

  <div class="container">
    <div class="content-block">

      <p><a href="/blog" style="color:var(--cyan,#0099cc);font-size:.85rem;">&larr; Back to Blog</a></p>

{body}

      <div class="related-articles">
        <h3>Related Articles</h3>
        <a href="{rel1['url']}" class="related-link">
          <span class="related-link-arrow">&rarr;</span>
          <div class="related-link-body">
            <span class="related-link-tag">{rel1['tag']}</span>
            <span class="related-link-title">{rel1['title']}</span>
          </div>
        </a>
        <a href="{rel2['url']}" class="related-link">
          <span class="related-link-arrow">&rarr;</span>
          <div class="related-link-body">
            <span class="related-link-tag">{rel2['tag']}</span>
            <span class="related-link-title">{rel2['title']}</span>
          </div>
        </a>
      </div>

      <p><a href="/blog" style="color:var(--cyan,#0099cc);font-size:.85rem;">&larr; Back to Blog</a></p>

      <div class="share-row">
        <span class="share-label">Share:</span>
        <a class="share-btn" href="{share_tweet}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Share on X
        </a>
        <a class="share-btn" href="{share_pin}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
          Pin It
        </a>
        <button class="share-btn" onclick="navigator.clipboard.writeText(window.location.href);this.textContent='Copied!'">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          Copy Link
        </button>
      </div>

    </div>
  </div>

  <div class="container">
    <div class="ad-slot ad-bottom">Advertisement</div>
  </div>

  <footer>
    <div class="container">
      <div class="footer-links">
        <a href="/">World Clock</a>
        <a href="/moving-to/">Moving To</a>
        <a href="/blog">Blog</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
      <p>&copy; {year} The Time Sphere &middot; thetimesphere.com &middot; All rights reserved.</p>
      <p style="margin-top:6px;font-size:.72rem;opacity:.5;">The Time Sphere &middot; A Division of Online Marketing Dynamics LLC &middot; 732 S 6th St #6971, Las Vegas, NV 89101</p>
    </div>
  </footer>

  <script src="/app.js"></script>
</body>
</html>"""
    return html


# ─── Output file writers ───────────────────────────────────────────────────────

def update_cards_json(city, month_slug, year, title, description, images):
    data = {}
    if CARDS_JSON.exists():
        try:
            data = json.loads(CARDS_JSON.read_text(encoding='utf-8'))
        except Exception:
            data = {}

    if 'cities' not in data:
        data['generated'] = datetime.now().isoformat(timespec='seconds')
        data['month'] = month_slug
        data['year'] = year
        data['cities'] = {}

    city_id = city['id']
    data['cities'][city_id] = {
        'url':         f"/blog/{city_id}-{month_slug}-{year}.html",
        'title':       title,
        'description': description,
        'photo':       images['hero'],
        'excerpt':     description[:120],
    }
    CARDS_JSON.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')


def update_sitemap_txt(city_id, month_slug, year):
    entry = f"('/blog/{city_id}-{month_slug}-{year}', '0.7', 'weekly'),\n"
    with open(SITEMAP_TXT, 'a', encoding='utf-8') as f:
        f.write(entry)


def log_failure(city_id, reason):
    with open(FAILED_LOG, 'a', encoding='utf-8') as f:
        f.write(f"{datetime.now().isoformat()} | {city_id} | {reason}\n")


# ─── Main pipeline per city ────────────────────────────────────────────────────

def process_city(city, month_name, month_slug, year, api_key, stats):
    city_id   = city['id']
    city_name = city['name']
    slug      = f"{city_id}-{month_slug}-{year}"
    out_path  = BLOG_DIR / f"{slug}.html"

    if out_path.exists():
        print(f"  [SKIP] {city_name} — {out_path.name} already exists")
        stats['skipped'] += 1
        return

    print(f"\n  [{city_name}] Starting...")

    try:
        # Step 1: Research
        research_ctx = research_city(city, month_name, year, api_key)

        # Step 2: Generate
        title, description, raw_body = generate_article(city, month_name, year, research_ctx, api_key)

        # Step 3: Compliance check
        violations = compliance_check(raw_body)
        if violations:
            print(f"  [!] Compliance violation(s) detected: {violations}. Regenerating...")
            title, description, raw_body = generate_article(city, month_name, year, research_ctx, api_key)
            violations2 = compliance_check(raw_body)
            if violations2:
                print(f"  [!] Still has violations after retry — using anyway: {violations2}")

        # Step 4: Build images
        images = build_images(city_id, city_name)

        # Step 5: Build HTML
        html_content = build_html(city, month_name, month_slug, year, title, description, raw_body, images)

        # Step 6: Write file
        BLOG_DIR.mkdir(parents=True, exist_ok=True)
        out_path.write_text(html_content, encoding='utf-8')
        print(f"  [OK] Written: blog/{slug}.html ({len(html_content):,} chars)")

        # Step 7: Update output files
        update_cards_json(city, month_slug, year, title, description, images)
        update_sitemap_txt(city_id, month_slug, year)

        stats['success'] += 1

    except Exception as e:
        print(f"  [FAIL] {city_name}: {e}")
        log_failure(city_id, str(e))
        stats['failed'] += 1


# ─── Batch runner ──────────────────────────────────────────────────────────────

def run_batch(cities, month_name, month_slug, year, api_key):
    stats = {'success': 0, 'skipped': 0, 'failed': 0}
    total = len(cities)
    print(f"\n{'='*60}")
    print(f"Time Sphere City Guide Generator")
    print(f"Month: {month_name} {year} | Cities: {total}")
    print(f"{'='*60}")

    for i, city in enumerate(cities, 1):
        print(f"\n[{i}/{total}] {city['name']}")
        process_city(city, month_name, month_slug, year, api_key, stats)
        if i < total:
            time.sleep(REQUEST_DELAY)

    print(f"\n{'='*60}")
    print(f"Complete: {stats['success']} generated, {stats['skipped']} skipped, {stats['failed']} failed")
    if stats['failed']:
        print(f"Failed cities logged to: {FAILED_LOG}")
    if stats['success']:
        print(f"Blog cards data: {CARDS_JSON}")
        print(f"Sitemap entries: {SITEMAP_TXT}")
    print(f"{'='*60}\n")
    return stats


# ─── Entry point ───────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='Time Sphere Monthly City Guide Generator')
    parser.add_argument('--batch', type=int, metavar='N', help='Run first N cities of 10-city test batch')
    parser.add_argument('--city', type=str, help='Generate for a single city by ID (e.g. houston)')
    parser.add_argument('--all', action='store_true', help='Generate for all 215+ Time Sphere cities')
    parser.add_argument('--month', type=str, default=None, help='Month slug (e.g. july). Defaults to current month.')
    parser.add_argument('--year', type=int, default=None, help='Year (e.g. 2026). Defaults to current year.')
    args = parser.parse_args()

    # Load API key
    env = load_env()
    api_key = env.get('OPEN_ROUTER_KEY', os.environ.get('OPEN_ROUTER_KEY', ''))
    if not api_key:
        print("ERROR: OPEN_ROUTER_KEY not found in C:\\OMD\\Akio\\.env or environment")
        sys.exit(1)

    # Determine month/year
    now = datetime.now()
    month_idx  = MONTH_SLUGS.index(args.month.lower()) if args.month else now.month - 1
    year       = args.year or now.year
    month_name = MONTH_NAMES[month_idx]
    month_slug = MONTH_SLUGS[month_idx]

    # Determine city list
    if args.city:
        city_list = [c for c in BATCH_10 if c['id'] == args.city]
        if not city_list:
            # Try to build from app.js
            all_cities = parse_cities_from_appjs()
            city_list = [c for c in all_cities if c['id'] == args.city]
        if not city_list:
            print(f"ERROR: City '{args.city}' not found.")
            sys.exit(1)
    elif args.all:
        city_list = parse_cities_from_appjs()
        print(f"Loaded {len(city_list)} cities from app.js")
    elif args.batch:
        city_list = BATCH_10[:args.batch]
    else:
        # Default: full 10-city test batch
        city_list = BATCH_10

    run_batch(city_list, month_name, month_slug, year, api_key)


if __name__ == '__main__':
    main()
