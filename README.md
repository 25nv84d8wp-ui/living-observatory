# The Living Observatory

A 3-D smart-house estate (built with the PlayCanvas engine) that runs in a phone or desktop browser.
This repository is the **one master copy**. Start here instead of from old `OPEN_THIS_…html` files.

## Run it
The page loads its 3-D models as separate files, so it has to be served over http (not double-clicked):

```
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Where things are
| Path | What it is |
|---|---|
| `index.html` | The page: panels and buttons |
| `css/style.css` | All styling (phone rules at the bottom) |
| `js/core/version.js` | **The only place the version label is set** |
| `js/core/chassis-manifest.js` | Estate map: zones, views, portals |
| `js/storage/core-state.js` | Intelligence Core state, saving, rollback (browser localStorage) |
| `js/residents/*.js` | Pilot Resident, autonomous life, intent arbiter |
| `js/app/main.js` | The main app: house, rooms, ATC, kitchen, panels, model loading (still one big file; to be split further) |
| `js/ui/phone-layout.js` | Phone layout helpers |
| `assets/models/*.glb` | The four 3-D model layers (exterior, interior, furniture, decor) |
| `vendor/playcanvas-2.21.4.min.js` | Local copy of the engine, used if the CDN is unreachable |

See `CURRENT_STATE.md` for what's live and what's next.
