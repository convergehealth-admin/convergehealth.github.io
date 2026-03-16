# Test Prompts for LinkedIn Job Automation Skill

## Test Case 1: Full Workflow Manual Run

**Prompt**: "Run my LinkedIn job automation right now. I want to see all jobs reviewed, how many applied, and which ones are in the manual todo list."

**Expected Output**:
- Gmail search executes successfully
- Email list shows (should find 5-20 emails from past 7 days)
- Each email opens and job IDs extracted
- For each job:
  - Title, company, location displayed
  - Salary extracted or "not listed"
  - Easy Apply detected
  - Decision logged (AUTO-APPLY / MANUAL TODO / SKIP)
- iMessage sent to 612-802-8255 with:
  - Count of emails scanned
  - Count of jobs reviewed
  - Count auto-applied
  - Count in manual todo
  - List of auto-applied jobs with links
  - List of manual todos with links and reasons
- Console output shows full execution trace

**Success Criteria**:
- ✅ At least 1 job processed
- ✅ At least 1 decision made (apply/todo/skip)
- ✅ iMessage received within 30 seconds
- ✅ No JavaScript errors

---

## Test Case 2: Easy Apply Detection Accuracy

**Scenario**: Run automation on a set of jobs where we know which have Easy Apply

**Check**:
- Easy Apply button detected correctly (can look at LinkedIn directly in browser while script runs)
- Multi-selector detection works (buttons, divs, role="button")
- No false positives from sidebar jobs

**Success Criteria**:
- ✅ Easy Apply detection matches manual inspection
- ✅ Jobs #4 and #8 from previous runs have Easy Apply marked correctly

---

## Test Case 3: Salary Parsing

**Expected Behavior**:
- Job with "$250K–$350K" → maxSalary = $350K → Qualifies (≥ $280K)
- Job with "$350K–$450K" → Qualifies
- Job with "$250K only" → Disqualified (< $280K)
- Job with "salary not listed" → Qualifies if Easy Apply, TODO if no Easy Apply

**Check**: Console logs show correct minSalary and maxSalary extraction

**Success Criteria**:
- ✅ Salary ranges parsed correctly
- ✅ Qualification logic uses max of range
- ✅ No jobs wrongly skipped due to salary

---

## Test Case 4: Manual TODO List Accuracy

**Expected Behavior**:
Jobs should be in MANUAL TODO if:
- No Easy Apply button
- AND (salary ≥ $280K OR salary not listed)

**Check**:
- Review manual todo list
- Each job should have a link to the LinkedIn posting
- Reason should be clear (e.g., "no Easy Apply and salary not listed")

**Success Criteria**:
- ✅ Manual todo jobs have actionable links
- ✅ Reasons are clear and accurate
- ✅ User can click link and apply directly

---

## Test Case 5: iMessage Delivery

**Check**:
- iMessage actually arrives (not just logged)
- Formatting is readable
- Links are clickable
- Job counts match actual results

**Success Criteria**:
- ✅ iMessage received on 612-802-8255
- ✅ Message is readable on phone
- ✅ LinkedIn job links work when clicked
- ✅ Delivery is fast (< 10 seconds after run completes)

---

## Test Case 6: Scheduled Execution

**Setup**: Trigger skill to run via scheduler at 7:00 AM tomorrow

**Check**:
- Task executes at correct time
- Results available in morning
- iMessage sent automatically
- Can view results without user intervention

**Success Criteria**:
- ✅ Task runs at 7:00 AM ± 2 minutes
- ✅ iMessage received
- ✅ No manual intervention needed

---

## Regression Tests (Verify Previous Fixes)

### Easy Apply Button (#4 and #8 from Earlier)

From earlier context, TriSearch CIO and Empathy Talent VP Software Engineering both had Easy Apply but were being placed in manual todo.

**Test**: Run automation including these jobs (if still in recent alerts)

**Expected**: Both should show AUTO-APPLY, not MANUAL TODO

**Success Criteria**:
- ✅ Easy Apply detection robust enough for these UI variations
- ✅ Both jobs appear in AUTO-APPLIED section

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Emails scanned | < 5 seconds |
| Per-job evaluation | 2-3 seconds (due to page load) |
| Total run time | < 2 minutes for 10 jobs |
| iMessage send | < 10 seconds after completion |

---

## How to Run Tests

1. **Manual Test**: Ask Claude "Run my LinkedIn job automation"
2. **Check Console**: Look for logs showing each step
3. **Verify Output**: Check iMessage received on your phone
4. **Compare**: Manually check 1-2 jobs on LinkedIn to verify Easy Apply detection
5. **Report**: Document any failures or misdetections

---

## Failure Scenarios to Watch For

- Email extraction returning 0 emails (check job alerts enabled)
- Job page not loading (timeout, LinkedIn block)
- Easy Apply button not found when it exists
- Salary parsing returning 0 for listed salaries
- iMessage not sending (connector issue)
- Form submission fails mid-application
