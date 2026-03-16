# Claude Skills

Custom Claude skills for automating workflows and tasks.

## Available Skills

### LinkedIn Job Automation
- **File**: `linkedin-job-automation.skill`
- **Directory**: `linkedin-job-automation/`
- **Purpose**: Automate LinkedIn CTO/CIO job applications
- **Features**:
  - Scans Gmail for LinkedIn Job Alerts (last 7 days, unread only)
  - Evaluates jobs against criteria ($280K salary, Easy Apply, title match)
  - Auto-applies to qualifying jobs
  - Queues manual applications with clickable links
  - Sends iMessage summaries with date + time stamps
  - Runs daily at 7:00 AM CST (scheduled)

## Installation

### Option 1: Copy the .skill file
Simply download `linkedin-job-automation.skill` and install it in your Claude skills directory.

### Option 2: Use directly from source
Reference the `linkedin-job-automation/` directory if implementing custom versions.

## Configuration

Update the following in `linkedin-job-automation/SKILL.md`:
- **Gmail Account**: Currently set to `rod.jardine@convergehealth.net`
- **Phone Number**: iMessage recipient (currently `612-802-8255`)
- **Minimum Salary**: $280,000 (adjustable)
- **Resume Files**: Update path to your resume files
- **Excluded Companies**: Lensa, Dice, Jobs via Dice

## Schedule

The skill is scheduled to run automatically:
- **Time**: 7:00 AM CST daily
- **Timezone**: Central Standard Time (CST)
- **Manual Run**: Can also be triggered on-demand anytime

## Requirements

- Chrome browser with LinkedIn/Gmail account logged in
- iMessage MCP connector configured
- Resume files available for upload
- Network connection

## Version History

- **v4** (Mar 16, 2026): Updated with CST timezone, time-stamped iMessages, proper skill packaging
- Previous versions: v1-v3 (iterative development and testing)

## Support

For issues or improvements, update the SKILL.md file and increment the version.
