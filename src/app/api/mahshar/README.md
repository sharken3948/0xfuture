# /api/mahshar

Entry point for 0xfuture readings served through the [Mahshar](https://mahshar.xyz) x402 API marketplace. Mahshar collects payment from the buyer in USDC on Arc Mainnet and proxies the buyer's request to this endpoint; this folder trusts Mahshar to have paid and does not re-verify onchain. The onsite reading routes under `/api/{tarot,astrology,numerology}` are untouched and still require their own `txHash`.

## Endpoint

`POST https://0xfuture.xyz/api/mahshar/reading`

### Request

```json
{
  "address": "0x1234...dead",
  "language": "EN"
}
```

- `address` (required): strict `^0x[0-9a-fA-F]{40}$`.
- `language` (optional): one of the supported `LangCode` values. Falls back to `EN`.

### Response (200)

```json
{
  "address": "0x...",
  "language": "EN",
  "tarot":    { "cards": [...3], "interpretation": "..." },
  "astrology": {
    "firstTxDate": "ISO date",
    "zodiacSign": "Leo",
    "symbol": "♌",
    "interpretation": "...",
    "dateSource": "derived"
  },
  "numerology": { "digits": [...], "lifePathNumber": 7, "interpretation": "..." }
}
```

Any of `tarot`, `astrology`, `numerology` may instead be `{ "error": "failed" }` if that single reading failed. A 200 is returned as long as at least one reading succeeded. If all three fail the response is `502 { "error": "All readings failed" }`.

### Status codes

| Status | Reason |
|---|---|
| 200 | ≥1 reading succeeded (partial failures marked inline) |
| 400 | Invalid JSON or address |
| 401 | Missing or wrong `Authorization: Bearer` |
| 429 | Global rate limit (60 req/min on `/api/mahshar/*`), with `Retry-After` |
| 502 | All three readings failed |
| 503 | `MAHSHAR_API_KEY` unset on the server |

## Mahshar listing config

Register the endpoint on Mahshar with:

- `endpoint_url`: `https://0xfuture.xyz/api/mahshar/reading`
- `method`: `POST`
- `auth_type`: `bearer`
- `auth_key`: the value of the `MAHSHAR_API_KEY` env var set on 0xfuture
- `price_per_call`: **$0.60 USDC** (covers three parallel Groq calls plus Mahshar's cut)

Mahshar will decrypt `auth_key` server-side and send it as `Authorization: Bearer <value>` on each proxied call. Rotate by regenerating the secret, updating `MAHSHAR_API_KEY` on 0xfuture, and re-saving the listing on Mahshar.

## Determinism

Readings are deterministic by `address`:

- Tarot cards are drawn from an address-seeded RNG.
- Zodiac sign is derived from an address-seeded pseudo-date (no onchain lookup).
- Life Path number is a sum over the address hex digits.

The Groq-generated interpretation text will vary between calls, but the structural outputs will not. Buyers calling with the same address will get the same cards / sign / life path number each time.
