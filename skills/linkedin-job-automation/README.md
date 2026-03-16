# LinkedIn Job Automation Skill

Automated LinkedIn CTO/CIO job application workflow with Easy Apply detection, salary evaluation, and iMessage notifications.

## Files

- **SKILL.md** — Skill definition and execution instructions (what Claude reads to execute)
- **run-automation.js** — Orchestration runner (Node.js wrapper, optional)
- **../linkedin_job_automation.js** — Core automation logic (parent directory)

## How It Works

### Execution Flow

1. **Gmail Scan** → Find LinkedIn Job Alert emails from last 7 days
2. **Extract** → Pull job IDs from email links
3. **Evaluate** → Check title, Easy Apply, salary for each job
4. **Apply** → Auto-submit applications via Easy Apply
5. **Notify** → Send iMessage with summary

### Decision Logic

```
┌─ Job Evaluation ─────────────────────┐
│                                       │
├─ SKIP if:                           │
│  • Already applied                   │
│  • No longer accepting               │
│  • Equity-only / 1099 / Temporary    │
│  • Title doesn't match               │
│  • Salary confirmed < $280K (no EA)  │
│                                       │
├─ AUTO-APPLY if:                      │
│  • Easy Apply available              │
│  • AND (no salary OR ≥ $280K)       │
│  • Include fractional roles          │
│                                       │
├─ MANUAL TODO if:                     │
│  • No Easy Apply                     │
│  • AND salary ≥ $280K OR not listed │
│                                       │
└──────────────────────────────────────┘
```

## Target Positions

CTO, CIO, VP Engineering, VP Technology, SVP, Head of IT, Fractional roles, etc.

## Criteria

| Setting | Value |
|---------|-------|
| Min Salary | $280K |
| Location Filter | None (remote/hybrid/onsite OK) |
| Job Age | ≤ 7 days |
| Easy Apply | Preferred for auto-apply |
| Fractional | Accepted |
| Disqualified | Equity-only, temp, 1099 |

## Usage

### Scheduled (Daily 7:00 AM)

After setup, the skill runs automatically. You'll receive an iMessage with:
- Number of jobs reviewed
- Auto-applied jobs with links
- Manual todo list with reasons
- Summary of skipped jobs

### Manual (On-Demand)

Ask Claude:
- "Run my LinkedIn job automation"
- "Apply to LinkedIn jobs matching my criteria"
- "Scan for CTO/CIO jobs"

Claude will execute the full workflow and send you an iMessage.

## Setup Requirements

1. **Chrome Browser**: Rod's account (rod.jardine@convergehealth.net) already signed into Gmail
2. **iMessage Connector**: MCP connector configured to send messages
3. **Resumes**: Both files available for upload
   - Rod Jardine CTO.pdf
   - Rod Jardine Enterprise CIO.pdf

## Output Example

```
📋 LinkedIn Job Alert Summary
📅 Mar 16, 2026

📧 Emails scanned: 7
🔍 Jobs reviewed: 12
✅ Auto-applied: 4
📝 Manual todo: 3
⏭ Skipped: 5

━━━ ✅ AUTO-APPLIED (4) ━━━

1. VP Technology
   🏢 TechCorp Inc
   💰 $300K-$400K | ⚡ Easy Apply
   🔗 https://www.linkedin.com/jobs/view/3845291847/

2. CTO
   🏢 StartupXYZ
   💰 comp not listed | ⚡ Easy Apply
   🔗 https://www.linkedin.com/jobs/view/3845261234/

[... more applied jobs ...]

━━━ 📝 MANUAL TODO (3) ━━━

1. Head of Engineering
   🏢 Enterprise Corp
   💰 $320K-$380K | 🔗 Company site
   📌 salary qualifies but no Easy Apply – apply on company site
   🔗 https://www.linkedin.com/jobs/view/3845123456/

[... more manual todos ...]

━━━ ⏭ SKIPPED (5) ━━━
• Director of IT @ LargeBank — salary confirmed $250K, below $280K threshold
• CTO @ Startup — equity only, no base salary
[... more skipped ...]
```

## Troubleshooting

### No emails found
- Check job alerts enabled: https://www.linkedin.com/jobs/alerts/
- Verify you have emails from past 7 days

### Easy Apply not detected
- LinkedIn UI varies; script checks multiple selectors (button, role="button", div elements)
- If job has Easy Apply but wasn't auto-applied, apply manually and report

### Application form stuck
- Script times out gracefully and queues for manual application
- Check the manual todo list for stuck jobs

### iMessage not sent
- Verify iMessage connector configured
- Check Mac Messages app is running
- Try sending a test message manually

### Scheduled task didn't run
- Verify cron expression (should be `0 7 * * *` for 7:00 AM local)
- Check scheduler service is running
- Look for cron logs

## Architecture

```
Skill Invocation
     ↓
SKILL.md (Claude reads instructions)
     ↓
Claude executes steps using MCP tools:
  • mcp__Claude_in_Chrome__navigate()
  • mcp__Claude_in_Chrome__javascript_tool()
  • mcp__Read_and_Send_iMessages__send_imessage()
     ↓
Results → iMessage to user
```

## Future Enhancements

- [ ] LinkedIn 2FA bypass
- [ ] Question answering during multi-page forms
- [ ] Resume attachment for non-Easy-Apply jobs
- [ ] Slack notifications in addition to iMessage
- [ ] Job application history/tracking
- [ ] Email follow-ups for manual todos
- [ ] Salary history tracking

## Notes

- Each run respects LinkedIn's timing (deliberate pauses between actions)
- Multi-page applications handled automatically
- All job links are permanent LinkedIn URLs
- Salary parsing handles ranges (e.g., $250K–$350K → max is $350K for qualification)
- Fractional roles treated the same as full-time

## Development

### Running Locally

```bash
# Simulate the skill execution
node run-automation.js

# Or use directly from CLI
CHROME_TAB_ID=tab-1 node run-automation.js
```

### Testing

Create test cases in `evals/evals.json`:
- Scenario with Easy Apply + high salary → AUTO-APPLY
- Scenario with no Easy Apply + salary qualifies → MANUAL TODO
- Scenario with low salary → SKIP
- etc.

### Modifying Criteria

Update values in `linkedin_job_automation.js`:
- `CRITERIA.minSalary` (currently $280K)
- `CRITERIA.positions[]` (job title matches)
- `CRITERIA.disqualifyingTerms[]` (exclusions)
- `NOTIFICATIONS.phoneNumber` (recipient)
