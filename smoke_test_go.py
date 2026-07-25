"""
Smoke test for /go resolution ladder.
Run from the Website directory:
    python smoke_test_go.py

Phase 1 — resolver assertions: confirms every /go request resolves to a real URL
           and never to "/" or an unexpected UNAVAILABLE sentinel.
Phase 2 — HTTP reachability: sends real HTTP requests to verify resolved URLs
           actually respond. Classifies results as:
             REACHABLE   200-399 final status (after redirects)     PASS
             BOT_BLOCKED 403/405/429/999 — host is up, rejects bots WARN (no fail)
             BROKEN      404/410/5xx/DNS/timeout                    FAIL
             SKIPPED     google.com/search fallbacks (always valid)  -
             SKIPPED     _UNAVAILABLE rows                           -

NOTE (Phase 2 limitation): This catches HARD failures — dead host, wrong path,
HTTP 404. It does NOT catch SOFT failures: a 200 response that shows "no results"
for a badly-formed search query still passes. The following passthrough patterns
should receive one human browser spot-check after each deploy:
  Agoda   (?city=), Spotahome (/s/), Booking.com (?ss=), TripAdvisor (/Search?q=)
"""
import sys, os, time
sys.path.insert(0, os.path.dirname(__file__))

# server.py is guarded by __main__, so this import does NOT start the server
import server
import requests
from requests.exceptions import (
    ConnectionError, Timeout, TooManyRedirects, MissingSchema, InvalidURL
)

# ── Shared constants ──────────────────────────────────────────────────────────

# URL substrings that are geo-restricted and will return 404 from a US IP even
# though they serve real content in the target region. Skip HTTP check for these;
# verify manually from the target region after deploy.
_GEO_RESTRICTED = [
    'trip.com/flights',  # Trip.com flights is geo-gated outside Asia; /hotels/ and /carhire/ on the same domain return 200
]

_UA = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
    'AppleWebKit/537.36 (KHTML, like Gecko) '
    'Chrome/126.0.0.0 Safari/537.36'
)
_HEADERS = {
    'User-Agent': _UA,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}
_TIMEOUT = 10  # seconds per request

# Hardcoded city dicts for smoke matrix
# (reykjavik is not in app.js CITIES; all others pulled from the live index)
_SYNTHETIC = {
    'reykjavik': {'id': 'reykjavik', 'name': 'Reykjavik', 'country': 'Iceland', 'region': 'europe'},
}

MATRIX = [
    ('flights',                 'new-york'),
    ('flights',                 'tokyo'),
    ('hotels',                  'london'),
    ('hotels',                  'dubai'),
    ('viator',                  'paris'),
    ('booking-com',             'reykjavik'),
    ('agoda',                   'bangkok'),
    ('tripadvisor-things',      'lima'),
    ('ticketmaster',            'sydney'),
    ('eventbrite',              'nairobi'),
    ('zillow',                  'london'),
    ('apartments-com',          'berlin'),
    ('spotahome',               'madrid'),
    ('nerdwallet',              'toronto'),
    ('tripadvisor-restaurants', 'cairo'),
]


def get_city(city_id):
    idx = server._get_city_index()
    return idx.get(city_id) or _SYNTHETIC.get(city_id)


# ── Phase 1 — Resolver assertions ────────────────────────────────────────────

def phase1():
    col_w = [25, 12, 12, 10, 65]
    header = ('Merchant', 'City', 'Region', 'Tier', 'Resolved URL')
    sep = '  '.join('-' * w for w in col_w)
    fmt = '  '.join('{:<' + str(w) + '}' for w in col_w)

    print('\n── Phase 1: Resolver ──────────────────────────────────────────────────')
    print(fmt.format(*header))
    print(sep)

    errors = []
    results = []
    for merchant, city_id in MATRIX:
        city = get_city(city_id)
        if city is None:
            errors.append(f'City not found in index: {city_id}')
            print(fmt.format(merchant, city_id, '???', 'ERROR', 'city not in index'))
            results.append((merchant, city_id, None, None, None))
            continue

        url, tier = server._resolve_go(merchant, city)
        region = city.get('region', '?')
        results.append((merchant, city_id, city, url, tier))

        if url == '/':
            errors.append(f'{merchant}/{city_id}: resolved to "/" (forbidden fallback)')
        if url == server._UNAVAILABLE and merchant != 'nerdwallet':
            errors.append(f'{merchant}/{city_id}: unexpected UNAVAILABLE')

        display_url = url if url != server._UNAVAILABLE else '(UNAVAILABLE — button suppressed)'
        if len(display_url) > col_w[4]:
            display_url = display_url[:col_w[4] - 3] + '...'
        print(fmt.format(merchant, city_id, region, tier, display_url))

    print(sep)
    if errors:
        print(f'\nPhase 1 FAILED — {len(errors)} assertion(s):')
        for e in errors:
            print(f'  ✗ {e}')
        sys.exit(1)
    else:
        print('Phase 1 passed. No /go request resolves to "/".')

    return results


