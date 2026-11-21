#(https://mohitupawar.com): website notes

The personal site of Mohit Pawar, written as a journal: paper pages resting on a sky that moves from morning to night as you read.

## Files

```
index.html        all content (cover + five pages)
css/style.css     design tokens at the top, then sections in page order
js/main.js        the sky, the clock, the ribbon contents, copy-email
assets/mohit.jpg  profile photo (from LinkedIn), 640×640
assets/photos/    event photos from LinkedIn posts (C3iHub, The Matrix, Quantile)
assets/tools/     screenshots of Sentinel, Cipher and Permute
assets/favicon.svg
```

No framework and no build step. Fonts come from Google Fonts (Literata for text, Gaegu for handwriting).

(https://mohitupawar.com)

## Design

| Token | Hex | Used for |
|---|---|---|
| morning | `#CFE3FF` | sky at the cover |
| noon | `#8DB8F2` | sky mid-journal |
| dusk | `#6C7FD8` | sky near the end |
| night | `#27306B` / `#141A47` | sky at the last page, footer |
| paper | `#FBFCFF` | pages |
| ink | `#1E2547` | body text |
| pen | `#3554B8` | handwritten notes, links, focus ring |

**Signature interaction:** the sky is tied to scroll position (`--t` from 0 to 1). The sun climbs and sinks, clouds drift out, stars and the moon arrive, and the little paper clock goes from 7:00 am to 10:30 pm. Nothing moves unless you scroll. On phones the clock appears only while scrolling, so it never covers text.

**Living details:**
- On load, the cover photo is set down onto the page, then the handwritten note writes itself in. This happens once.
- Clouds drift very slowly (70 to 90 second loops), and at night a second layer of stars twinkles.
- Reach the last page and one shooting star crosses the sky below it, once per visit.
- Polaroid photos "develop" from a pale blue wash into full colour the first time they scroll into view.
- Clicking a polaroid opens it in a lightbox (native `<dialog>`). Arrow keys flip through photos, the image crossfades, and Esc closes it.
- Polaroids and project windows straighten and lift on hover (only on devices with a mouse).

**Performance:** the sky script measures the page only on resize (via `ResizeObserver`), skips frames where the scroll position hasn't changed, and animates only `opacity` and `transform`. The cover photo loads with `fetchpriority="high"`, and every other image is lazy-loaded.

**Accessibility:** skip link, dashed focus ring on everything focusable, `prefers-reduced-motion` turns off smooth scrolling, transitions, the drifting clouds, the twinkle, the shooting star and the load animation, and the layout holds at 375px with no horizontal scroll.

## Editing content

- **New first-semester entry:** copy a `<section class="entry">` block inside `#semester`. The `<aside class="note">` is optional and becomes a margin note.
- **Add a photo to an entry:** drop a ~1000px JPEG in `assets/photos/`, then copy a `<figure class="snap develop">` block into that entry's `.snaps` strip. Two or three photos per strip work best.
- **On my desk:** edit the three `.desk__item` blocks in `#desk`.
- **New page:** add an `<article class="page" id="…">`, then add it to both the cover contents and the `.ribbon` list.

## Content to check

These lines were written by Claude in Mohit's voice, or are assumptions. Confirm or edit them.

- Contact links for **X** (`x.com/mohitupawar`) and **Instagram** (`instagram.com/mohitupawar`) assume the handle @mohitupawar. They're marked with a `CHECK` comment in `index.html`.
- Margin notes: "our team name was a little too on the nose for a cyber student", "now I'm the person people message about the mess food", "built this while learning what a CSP even is", "length × log₂(pool). that one line changed how I make passwords", "good night, and thanks for reading this far".
- About page: "Outside class I'm usually at a student meeting, on a football pitch, or holding a Rubik's cube."
- Order of the first-semester entries (no dates are shown).
- "Video editing, a few games with friends, and running."
- Photo captions ("C3iHub, before everyone sat down", "The Matrix, mid-hunt", "demo time at Product Hunt '26", "LUCIFER on the big screen", "Ojas and me, before the puzzles", "the Jane Street merch").
- The laptop photo shows the HunarHub demo on screen. HunarHub isn't mentioned anywhere in the text.
