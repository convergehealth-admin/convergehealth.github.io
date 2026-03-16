---
name: linkedin-job-automation
description: |
  Automate LinkedIn CTO/CIO job applications end-to-end. Scans Gmail for LinkedIn Job Alerts from the last 7 days, evaluates jobs against your criteria (title match, Easy Apply availability, minimum salary $280K), automatically applies via Easy Apply to qualifying jobs, queues non-Easy-Apply jobs for manual review, and sends an iMessage summary of results.

  Use this skill when you want to: run your daily LinkedIn job search automation, apply to matching CTO/CIO roles automatically, get a summary of new opportunities, or perform a manual scan of recent job alerts. Trigger this whenever you want to find and apply to new job opportunities without manually browsing LinkedIn. This skill handles the entire workflow from Gmail scanning to application submission to final iMessage notification.
---

# LinkedIn CTO/CIO Job Application Automation

Execute the complete LinkedIn job application workflow:
1. Scan Gmail for LinkedIn Job Alerts (last 7 days)
2. Extract job links from emails
3. Evaluate each job against criteria
4. Auto-apply via Easy Apply (if available + salary qualifies OR salary not listed)
5. Queue manual applications (salary qualifies but no Easy Apply)
6. Send iMessage summary with results

## Prerequisites

- Chrome browser with rod.jardine@convergehealth.net Gmail account ready
- iMessage MCP connector configured
- CTO and CIO resume files available for upload

## Execution Steps

### 1. Initialize Chrome Tab

Open a new Chrome tab (or use existing) that has the LinkedIn/Gmail user (rod.jardine@convergehealth.net) already signed in. Get the tab ID for use in subsequent steps.

### 2. Find LinkedIn Job Alert Emails (Unread Only)

Navigate to Gmail search for rod.jardine@convergehealth.net (mail/u/2) - **unread emails only**:

```
https://mail.google.com/mail/u/2/#search/from%3A%22LinkedIn+Job+Alerts%22+newer_than%3A7d+is%3Aunread
```

Execute JavaScript to find unread job alert email rows and extract:
- Email subject
- Verify unread status (filter out any accidentally included read emails)
- Link to click/open

Note: Only unread emails from past 7 days are processed. Once an email is read, it will be skipped on the next run.

Extract approximately 5-20 emails (typical volume for 1 week, unread).

### 3. Process Each Email

For each email:

1. Click to open it
2. Extract all job IDs from LinkedIn tracking URLs using regex:
   - Pattern: `/jobs/view/(\d+)`
   - Also try: `currentJobId=(\d+)` or `jobId=(\d+)`
