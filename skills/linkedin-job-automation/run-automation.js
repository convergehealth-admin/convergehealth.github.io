#!/usr/bin/env node

/**
 * LINKEDIN JOB AUTOMATION RUNNER
 *
 * This is the execution wrapper that:
 * 1. Gets/creates a Chrome browser tab
 * 2. Injects MCP tool implementations
 * 3. Runs the main automation workflow
 * 4. Handles errors and sends summary
 *
 * Designed to be called by:
 * - Claude Skill System (manual or scheduled)
 * - Node.js CLI directly
 * - Scheduled task orchestration
 */

const path = require('path');

// ============================================================================
// ORCHESTRATION LAYER
// ============================================================================

async function orchestrateLinkedInAutomation() {
  console.log('\n🚀 [ORCHESTRATOR] Starting LinkedIn Job Automation...\n');

  // Import the main automation module
  let automation;
  try {
    const automationPath = path.join(__dirname, '..', 'linkedin_job_automation.js');
    automation = require(automationPath);
  } catch (err) {
    console.error('❌ Failed to load automation module:', err.message);
    process.exit(1);
  }

  // ── STEP 1: Get or create Chrome tab ────────────────────────────────────
  console.log('📱 [ORCHESTRATOR] Setting up Chrome browser...');
  let tabId = null;

  try {
    // In Cowork/Claude skill context, we'd get this from Claude's browser tools
    // For now, placeholder — the skill invoker will provide it
    tabId = process.env.CHROME_TAB_ID || await getOrCreateChromeTab();
    console.log(`✅ Using Chrome tab: ${tabId}\n`);
  } catch (err) {
    console.error('❌ Failed to initialize Chrome:', err.message);
    process.exit(1);
  }

  // ── STEP 2: Configure MCP tools ────────────────────────────────────────
  console.log('🔧 [ORCHESTRATOR] Configuring MCP tool bindings...');

  const mcpTools = {
    navigate: async (tabId, url) => {
      // This will be replaced by Claude's actual tool call
      // In skill context, Claude injects this
      console.log(`  [MCP] Navigate: ${url.substring(0, 60)}...`);
      // Real call: mcp__Claude_in_Chrome__navigate({ tabId, url })
      return null;
    },
    javascript: async (tabId, code) => {
      // This will be replaced by Claude's actual tool call
      console.log(`  [MCP] Execute JS: ${code.substring(0, 50)}...`);
      // Real call: mcp__Claude_in_Chrome__javascript_tool({ action: 'javascript_exec', tabId, text: code })
      return null;
    },
    sendIMessage: async (recipient, message) => {
      // This will be replaced by Claude's actual tool call
      console.log(`  [MCP] Send iMessage to: ${recipient}`);
      // Real call: mcp__Read_and_Send_iMessages__send_imessage({ recipient, message })
      return null;
    },
  };

  // Inject the MCP tools into the automation module
  automation.setMCPTools(mcpTools);
  console.log('✅ MCP tools configured\n');

  // ── STEP 3: Run the automation ─────────────────────────────────────────
  let results;
  try {
    console.log('▶️  [ORCHESTRATOR] Running automation workflow...\n');
    results = await automation.runAutomation(tabId);
  } catch (err) {
    console.error('\n❌ Automation failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }

  // ── STEP 4: Handle results ─────────────────────────────────────────────
  console.log('\n' + '═'.repeat(70));
  console.log('✅ AUTOMATION COMPLETE');
  console.log('═'.repeat(70));
  console.log(`📊 Jobs processed: ${results.jobsReviewed}`);
  console.log(`✅ Auto-applied: ${results.appliedJobs.length}`);
  console.log(`📝 Manual todo: ${results.todoJobs.length}`);
  console.log(`⏭  Skipped: ${results.skippedJobs.length}`);
  console.log('═'.repeat(70) + '\n');

  return results;
}

/**
 * Placeholder: Get or create a Chrome tab
 * In real execution via Claude skill, this is handled by Claude's browser tools
 */
async function getOrCreateChromeTab() {
  // This would be replaced by actual Claude browser tool call
  // Returns a tab ID that Claude can use for navigation and JS execution
  console.log('  [Note] Tab ID would be provided by Claude skill system');
  return 'tab-1'; // Placeholder
}

// ============================================================================
// ENTRY POINT
// ============================================================================

if (require.main === module) {
  orchestrateLinkedInAutomation()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { orchestrateLinkedInAutomation };
