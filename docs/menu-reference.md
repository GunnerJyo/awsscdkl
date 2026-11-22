# Navigation interaction reference

On 22 November 2026, between 16:07 and 16:11 IST, we reopened the two supplied URLs in Chrome. At 390 × 844 we tapped each menu twice and sampled the resulting animation on browser frames. At 1440 × 900 we compared the header at rest, after scrolling down and after scrolling back up. Measurements use elapsed time from the actual click event, rounded to the nearest millisecond. [Live capture sheet](references/menu-reference-v3.jpg)

## IEDC Summit 2025

The phone header appears as a white 65 px bar above the hero. The first frame after tapping showed a close icon at 3 ms. Under the top row, the white menu gradually exposes the already-positioned links. The link text stayed in position and each sampled link retained full local opacity. The enclosing panel supplied both the clipping and fade. Its computed transition was 300 ms with cubic-bezier(.4,0,.2,1). [IEDC Summit 2025](https://iedcsummit25.vercel.app/)

| Phone interaction | First frame | About 100 ms | About 180 ms | Settled |
| --- | --- | --- | --- | --- |
| Open | 0 px / 0 opacity | 166 px / .43 | 330 px / .86 | 384 px / 1 at 330 ms |
| Close | 384 px / 1 opacity | 242 px / .63 | 63 px / .16 | 0 px / 0 at 331 ms |

The hamburger returned on the first closing frame. The top row retained its original position during both transitions and in both scroll directions. Desktop used an always-visible navigation row. Its inner surface changed from 72 px tall at y=4 to 56 px at y=20, white with rounded corners, over a declared 500 ms. Scrolling partway back up retained the compact presentation.

## Huddle Global Creative

After the opening progress screen, the hero grouped the title, registration and statistics around the illustrated event scene. Scrolling carried the view from the hero into the event story and programme chapters. The fixed header gained a pale background. The full-programme link grew to 1.05 on desktop hover. At the end, organiser contact, partner actions and the coastal illustration preceded a compact legal line. The settled footer sample returned zero active viewport animations. [Huddle Global Creative](https://huddleglobal.co.in/creative)

On the phone the header remained 89 px high. The menu appeared under it with the close symbol at the same location as the menu control. The 619 px panel kept its dimensions while its opacity passed .43 at 102 ms, .86 at 179 ms and 1 at 331 ms. Closing passed .57 at 105 ms and 0 at 328 ms. The text held its position within the panel through both transitions.

## Decisions for Builder White

Keep the toggle anchored and respond to the initiating click immediately. Use a visible, finite opening and closing transition for the navigation surface. Give the approved geometry its own restrained movement and let a brief item stagger establish reading order. Support quick reversal, keyboard controls, focus restoration and an immediate reduced-motion state. Keep the event hero and footer readable throughout. The artwork, colors, typography and public-page assets come from Builder White.
