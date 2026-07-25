"""
Smoke test for /go resolution ladder.
Run from C:\OMD\TimeSphere\Website\ :
    python smoke_test_go.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

# server.py is now guarded by __main__, so this import does NOT start the server
import server

# Hardcoded city dicts for smoke matrix
# (reykjavik is not in app.js CITIES; all others are pulled from the live index)
_SYNTHETIC = {
    'reykjavik': {'id': 'reykjavik', 'name': 'Reykjavik', 'country': 'Iceland', 'region': 'europe'},
}

def get_city(city_id):
    idx = server._get_city_index()
    return idx.get(city_id) or _SYNTHETIC.get(city_id)

MATRIX = [
    ('flights',                   'new-york'),
    ('flights',                   'tokyo'),
    ('hotels',                    'london'),
    ('hotels',                    'dubai'),
    ('viator',                    'paris'),
    ('booking-com',               'reykjavik'),
    ('agoda',                     'bangkok'),
    ('tripadvisor-things',        'lima'),
    ('ticketmaster',              'sydney'),
    ('eventbrite',                'nairobi'),
    ('zillow',                    'london'),
    ('apartments-com',            'berlin'),
    ('spotahome',                 'madrid'),
    ('nerdwallet',                'toronto'),
    ('tripadvisor-restaurants',   'cairo'),
]

def run():
    col_w = [25, 12, 12, 10, 65]
    header = ('Merchant', 'City', 'Region', 'Tier', 'Resolved URL')
    sep = '  '.join('-' * w for w in col_w)
    fmt = '  '.join('{:<' + str(w) + '}' for w in col_w)

    print('\n/go Resolution Smoke Test')
    print('=' * sum(col_w) + '=' * (2 * (len(col_w) - 1)))
    print(fmt.format(*header))
    print(sep)

    errors = []
    for merchant, city_id in MATRIX:
        city = get_city(city_id)
        if city is None:
            errors.append(f'City not found in index: {city_id}')
            print(fmt.format(merchant, city_id, '???', 'ERROR', 'city not in index'))
            continue

        url, tier = server._resolve_go(merchant, city)
        region = city.get('region', '?')

        # Assertions
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
        print(f'\nFAILED — {len(errors)} assertion(s):')
        for e in errors:
            print(f'  ✗ {e}')
        sys.exit(1)
    else:
        print('\nAll assertions passed. No /go request resolves to "/".')

if __name__ == '__main__':
    run()
