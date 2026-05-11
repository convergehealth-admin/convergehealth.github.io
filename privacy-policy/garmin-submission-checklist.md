# Garmin Developer Program Submission Checklist

Use this when filling out the Garmin Connect Developer Program Access Request Form. Each row maps a Garmin contractual requirement to the section of the privacy policy that satisfies it, so if a reviewer asks "where do you address X," you can point to a specific section.

## Pre-submission deploy steps

1. Publish `privacy-policy.html` to `https://convergehealth.net/privacy` (or `/privacy-policy`). Use a stable, permanent URL. Garmin's agreement prohibits changing this URL without redirecting.
2. Add a footer link "Privacy Policy" on convergehealth.net pointing to the published URL.
3. Set up the `privacy@convergehealth.net` email alias (or alias it to rod.jardine@convergehealth.net). Reviewers may test it.
4. Confirm the page loads over HTTPS with a valid certificate.
5. Confirm convergehealth.net is publicly accessible (not behind a coming-soon page or password gate). Garmin will not approve if they can't browse the site.

## Garmin Developer Program Agreement → Policy mapping

| Garmin requirement | Source clause | Policy section |
|---|---|---|
| Conspicuous notice that End User Data transfers to Garmin | §3 (Licensee Applications notice obligation) | §7.3 Transfer of Data to Garmin |
| Brief summary of purpose and method of processing | §3 | §7.1, §7.2 |
| Categories of data being transferred | §3 | §7.1 (read), §7.3 (write) |
| Link to Garmin Connect Privacy Policy | §3 | §7.4 (link to garmin.com/privacy/connect) |
| Obtain End User express consent | §3 | §1 acceptance + §7.3 + §7.5 OAuth consent |
| Statement that data submitted to app is submitted to Licensee, not Garmin | Connect IQ agreement §a Privacy | §7.4 Relationship With Garmin |
| Garmin has no responsibility/liability for Licensee data | Connect IQ §a | §7.4 |
| Data retention limited to what's reasonably needed | §b Data Retention | §5 Data Retention and Storage |
| Express opt-in for location data (not default-on) | §c Location Data | §2.4 + §7.6 |
| Privacy policy update mechanism | Connect IQ §a | §11 Changes to This Policy |
| No URL changes without redirect | Connect IQ §a | §11 explicit commitment |
| Security measures | Minimum Security Requirements | §6 Security |
| User rights (access, deletion, withdrawal) | Applicable Data Protection Laws | §7.5 + §8 |

## Form field guidance

When you fill the Access Request Form at https://www.garmin.com/en-US/forms/GarminConnectDeveloperAccess/:

- **Company:** Converge Health, LLC
- **Website:** https://convergehealth.net
- **Privacy Policy URL:** https://convergehealth.net/privacy (after deploy)
- **Use case description:** Lead with the local-first architecture. Reviewers see thousands of applications; the phrase "data stored locally on user device" materially de-risks your application in their eyes. Sample framing: "Converge Health is building a local-first health analytics application. Garmin Connect data is retrieved via the Health, Activity, Training, Courses, and Women's Health APIs and stored on the end user's device. We do not aggregate user data, do not sell data, and do not use data to train third-party AI models."
- **APIs requested:** Be honest about which you'll actually use. Requesting all five when you only need Health and Activity invites scrutiny. If Women's Health is needed later, you can request expansion.

## Things that get applications rejected

These are the patterns Garmin's review team is known to flag. None of them are present in the policy as drafted, but flag them if you customize:

- Generic privacy policy templates with no Garmin-specific section
- Missing link to Garmin's own privacy policy
- Vague data use language ("we may use your data for various purposes")
- Mentioning data resale, advertising profiles, or AI model training on user data
- Default-on location collection
- Indefinite retention statements
- No revocation mechanism described
- Privacy policy hosted on a different domain than the application
- Privacy policy page returns 404, requires login, or is behind a paywall

## Confirmed details now embedded in policy

- **Legal entity:** Converge Health, LLC
- **Mailing address:** 330 S Second Avenue, Suite 200-1028, Minneapolis, MN 55401
- **Primary contact:** info@convergehealth.net
- **California section:** included as Section 9 (CCPA/CPRA Notice at Collection)
- **Cookie banner:** not required, site does not use cookies (Section 2.2 reflects server-side logging only)

## Remaining items to verify before publish

1. Confirm `info@convergehealth.net` is monitored and someone responds within statutory windows (45 days for CCPA requests, with one 45-day extension allowed).
2. If you later add analytics (GA, Plausible, Fathom, etc.) or any third-party scripts, Section 2.2 needs updating and you'll need a cookie banner.
3. If Converge Health adds a separate B2B/employer product where Garmin data is processed under a different model (employer-sponsored wellness, for example), you may need a separate B2B addendum or a clinical-context section.