3. Store unique job IDs (dedup)
4. **Mark email as read** — Click the "Mark as read" button so Gmail shows email as read (provides visual feedback that it's been processed)
5. Navigate back to search results

### 4. Evaluate Each Job

For each unique job ID:

1. Navigate to `https://www.linkedin.com/jobs/view/{jobId}/`
2. Wait 2-3 seconds for page load
3. **Expand full job description** by clicking "... more" link if present (to see complete salary, benefits, and requirements)
4. Extract via JavaScript execution:

```javascript
const extraction = {
  title: document.querySelector('h1')?.textContent?.trim() || document.title.split('|')[0],
  company: document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.textContent?.trim(),
  location: document.querySelector('.job-details-jobs-unified-top-card__bullet')?.textContent?.trim(),
  workType: (document.body.innerText.match(/\b(Remote|Hybrid|On-site)\b/i) || [])[1],

  // Easy Apply detection — check actual buttons, not full page text
  hasEasyApply: !!Array.from(document.querySelectorAll('button')).find(b =>
    b.textContent.trim().includes('Easy Apply') && !b.disabled
  ),

  // Already applied / closed status
  alreadyApplied: document.body.innerText.toLowerCase().includes('application submitted'),
  closed: document.body.innerText.toLowerCase().includes('no longer accepting'),

  // Salary — extract min AND max from ranges
  salaryText: (document.body.innerText.match(/\$[\d,]+K?(?:\s*[-–\/]\s*\$[\d,]+K?)?/i) || ['not listed'])[0],
  minSalary: /* parsed value */,
  maxSalary: /* parsed value */,

  // Disqualifiers
  hasDisqualifyingTerms: /equity\s+only|temporary|1099/i.test(document.body.innerText),
  isFractional: /fractional|interim/i.test(title + ' ' + document.body.innerText.substring(0, 500)),
}
```

### 5. Apply Decision Logic

**SKIP** if:
- Already applied
- No longer accepting
- Contains disqualifying terms (equity-only, temporary, 1099)
- Equity-only with no salary
- Company is in excluded list (Lensa, Dice, Jobs via Dice — recruiting funnels)
- Title doesn't match target positions

**AUTO-APPLY** if:
- Has Easy Apply button
- AND (salary not listed OR salary max ≥ $280K OR fractional role)

**MANUAL TODO** if:
- No Easy Apply
- AND (salary ≥ $280K OR salary not listed)

**SKIP** if:
- No Easy Apply
- AND salary confirmed < $280K (non-fractional)

### 6. Submit Easy Apply

For jobs marked AUTO-APPLY:

1. Navigate back to job if needed
2. Click Easy Apply button
3. Step through multi-page form (max 6 pages):
   - Select resume (Rod Jardine CTO.pdf or Rod Jardine Enterprise CIO.pdf based on job title)
   - Fill any required fields
   - Click Next/Review buttons
4. Click Submit Application
5. Confirm success and record in results

### 7. Build iMessage Summary

Compile results into formatted message with **date AND time**:

```
📋 LinkedIn Job Alert Summary
📅 Mar 16, 2026 | ⏰ 2:30 PM

📧 Emails scanned: {count}
🔍 Jobs reviewed: {count}
✅ Auto-applied: {count}
📝 Manual todo: {count}
⏭ Skipped: {count}

━━━ ✅ AUTO-APPLIED ({count}) ━━━
[For each]:
{#}. {title}
   🏢 {company}
   💰 {salary} | ⚡ Easy Apply
   🔗 https://www.linkedin.com/jobs/view/{jobId}/

━━━ 📝 MANUAL TODO ({count}) ━━━
[For each]:
{#}. {title}
   🏢 {company}
   💰 {salary} | 🔗 Company site
   📌 {reason}
   🔗 https://www.linkedin.com/jobs/view/{jobId}/

━━━ ⏭ SKIPPED ({count}) ━━━
[Brief list]:
• {title} @ {company} — {reason}
```

### 8. Send iMessage

Use iMessage MCP connector to send the formatted summary to **612-802-8255**.

## Target Positions

Include partial matches (case-insensitive):
- CTO, CIO, Chief Technology Officer, Chief Information Officer
- VP of Technology, VP Technology, VP of Engineering, VP Engineering
- Vice President Technology, Vice President Engineering
- SVP Technology, SVP Business
- Chief Product Officer, Chief Digital Officer
- Fractional CTO, Fractional CIO, Interim CTO, Interim CIO
- Head of IT, Head of Global IT
- VP Information Technology, VP Software Engineering

## Criteria Summary

- **Minimum Salary**: $280,000
- **Easy Apply**: Required for auto-apply (unless salary not listed, then optional)
- **Fractional Roles**: Acceptable (auto-apply if Easy Apply, TODO otherwise)
- **Location**: No filter
- **Excluded Companies**: Lensa, Dice, Jobs via Dice (recruiting funnels — jobs are typically duds)
- **Disqualified**: Equity-only, temporary, 1099, already applied, >7 days old
- **Salary Listed**: Use max of any range for qualification

## Resume Mapping

- If title contains "CIO" → Use "Rod Jardine Enterprise CIO.pdf"
- Otherwise → Use "Rod Jardine CTO.pdf"

## Common Issues & Recovery

- **Application form stuck**: Continue to next job, queue this one for manual application
- **Easy Apply not detected**: Use flexible text matching; if button exists, try clicking it
- **Email extraction fails**: Log job IDs manually and continue
- **iMessage send fails**: Log full results to console; user can review manually
