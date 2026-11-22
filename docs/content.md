# Publishing event information

Edit `src/content.ts` and rebuild the site. The initial public release contains the event identity, first-edition distinction, proposed topics and visitor information. Dates, venue, registration provider, names, sponsors, contacts and social links require organizer confirmation.

## Event authority

The organizer's 21 November 2026 website brief confirms both **AWS Student Community Day Keralam 2027** and **Keralam's First AWS Student Community Day**. The supplied assets come from Cultural Fusion V6 in the Builder White Figma file. Use the [brand specification](brand.md) when updating artwork. AWS describes Student Community Days as community-led, one-day conferences run by student community leaders for learners across institutions. The programme page describes participation from age 18. Publish the edition's verified registration requirements when available. [AWS programme description](https://builder.aws.com/content/30YAgni22A4kIDUitLghmIPOlLJ/aws-student-community-days)

## Phase and registration

Set `event.phase` to one of `pre-announcement`, `registration-open`, `registration-closed`, `event-day` or `post-event`. Set `registrationStatus` to `unannounced`, `opening-soon`, `open`, `limited`, `sold-out` or `closed`. A working registration CTA requires three things together: an open registration or event-day phase, an open or limited status, and an approved HTTPS URL in `registrationUrl`. Closed, sold-out and post-event states have no booking link. Use `eligibility` and `registrationNotes` for verified eligibility, pass details and inclusions.

Populate `announcements` with current attendee updates. After the event, `recap` takes approved resource, recording or gallery links with a descriptive label and HTTPS URL. Verify the destination and media permissions before publishing. Update page copy if registration or website data collection practices change.

## Dates, travel and contacts

Set `dateLabel` to the human-readable event date. Supply `startDate` and `endDate` as ISO 8601 timestamps with an explicit UTC offset, and set `siteUrl` to the approved public origin. Confirm venue name and full address before replacing `venue: null`. Directions, transport, accessible facilities, parking, arrival details and a verified map URL are independent optional fields. Use `contactUrl` for an authorized HTTPS contact page. Add public organizer names, roles and approved links under `organizers` and `socialLinks`. Keep private contacts and attendee information outside the repository.

## Programme and partners

- **Tracks.** Each track has a unique stable ID, title and description. The initial topics are editorial directions. Only the published sessions constitute the schedule.
- **Speakers.** Append an approved `Speaker` record with a unique URL-safe slug in `id`, full name, and approved designation, organization, biography or topic. A portrait uses a root-relative public file path; check reproduction permission and provide an optimized image. External profile links accept absolute HTTPS URLs. A published speaker has a permanent `/speakers/<id>` profile.
- **Sessions.** Append a confirmed `Session` with an ID, title, summary, type, start and end timestamps, and speaker IDs matching the directory. Room and track ID are optional. Use ISO 8601 timestamps with time and explicit offset such as `+05:30`. Keep end after start. Cards, filters and ordering use Asia/Kolkata. Day and room controls appear when there are multiple values. Search covers the title, summary, speaker, room, format and track.
- **Partners.** Add only approved names and category labels. Include a verified website and locally supplied logo only when authorized. Declared categories become page sections as partners are added.
- **FAQ.** Edit `faqs` to add or revise attendee questions. Registration, published programme, organizer and venue answers already read from the same data settings.

## Structural references

Huddle Global 2026 separates speakers, agenda, tracks, partners and practical registration information. Its schedule offers day and stage selectors, keyword search across sessions and speakers, and times attached to sessions. These informed this website's agenda, profile links, registration state and topic browsing. Huddle's imagery, edition data and ticket entitlements remain specific to that event. [Huddle standard programme](https://huddleglobal.co.in/standard) · [Huddle event overview](https://huddleglobal.co.in/creative) · [Huddle tracks](https://huddleglobal.co.in/tracks/)

The original build used the organizer’s IEDC Summit 2025 ticket and host records for the structure of attendee and registration information. For V2, the organizer supplied the exact 2025 reference site. The motion audit records direct desktop and mobile browser observations of that edition and of Huddle Creative. [IEDC Summit 2025](https://iedcsummit25.vercel.app/) · [2025 ticket record](https://tickets.startupmission.in/iedc-summit-2025) · [V2 motion audit](motion-audit.md)