# ── Phase 2 — HTTP reachability ───────────────────────────────────────────────

def _is_generic_fallback(url):
    """Google search fallbacks are structurally valid — skip HTTP check."""
    return url and 'google.com/search' in url

def _is_geo_restricted(url):
    """True if this URL is known-good in its target region but geo-blocks US IPs."""
    return url and any(p in url for p in _GEO_RESTRICTED)


def _http_check(url):
    """
    Returns (final_status, verdict, detail).
    verdict: REACHABLE | BOT_BLOCKED | BROKEN
    """
    try:
        resp = requests.head(
            url, headers=_HEADERS, allow_redirects=True, timeout=_TIMEOUT
        )
        status = resp.status_code

        # Some servers reject HEAD — retry with GET
        if status in (405, 501):
            resp = requests.get(
                url, headers=_HEADERS, allow_redirects=True,
                timeout=_TIMEOUT, stream=True
            )
            resp.close()
            status = resp.status_code

    except Timeout:
        return (None, 'BROKEN', 'timeout')
    except ConnectionError as exc:
        reason = 'DNS/connection error'
        msg = str(exc)
        if 'Name or service not known' in msg or 'getaddrinfo' in msg:
            reason = 'DNS failure'
        return (None, 'BROKEN', reason)
    except (TooManyRedirects, MissingSchema, InvalidURL) as exc:
        return (None, 'BROKEN', type(exc).__name__)
    except Exception as exc:
        return (None, 'BROKEN', str(exc)[:60])

    if 200 <= status <= 399:
        return (status, 'REACHABLE', '')
    if status in (403, 405, 429, 999):
        return (status, 'BOT_BLOCKED', '')
    if status in (404, 410) or status >= 500:
        return (status, 'BROKEN', f'HTTP {status}')
    # Anything else (e.g. 401, 407) treat as BOT_BLOCKED (host is up)
    return (status, 'BOT_BLOCKED', f'HTTP {status}')


def phase2(phase1_results):
    col_w = [25, 12, 12, 7, 12, 12]
    header = ('Merchant', 'City', 'Tier', 'Status', 'Verdict', 'Detail')
    sep = '  '.join('-' * w for w in col_w)
    fmt = '  '.join('{:<' + str(w) + '}' for w in col_w)

    print('\n── Phase 2: HTTP Reachability ─────────────────────────────────────────')
    print('   NOTE: SOFT failures (200 with empty results) are not caught here.')
    print('   Spot-check: agoda ?city=, spotahome /s/, booking ?ss=, TA /Search?q=')
    print('   GEO: trip.com/flights is geo-restricted outside Asia — verify from target region.')
    print()
    print(fmt.format(*header))
    print(sep)

    broken = []
    for merchant, city_id, city, url, tier in phase1_results:
        if city is None:
            print(fmt.format(merchant, city_id, '?', '-', 'SKIPPED', 'city not found'))
            continue
        if url == server._UNAVAILABLE:
            print(fmt.format(merchant, city_id, tier, '-', 'SKIPPED', 'UNAVAILABLE'))
            continue
        if _is_generic_fallback(url):
            print(fmt.format(merchant, city_id, tier, '-', 'SKIPPED', 'google fallback'))
            continue
        if _is_geo_restricted(url):
            print(fmt.format(merchant, city_id, tier, '-', 'SKIPPED', 'geo-restricted'))
            continue

        status, verdict, detail = _http_check(url)

        status_str = str(status) if status is not None else '-'
        print(fmt.format(merchant, city_id, tier, status_str, verdict, detail))

        if verdict == 'BROKEN':
            broken.append(f'{merchant}/{city_id}: {detail or ("HTTP " + status_str)}')

        # Polite crawl delay
        time.sleep(0.4)

    print(sep)

    if broken:
        print(f'\nPhase 2 FAILED — {len(broken)} BROKEN row(s):')
        for b in broken:
            print(f'  ✗ {b}')
        return False
    else:
        print('\nPhase 2 passed. No BROKEN rows (BOT_BLOCKED rows are expected, not failures).')
        return True


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == '__main__':
    p1_results = phase1()
    ok = phase2(p1_results)
    if not ok:
        sys.exit(1)
