# Short-lived `"use cache"` handler hits warn "Unexpected cache miss"

With `cacheComponents: true`, a `"use cache"` function with a short-lived
`cacheLife` (`revalidate: 0`, or `expire` under the five-minute prerender
minimum, such as `cacheLife("seconds")`) that the cache handler already holds
during the prospective prerender is omitted from the shell. The final prerender
then cannot find it in the Resume Data Cache and logs `Unexpected cache miss
after cache warming phase during prerendering` for every route that reads it.

The app has a root layout that renders a zero-arg cached read inside
`<Suspense>`, plus six static pages. `REPRO_LIFE` picks the profile:
`seconds` reproduces and `hours` is the control.

## Run

```bash
npm install
npm run verify
```

`verify.mjs` builds twice from a clean `.next`. It exits 0 only when the
`seconds` build warns and the `hours` control is clean.

Output on `16.5.0-canary.17` and `16.4.2`:

```
cacheLife("seconds"): build exit 0, 6 warning(s): /a, /b, /c, /d, /e, /
cacheLife("hours"): build exit 0, 0 warning(s)
REPRODUCED: the short-lived shared entry warns; the control is clean.
```

Saving the `SESSION_DATA` marker to the mutable Resume Data Cache in that
handler-hit branch, as the joiner and generation branches already do, brings
the `seconds` build to 0 warnings.
