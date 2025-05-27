function validateJson() {
    const fileInput = document.getElementById('jsonFile');
    const manualInput = document.getElementById('manualJsonInput');
    
    let jsonContent = null;
    
    if (fileInput && fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                jsonContent = JSON.parse(e.target.result);
                showValidationResults(true, 'JSON structure is valid');
                parseJsonForPreview(jsonContent);
            } catch (error) {
                showValidationResults(false, `Invalid JSON: ${error.message}`);
            }
        };
        reader.readAsText(fileInput.files[0]);
    } else if (manualInput && manualInput.value.trim()) {
        try {
            jsonContent = JSON.parse(manualInput.value);
            showValidationResults(true, 'JSON structure is valid');
            parseJsonForPreview(jsonContent);
        } catch (error) {
            showValidationResults(false, `Invalid JSON: ${error.message}`);
        }
    } else {
        alert('Please upload a JSON file or paste JSON content manually.');
    }
}

function showValidationResults(isValid, message) {
    const resultsDiv = document.getElementById('validationResults');
    const contentDiv = document.getElementById('validationContent');
    
    if (resultsDiv && contentDiv) {
        if (isValid) {
            contentDiv.style.background = '#d4edda';
            contentDiv.style.color = '#155724';
            contentDiv.innerHTML = `✅ ${message}`;
        } else {
            contentDiv.style.background = '#f8d7da';
            contentDiv.style.color = '#721c24';
            contentDiv.innerHTML = `❌ ${message}`;
        }
        
        resultsDiv.classList.remove('hidden');
    }
}

function saveAsDraft() {
    const customerId = document.getElementById('customerId')?.value || '';
    const customerName = document.getElementById('customerName')?.value || '';
    const workOrderId = document.getElementById('workOrderId')?.value || '';
    
    if (!customerId || !customerName) {
        alert('Please fill in Customer ID and Name to save as draft.');
        return;
    }
    
    // In a real app, this would save to backend
    const draftData = {
        workOrderId,
        customerId,
        customerName,
        priority: document.getElementById('priority')?.value || '2',
        networkType: document.getElementById('networkType')?.value || '4G_5G',
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`draft_${workOrderId}`, JSON.stringify(draftData));
    alert(`Work order ${workOrderId} saved as draft successfully!`);
    closeNewWorkOrderModal();
}

function submitWorkOrder(event) {
    event.preventDefault();
    
    const customerId = document.getElementById('customerId')?.value || '';
    const customerName = document.getElementById('customerName')?.value || '';
    const workOrderId = document.getElementById('workOrderId')?.value || '';
    
    if (!customerId || !customerName) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const fileInput = document.getElementById('jsonFile');
    const manualInput = document.getElementById('manualJsonInput');
    
    if ((!fileInput || fileInput.files.length === 0) && (!manualInput || !manualInput.value.trim())) {
        alert('Please upload a JSON file or provide JSON content manually.');
        return;
    }
    
    // Check execution mode
    const executionMode = document.querySelector('input[name="executionMode"]:checked')?.value || 'immediate';
    const scheduleTime = document.getElementById('scheduleTime')?.value || '';
    
    if (executionMode === 'scheduled' && !scheduleTime) {
        alert('Please select a schedule date and time.');
        return;
    }
    
    let message = `✅ Work order ${workOrderId} created successfully!\nCustomer: ${customerName}\nID: ${customerId}`;
    
    if (executionMode === 'scheduled') {
        message += `\nScheduled for: ${new Date(scheduleTime).toLocaleString()}`;
    } else if (executionMode === 'preview') {
        message += '\nMode: Preview Only (No Execution)';
    }
    
    alert(message);
    closeNewWorkOrderModal();
}

// Console Log Functions
function viewConsoleLog(nfId, customerName) {
    const modal = document.getElementById('consoleLogModal');
    const title = document.getElementById('consoleLogTitle');
    
    if (modal && title) {
        modal.classList.add('show');
        title.textContent = `Console Log - ${nfId.toUpperCase()} (${customerName})`;
        
        const logContent = generateConsoleLog(nfId, customerName);
        const consoleDiv = document.getElementById('consoleLogContent');
        if (consoleDiv) {
            consoleDiv.innerHTML = logContent;
            
            const autoScroll = document.getElementById('autoScrollLog');
            if (autoScroll && autoScroll.checked) {
                consoleDiv.scrollTop = consoleDiv.scrollHeight;
            }
        }
    }
}

function generateConsoleLog(nfId, customerName) {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let logs = [];
    
    if (nfId.includes('smf')) {
        if (nfId === 'smf-primary' && customerName === 'BMW') {
            logs = [
                `[${timestamp}] Provisioning ${customerName} Customer...`,
                `[${timestamp}] Validating Geo Redundancy Status`,
                `[${timestamp}] Checking Node Status of SMF - Detected as Active Node`,
                `[${timestamp}] Blocking APN: custonet5g.vzwentp`,
                `[${timestamp}] Blocking Shared IP Pool: CUSTONET5GONE001`,
                `[${timestamp}] Committing configuration changes...`,
                `[${timestamp}] Validating Active Sessions...`,
                `[${timestamp}] Found 20000 UE sessions active`,
                `[${timestamp}] Waiting for sessions to terminate gracefully...`,
                `[${timestamp}] <span style="color: #ff6b6b;">ERROR: Wait timeout exceeded (300s)</span>`,
                `[${timestamp}] <span style="color: #ffd93d;">WARNING: Initiating forced session termination</span>`,
                `[${timestamp}] <span style="color: #ff6b6b;">ERROR: Session termination failed - resource busy</span>`,
                `[${timestamp}] <span style="color: #ff6b6b;">FAILED: Configuration rollback initiated</span>`
            ];
        } else {
            logs = [
                `[${timestamp}] Provisioning ${customerName} Customer...`,
                `[${timestamp}] Validating Geo Redundancy Status`,
                `[${timestamp}] Checking Node Status of SMF - Detected as Active Node`,
                `[${timestamp}] Blocking APN successfully`,
                `[${timestamp}] Blocking Shared IP Pool successfully`,
                `[${timestamp}] Committing configuration changes...`,
                `[${timestamp}] Validating Active Sessions...`,
                `[${timestamp}] Found 15000 UE sessions active`,
                `[${timestamp}] Sessions terminated successfully`,
                `[${timestamp}] Loading Customer Config to SMF...`,
                `[${timestamp}] Executing Dry Run validation...`,
                `[${timestamp}] <span style="color: #6BCF7F;">Dry Run successful</span>`,
                `[${timestamp}] Executing Final Commit...`,
                `[${timestamp}] <span style="color: #6BCF7F;">Commit successful</span>`,
                `[${timestamp}] <span style="color: #6BCF7F;">Provisioning completed successfully</span>`
            ];
        }
    } else if (nfId.includes('upf')) {
        if (nfId === 'upf-primary' && customerName === 'BMW') {
            logs = [
                `[${timestamp}] Provisioning ${customerName} Customer...`,
                `[${timestamp}] Validating Geo Redundancy Status`,
                `[${timestamp}] Checking Node Status of UPF - Detected as Active Node`,
                `[${timestamp}] Creating Network Instance...`,
                `[${timestamp}] Configuring VRF: MPN05421`,
                `[${timestamp}] <span style="color: #ff6b6b;">ERROR: Network Instance creation failed</span>`,
                `[${timestamp}] <span style="color: #ff6b6b;">ERROR: Connection timeout to UPF node (10.0.0.1)</span>`,
                `[${timestamp}] <span style="color: #ffd93d;">WARNING: Retrying connection (attempt 1/3)</span>`,
                `[${timestamp}] <span style="color: #ffd93d;">WARNING: Retrying connection (attempt 2/3)</span>`,
                `[${timestamp}] <span style="color: #ffd93d;">WARNING: Retrying connection (attempt 3/3)</span>`,
                `[${timestamp}] <span style="color: #ff6b6b;">ERROR: Max retry attempts exceeded</span>`,
                `[${timestamp}] <span style="color: #ff6b6b;">FAILED: UPF provisioning aborted</span>`
            ];
        } else {
            logs = [
                `[${timestamp}] Provisioning ${customerName} Customer...`,
                `[${timestamp}] Validating Geo Redundancy Status`,
                `[${timestamp}] Checking Node Status of UPF - Detected as Active Node`,
                `[${timestamp}] Creating Network Instance...`,
                `[${timestamp}] Configuring VRF successfully`,
                `[${timestamp}] Committing configuration changes...`,
                `[${timestamp}] Validating Active Sessions...`,
                `[${timestamp}] Found 12000 UE sessions active`,
                `[${timestamp}] Sessions terminated successfully`,
                `[${timestamp}] Loading Customer Config to UPF...`,
                `[${timestamp}] Executing Dry Run validation...`,
                `[${timestamp}] <span style="color: #6BCF7F;">Dry Run successful</span>`,
                `[${timestamp}] Executing Final Commit...`,
                `[${timestamp}] <span style="color: #6BCF7F;">Commit successful</span>`,
                `[${timestamp}] <span style="color: #6BCF7F;">UPF provisioning completed</span>`
            ];
        }
    } else if (nfId.includes('asr1k')) {
        logs = [
            `[${timestamp}] Provisioning ${customerName} Customer...`,
            `[${timestamp}] Connecting to ASR1K device...`,
            `[${timestamp}] Device connection established`,
            `[${timestamp}] Creating Customer VRF: E0000039815`,
            `[${timestamp}] Configuring Route Distinguisher: ${nfId.includes('primary') ? '162169' : '167169'}`,
            `[${timestamp}] Applying BGP configuration...`,
            `[${timestamp}] <span style="color: #6BCF7F;">VRF configuration successful</span>`,
            `[${timestamp}] <span style="color: #6BCF7F;">ASR1K provisioning completed</span>`
        ];
    }
    
    return logs.map(log => `<div style="margin-bottom: 4px;">${log}</div>`).join('');
}

function closeConsoleLogModal() {
    const modal = document.getElementById('consoleLogModal');
    if (modal) modal.classList.remove('show');
}

function clearConsoleLog() {
    const consoleContent = document.getElementById('consoleLogContent');
    if (consoleContent) consoleContent.innerHTML = '';
}

function downloadConsoleLog() {
    const logContent = document.getElementById('consoleLogContent');
    if (!logContent) return;
    
    const textContent = logContent.textContent;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console_log_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function refreshConsoleLog() {
    const title = document.getElementById('consoleLogTitle');
    if (!title) return;
    
    const titleText = title.textContent;
    const matches = titleText.match(/Console Log - (.+?) \((.+)\)/);
    
    if (matches) {
        const nfId = matches[1].toLowerCase().replace(' ', '-');
        const customerName = matches[2];
        viewConsoleLog(nfId, customerName);
    }
}

function aiTroubleshootFromLog() {
    const logContent = document.getElementById('consoleLogContent');
    if (!logContent) return;
    
    const textContent = logContent.textContent;
    
    if (textContent.includes('ERROR') || textContent.includes('FAILED')) {
        alert(`🤖 AI Troubleshooting Analysis:

ISSUES DETECTED:
• Connection timeout detected - Network connectivity issue
• Session termination failure - High UE session load
• Configuration rollback triggered

RECOMMENDATIONS:
1. Check network connectivity between sites
2. Increase timeout values for session termination
3. Consider implementing gradual session migration
4. Verify firewall rules and port accessibility
5. Check resource utilization on target nodes

NEXT STEPS:
• Retry with extended timeout settings
• Implement circuit breaker pattern
• Monitor network performance metrics

ESTIMATED RESOLUTION TIME: 15-30 minutes`);
    } else {
        alert(`🤖 AI Analysis: 
✅ All operations completed successfully
📊 Performance within normal parameters
💡 No issues detected in current logs
🎯 System operating optimally`);
    }
}

// Work Order Management Functions
function editWorkOrder(workOrderId) {
    const modal = document.getElementById('workOrderFormModal');
    const title = document.getElementById('workOrderFormTitle');
    const body = document.getElementById('workOrderFormBody');
    
    if (!modal || !title || !body) return;
    
    modal.classList.add('show');
    title.textContent = 'Edit Work Order';
    
    const customer = workOrderId === 'wo1' ? 'BMW Enterprise' : 'Unknown Customer';
    
    body.innerHTML = `
        <form id="editWorkOrderForm">
            <div style="margin-bottom: 24px;">
                <h4 style="margin-bottom: 16px; color: #1976d2;">📋 Work Order Information</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 4px; font-weight: 500;">Work Order ID</label>
                        <input type="text" id="editWorkOrderId" value="${workOrderId.toUpperCase()}" readonly 
                               style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 4px; font-weight: 500;">Customer Name</label>
                        <input type="text" id="editCustomerName" value="${customer}"
                               style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 24px;">
                <h4 style="margin-bottom: 16px; color: #1976d2;">📄 Update VHAP JSON Payload</h4>
                <div style="border: 2px dashed #ddd; border-radius: 8px; padding: 24px; text-align: center; background: #fafafa;">
                    <div id="editUploadArea" style="cursor: pointer;" onclick="document.getElementById('editJsonFile').click()">
                        <div style="font-size: 48px; color: #ccc; margin-bottom: 16px;">📁</div>
                        <p style="margin-bottom: 8px; font-weight: 500;">Click to upload updated VHAP JSON payload</p>
                        <p style="font-size: 14px; color: #666;">Or drag and drop your JSON file here</p>
                    </div>
                    <input type="file" id="editJsonFile" accept=".json" style="display: none;">
                </div>
                
                <div style="margin-top: 16px;">
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                        <input type="checkbox" id="editManualJsonToggle"> 
                        Or paste JSON manually
                    </label>
                    <textarea id="editManualJsonInput" class="hidden" placeholder="Paste your updated VHAP JSON payload here..." 
                             style="width: 100%; height: 200px; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px;"></textarea>
                </div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid #eee;">
                <button type="button" class="btn btn-secondary" onclick="closeWorkOrderFormModal()">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="updateWorkOrder()">Update Work Order</button>
            </div>
        </form>
    `;
}

function deleteWorkOrder(workOrderId) {
    if (!confirm(`Are you sure you want to delete work order ${workOrderId.toUpperCase()}? This action cannot be undone.`)) {
        return;
    }
    
    const modal = document.getElementById('workOrderFormModal');
    const title = document.getElementById('workOrderFormTitle');
    const body = document.getElementById('workOrderFormBody');
    
    if (!modal || !title || !body) return;
    
    modal.classList.add('show');
    title.textContent = 'Delete Work Order - Confirmation Required';
    
    body.innerHTML = `
        <div style="text-align: center; padding: 24px;">
            <div style="font-size: 64px; color: #dc3545; margin-bottom: 16px;">⚠️</div>
            <h3 style="color: #dc3545; margin-bottom: 16px;">Delete Work Order</h3>
            <p style="margin-bottom: 24px;">You are about to delete work order <strong>${workOrderId.toUpperCase()}</strong>.</p>
            <p style="margin-bottom: 24px;">Please upload the VHAP JSON payload to confirm deletion:</p>
            
            <div style="border: 2px dashed #dc3545; border-radius: 8px; padding: 24px; text-align: center; background: #fff5f5; margin-bottom: 24px;">
                <div style="cursor: pointer;" onclick="document.getElementById('deleteJsonFile').click()">
                    <div style="font-size: 48px; color: #dc3545; margin-bottom: 16px;">📁</div>
                    <p style="margin-bottom: 8px; font-weight: 500;">Upload VHAP JSON for verification</p>
                    <p style="font-size: 14px; color: #666;">Required for deletion confirmation</p>
                </div>
                <input type="file" id="deleteJsonFile" accept=".json" style="display: none;">
            </div>

            <div style="margin-bottom: 24px;">
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                    <input type="checkbox" id="deleteManualJsonToggle"> 
                    Or paste JSON manually
                </label>
                <textarea id="deleteManualJsonInput" class="hidden" placeholder="Paste VHAP JSON payload here..." 
                         style="width: 100%; height: 150px; padding: 12px; border: 1px solid #dc3545; border-radius: 4px; font-family: monospace; font-size: 12px;"></textarea>
            </div>

            <div style="display: flex; gap: 12px; justify-content: center;">
                <button class="btn btn-secondary" onclick="closeWorkOrderFormModal()">Cancel</button>
                <button class="btn" onclick="confirmDeleteWorkOrder('${workOrderId}')" 
                        style="background: #dc3545; color: white;">🗑️ Confirm Delete</button>
            </div>
        </div>
    `;
}

function closeWorkOrderFormModal() {
    const modal = document.getElementById('workOrderFormModal');
    if (modal) modal.classList.remove('show');
}

function updateWorkOrder() {
    const workOrderId = document.getElementById('editWorkOrderId')?.value || '';
    const customerName = document.getElementById('editCustomerName')?.value || '';
    
    if (!customerName) {
        alert('Please enter a customer name.');
        return;
    }
    
    alert(`✅ Work order ${workOrderId} updated successfully for ${customerName}!`);
    closeWorkOrderFormModal();
}

function confirmDeleteWorkOrder(workOrderId) {
    const fileInput = document.getElementById('deleteJsonFile');
    const manualInput = document.getElementById('deleteManualJsonInput');
    
    if ((!fileInput || fileInput.files.length === 0) && (!manualInput || !manualInput.value.trim())) {
        alert('Please provide VHAP JSON payload to confirm deletion.');
        return;
    }
    
    alert(`✅ Work order ${workOrderId.toUpperCase()} has been deleted successfully.`);
    closeWorkOrderFormModal();
}

// Notification Functions
function notifyVHAP(workOrderId) {
    const workOrder = allWorkOrders.find(wo => wo.id === workOrderId.replace('wo', 'WO-'));
    
    alert(`📡 VHAP Event Notification Sent:

Work Order: ${workOrderId.toUpperCase()}
Customer: ${workOrder ? workOrder.customer : 'Unknown'}
Event Type: PROVISIONING_STATUS_UPDATE
Timestamp: ${new Date().toISOString()}

Message Bus Topic: mpn.provisioning.events
Event Published Successfully ✅

VHAP will receive real-time updates about:
• Network Function status changes
• Configuration completions
• Failure notifications
• Recovery actions

Integration Details:
• Protocol: Apache Kafka
• Partition Key: ${workOrder ? workOrder.customerId : 'N/A'}
• Message Format: JSON with schema validation`);
}

function notifyUsers(workOrderId) {
    const modal = document.getElementById('notificationModal');
    const title = document.getElementById('notificationTitle');
    const message = document.getElementById('notificationMessage');
    const emailRecipients = document.getElementById('emailRecipients');
    const slackChannels = document.getElementById('slackChannels');
    
    if (!modal || !title || !message) return;
    
    modal.classList.add('show');
    title.textContent = `Send Notifications - ${workOrderId.toUpperCase()}`;
    
    const workOrder = allWorkOrders.find(wo => wo.id === workOrderId.replace('wo', 'WO-'));
    const customer = workOrder ? workOrder.customer : 'Unknown Customer';
    
    const messageText = `Work Order Update: ${workOrderId.toUpperCase()}
Customer: ${customer}
Status: Provisioning In Progress

Network Functions Status:
• SMF Primary: ⚠️ Configuring (65%)
• SMF Secondary: ✅ Completed
• UPF Primary: ❌ Failed (Connection Timeout)
• UPF Secondary: ⏳ Pending
• ASR1K Primary: ✅ Completed
• ASR1K Secondary: ✅ Completed

Recommended Actions:
1. Review UPF Primary connectivity issues
2. Consider manual intervention for failed components
3. Monitor system logs for additional errors

Please review the MPN Dashboard for detailed status updates.
Dashboard: https://vsop.verizon.com/mpn/dashboard

Best regards,
MPN Operations Team`;
    
    if (message) message.value = messageText;
    if (emailRecipients) emailRecipients.value = 'abhishek.kumar21@verizon.com, mpn-ops-team@verizon.com';
    if (slackChannels) slackChannels.value = '#mpn-alerts, #operations, #network-support';
}

function closeNotificationModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) modal.classList.remove('show');
}

function sendNotifications() {
    const emails = document.getElementById('emailRecipients')?.value || '';
    const slackChannels = document.getElementById('slackChannels')?.value || '';
    const messageText = document.getElementById('notificationMessage')?.value || '';
    
    if (!emails && !slackChannels) {
        alert('Please specify at least one notification method.');
        return;
    }
    
    if (!messageText.trim()) {
        alert('Please enter a message to send.');
        return;
    }
    
    let notifications = [];
    if (emails) notifications.push(`📧 Email sent to: ${emails}`);
    if (slackChannels) notifications.push(`💬 Slack notification sent to: ${slackChannels}`);
    
    alert(`✅ Notifications sent successfully!

${notifications.join('\n')}

📊 Delivery Status:
• Email notifications: Queued for delivery
• Slack notifications: Posted successfully
• SMS alerts: Enabled for critical status changes
• Dashboard updates: Real-time sync active

Recipients will receive updates within 2-3 minutes.`);
    closeNotificationModal();
}

// Bulk Operations Functions
function showBulkModal() {
    const modal = document.getElementById('bulkModal');
    if (modal) modal.classList.add('show');
}

function closeBulkModal() {
    const modal = document.getElementById('bulkModal');
    if (modal) modal.classList.remove('show');
}

function executeBulkOperation() {
    const selectedNFs = [];
    const checkboxes = document.querySelectorAll('#bulkModal input[type="checkbox"]:checked');
    checkboxes.forEach(cb => selectedNFs.push(cb.value));

    const operation = document.querySelector('input[name="bulk-operation"]:checked')?.value;
    
    if (selectedNFs.length === 0) {
        alert('Please select at least one network function.');
        return;
    }
    
    if (!operation) {
        alert('Please select an operation.');
        return;
    }

    const confirmMessage = `Are you sure you want to execute "${operation}" on the following network functions?\n\n${selectedNFs.join('\n')}`;
    
    if (confirm(confirmMessage)) {
        alert(`🔄 Executing ${operation} on: ${selectedNFs.join(', ')}

Operation Details:
• Selected Functions: ${selectedNFs.length}
• Operation Type: ${operation.toUpperCase()}
• Execution Mode: Sequential (safer)
• Estimated Time: ${selectedNFs.length * 2} minutes

Status updates will be available in the console logs.`);
        closeBulkModal();
    }
}

// Individual Network Function Actions
function pauseNF(nfId) {
    alert(`⏸️ Pausing ${nfId}...

Network Function: ${nfId.toUpperCase()}
Action: PAUSE_OPERATIONS
Status: Processing...

This will temporarily halt all ongoing operations for this network function.
Operations can be resumed at any time.`);
}

function retryNF(nfId) {
    alert(`🔄 Retrying ${nfId}...

Network Function: ${nfId.toUpperCase()}
Action: RETRY_FAILED_OPERATIONS
Status: Initiating retry sequence...

Retry Parameters:
• Max attempts: 3
• Backoff strategy: Exponential
• Timeout: 300 seconds
• Auto-rollback: Enabled`);
}

function rollbackNF(nfId) {
    if (confirm(`Are you sure you want to rollback ${nfId}? This action cannot be undone.`)) {
        alert(`↩️ Rolling back ${nfId}...

Network Function: ${nfId.toUpperCase()}
Action: CONFIGURATION_ROLLBACK
Status: Executing rollback...

Rollback Process:
• Saving current state snapshot
• Reverting to last known good configuration
• Validating rollback success
• Updating operational status

Expected completion: 5-10 minutes`);
    }
}

function startNF(nfId) {
    alert(`▶️ Starting ${nfId}...

Network Function: ${nfId.toUpperCase()}
Action: START_OPERATIONS
Status: Initiating startup sequence...

Startup checks in progress:
• Dependency validation
• Resource availability
• Configuration integrity
• Network connectivity`);
}

function skipNF(nfId) {
    if (confirm(`Are you sure you want to skip ${nfId}? This may affect dependent services.`)) {
        alert(`⏭️ Skipping ${nfId}...

Network Function: ${nfId.toUpperCase()}
Action: SKIP_PROVISIONING
Status: Marking as skipped...

Note: Dependent services may be affected.
Manual intervention may be required later.`);
    }
}

function viewLogs(nfId) {
    alert(`📋 Opening comprehensive logs for ${nfId}...

Available Log Types:
• Operational Logs
• Error Logs
• Performance Metrics
• Configuration History
• Debug Traces

Logs will open in a new window with real-time updates.`);
}

function viewConfig(nfId) {
    alert(`⚙️ Opening configuration viewer for ${nfId}...

Configuration Details:
• Current Active Config
• Pending Changes
• Configuration History
• Validation Status
• Dependencies

Opening read-only configuration viewer...`);
}

function debugNF(nfId) {
    alert(`🔍 Opening debug console for ${nfId}...

Debug Features Available:
• Real-time command execution
• Performance monitoring
• Network diagnostics
• Resource utilization
• Error analysis

Debug session will be logged for security purposes.`);
}

// Bulk Work Order Actions
function pauseAll() {
    if (confirm('Are you sure you want to pause all network functions? This will halt all ongoing operations.')) {
        alert(`⏸️ Pausing all network functions...

Affected Functions: 6
• SMF Primary & Secondary
• UPF Primary & Secondary  
• ASR1K Primary & Secondary

Operation Status: In Progress...
Expected completion: 2-3 minutes

All operations will be safely paused and can be resumed later.`);
    }
}

function resumeAll() {
    alert(`▶️ Resuming all paused network functions...

Resuming Operations:
• Validating system state
• Checking dependencies
• Restarting paused processes
• Synchronizing configurations

Status: Processing...
Expected completion: 3-5 minutes`);
}

function rollbackAll() {
    if (confirm('Are you sure you want to rollback all network functions? This action cannot be undone.')) {
        alert(`↩️ Rolling back all network functions...

CRITICAL OPERATION IN PROGRESS:
• SMF Primary & Secondary: Rolling back
• UPF Primary & Secondary: Rolling back
• ASR1K Primary & Secondary: Rolling back

Rollback Process:
• Creating system snapshot
• Reverting to last stable state
• Validating configurations
• Testing connectivity

⚠️ Service impact expected: 10-15 minutes
Emergency contact: +1-800-VERIZON`);
    }
}

// AI Functions
function summarizePayloads() {
    const modal = document.getElementById('aiSummaryModal');
    if (modal) {
        modal.classList.add('show');
    } else {
        alert(`🤖 AI Payload Summary:

ANALYSIS COMPLETE:
• 3 Work Orders analyzed
• 18 Network Functions total
• 12 Successful, 4 Failed, 2 Pending

KEY INSIGHTS:
• BMW: UPF Primary needs attention (timeout issues)
• Tesla: All functions operational ✅
• Walmart: Multiple critical failures require escalation

PERFORMANCE METRICS:
• Average provisioning time: 18 minutes
• Success rate: 66.7%
• Most common failure: Connection timeouts (67%)

RECOMMENDATIONS:
• Increase timeout values for UPF connections
• Implement retry logic with exponential backoff
• Review network connectivity between data centers
• Consider parallel processing for independent functions

PREDICTED RESOLUTION TIME: 2-4 hours with recommended fixes`);
    }
}

function closeAiSummaryModal() {
    const modal = document.getElementById('aiSummaryModal');
    if (modal) modal.classList.remove('show');
}

function troubleshootFailures() {
    alert(`🔍 AI Troubleshooting Analysis:

FAILURES DETECTED:
• BMW UPF Primary: Connection timeout (10.0.0.1:443)
• Walmart SMF Primary: Authentication failure with RADIUS
• Walmart Oracle DSS: Database connection pool exhausted

ROOT CAUSE ANALYSIS:
1. Network Infrastructure Issues (60%):
   - Firewall blocking port 443
   - Network latency >500ms
   - DNS resolution failures

2. Authentication Problems (25%):
   - RADIUS server overload
   - Certificate expiration
   - Credential synchronization lag

3. Resource Exhaustion (15%):
   - Database connection limits reached
   - Memory utilization >90%
   - CPU throttling detected

AI RECOMMENDATIONS:
1. Immediate Actions:
   • Verify firewall rules for UPF connectivity
   • Restart RADIUS authentication service
   • Scale database connection pool (+50%)

2. Long-term Fixes:
   • Implement circuit breaker patterns
   • Add connection health monitoring
   • Deploy automated failover mechanisms

PROBABILITY OF SUCCESS: 87% with recommended fixes
ESTIMATED RESOLUTION TIME: 45-90 minutes`);
}

function predictIssues() {
    alert(`🔮 AI Predictive Analysis:

POTENTIAL ISSUES (Next 24 hours):
• 78% chance of Oracle DSS overload during peak hours (2-4 PM EST)
• 45% probability of RADIUS timeout in Dallas region
• 32% risk of network congestion during maintenance window
• Resource contention likely in Tesla workloads (3-5 PM EST)

RISK ASSESSMENT:
🔴 HIGH RISK:
• Database connection exhaustion
• Memory leak in SMF primary nodes

🟡 MEDIUM RISK:
• Certificate expiration (72 hours)
• Disk space utilization trending upward

🟢 LOW RISK:
• Minor performance degradation
• Non-critical log rotation issues

PREVENTIVE ACTIONS:
• Scale Oracle DSS instances before 1:00 PM EST
• Pre-warm RADIUS connection pools
• Schedule Tesla maintenance during off-peak hours
• Enable auto-scaling for critical components
• Implement proactive alerting for resource thresholds

MACHINE LEARNING CONFIDENCE: 91.3%
Based on historical patterns from 10,247 work orders`);
}

function optimizeWorkflows() {
    alert(`⚡ AI Workflow Optimization:

CURRENT PERFORMANCE ANALYSIS:
• Average provisioning time: 18 minutes
• Success rate: 76.8%
• Manual intervention required: 23.2% of cases
• Resource utilization: 67% (suboptimal)

OPTIMIZATION OPPORTUNITIES:

1. PARALLEL EXECUTION (Impact: HIGH)
   • Current: Sequential processing
   • Optimized: Parallel independent tasks
   • Time reduction: 45% (8 minutes saved)
   • Risk level: Low

2. PRE-VALIDATION CHECKS (Impact: HIGH)
   • Current: Validation during execution
   • Optimized: Upfront validation pipeline
   • Success rate improvement: +12.2% (to 89%)
   • Failure prevention: 67% of timeout issues

3. INTELLIGENT RETRY LOGIC (Impact: MEDIUM)
   • Current: Fixed retry intervals
   • Optimized: Exponential backoff with jitter
   • Manual intervention reduction: 65% (to 8.1%)
   • Recovery time improvement: 23%

4. RESOURCE OPTIMIZATION (Impact: MEDIUM)
   • Current: Static resource allocation
   • Optimized: Dynamic scaling based on workload
   • Throughput increase: 34%
   • Cost reduction: 18%

ESTIMATED IMPROVEMENTS:
• Total time savings: 8 minutes per work order
• Success rate: 76.8% → 89.0%
• Manual intervention: 23.2% → 8.1%
• Resource efficiency: 67% → 85%

PROJECTED ROI: 340% over 12 months
Implementation effort: 4-6 weeks`);
}

function generateReports() {
    alert(`📊 AI Report Generation:

GENERATING COMPREHENSIVE REPORTS:
✅ Executive Dashboard Summary
✅ Technical Performance Metrics  
✅ Customer Impact Analysis
✅ Trend Analysis & Forecasting
✅ SLA Compliance Report
✅ Root Cause Analysis
✅ Resource Utilization Study
✅ Security Audit Summary

REPORT FORMATS:
• PDF Executive Summary (C-Suite)
• Interactive Power BI Dashboard (Operations)
• Excel Detailed Analysis (Engineering)
• JSON API Export (Integration)
• Confluence Documentation (Knowledge Base)

DISTRIBUTION CHANNELS:
• Email: Automated weekly/monthly delivery
• Slack: Real-time alerts and summaries
• SharePoint: Document repository
• Tableau: Live dashboard integration

KEY METRICS INCLUDED:
• Work order completion rates
• Network function reliability scores
• Customer satisfaction indices
• Performance trend analysis
• Predictive failure models
• Cost optimization opportunities

ESTIMATED COMPLETION: 3 minutes
Reports will be available in the MPN Portal under Analytics section.

Would you like to schedule automatic report generation?`);
}

// Dashboard Functions
function showMPNDashboard() {
    // Already showing MPN dashboard - could refresh data
    console.log('MPN Dashboard view activated');
}

function refreshDashboard() {
    alert(`🔄 Refreshing dashboard data...

UPDATING COMPONENTS:
• Work order status ✅
• Network function metrics ✅
• Performance statistics ✅
• Real-time alerts ✅
• AI recommendations ✅

Data Sources:
• VHAP Event Bus: Connected
• Network Monitoring: Active
• Performance DB: Synchronized
• Alert Manager: Online

Last Updated: ${new Date().toLocaleString()}
Next Auto-refresh: 30 seconds

✅ Dashboard refreshed successfully!`);
}

function exportDashboard() {
    alert(`📊 Exporting Dashboard:

EXPORT OPTIONS AVAILABLE:
• PDF Report (Executive Summary)
• Excel Spreadsheet (Detailed Data)
• PowerPoint Presentation (Stakeholder Brief)
• JSON API Export (Raw Data)
• CSV Data Files (Analytics)
• Power BI Template (Interactive)

EXPORT INCLUDES:
• Current work order status
• Network function performance
• Historical trend data
• AI insights and recommendations
• SLA compliance metrics
• Resource utilization charts

FILE GENERATION:
• Executive PDF: 2.3 MB
• Detailed Excel: 15.7 MB
• JSON Export: 4.1 MB
• Power BI Template: 8.9 MB

Downloads will begin automatically.
Files will be available for 7 days in your download history.

Select your preferred format and download will commence.`);
}

function bulkOperations() {
    showBulkModal();
}

function retryWorkOrder(workOrderId) {
    alert(`🔄 Retrying work order ${workOrderId}...

RETRY CONFIGURATION:
• Work Order: ${workOrderId.toUpperCase()}
• Retry Strategy: Intelligent (AI-powered)
• Max Attempts: 3
• Backoff Policy: Exponential with jitter
• Timeout: Extended (600 seconds)

RETRY PROCESS:
1. Analyzing previous failure points
2. Adjusting timeout parameters
3. Implementing circuit breaker patterns
4. Enhanced error handling
5. Real-time monitoring activation

Expected completion: 15-20 minutes
Status updates available in console logs.`);
}

function viewErrorLogs(workOrderId) {
    alert(`📋 Error Analysis for ${workOrderId.toUpperCase()}:

COMPREHENSIVE ERROR REPORT:

🔴 CRITICAL ERRORS:
• Primary SMF: Authentication failure with RADIUS server
• UPF Primary: Network connectivity timeout (443/HTTPS)
• Oracle DSS: Database connection pool exhausted

🟡 WARNING CONDITIONS:
• Memory utilization approaching limits (87%)
• Network latency higher than baseline (+340ms)
• Certificate expiration within 72 hours

📊 ERROR STATISTICS:
• Total errors: 12
• Critical: 3
• Warnings: 6
• Info: 3

🔧 RECOMMENDED ACTIONS:
1. Verify RADIUS server credentials and connectivity
2. Check firewall rules for UPF port 443 access
3. Scale Oracle DSS connection pool capacity
4. Implement connection health monitoring
5. Schedule certificate renewal workflow

🤖 AI INSIGHTS:
• Pattern detected: Similar issues in 23% of BMW orders
• Root cause probability: Network infrastructure (78%)
• Recommended fix priority: Database scaling (immediate)

Detailed logs available in system monitoring console.`);
}

// Utility Functions
function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.classList.remove('hidden');
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.classList.add('hidden');
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('form-error');
        
        // Remove existing error messages
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
}

function showSuccess(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.remove('form-error');
        
        // Remove existing messages
        const existingMessages = field.parentNode.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Add success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        field.parentNode.appendChild(successDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }
}

function clearValidationErrors() {
    document.querySelectorAll('.form-error').forEach(field => {
        field.classList.remove('form-error');
    });
    document.querySelectorAll('.error-message, .success-message').forEach(msg => {
        msg.remove();
    });
}

// Debounce utility function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced Event Listeners
document.addEventListener('change', function(e) {
    // Handle execution mode changes
    if (e.target.name === 'executionMode') {
        const scheduledDiv = document.getElementById('scheduledDateTime');
        if (scheduledDiv) {
            if (e.target.value === 'scheduled') {
                scheduledDiv.classList.remove('hidden');
            } else {
                scheduledDiv.classList.add('hidden');
            }
        }
    }
    
    // Handle manual JSON toggle for delete confirmation
    if (e.target.id === 'deleteManualJsonToggle') {
        const textarea = document.getElementById('deleteManualJsonInput');
        if (textarea) {
            if (e.target.checked) {
                textarea.classList.remove('hidden');
            } else {
                textarea.classList.add('hidden');
            }
        }
    }
    
    // Handle manual JSON toggle for edit form
    if (e.target.id === 'editManualJsonToggle') {
        const textarea = document.getElementById('editManualJsonInput');
        if (textarea) {
            if (e.target.checked) {
                textarea.classList.remove('hidden');
            } else {
                textarea.classList.add('hidden');
            }
        }
    }
});

// Click outside modal to close
document.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            openModal.classList.remove('show');
        }
    }
    
    // Ctrl+N for new work order
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        createNewWorkOrder();
    }
    
    // Ctrl+R for refresh dashboard
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshDashboard();
    }
});

// Auto-save draft functionality
let autoSaveTimer;
function setupAutoSave() {
    const formInputs = document.querySelectorAll('#newWorkOrderForm input, #newWorkOrderForm select, #newWorkOrderForm textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            const workOrderId = document.getElementById('workOrderId')?.value;
            if (workOrderId) {
                clearTimeout(autoSaveTimer);
                autoSaveTimer = setTimeout(() => {
                    saveFormData(workOrderId);
                }, 5000); // Auto-save after 5 seconds of inactivity
            }
        }, 1000));
    });
}

function saveFormData(workOrderId) {
    const formData = {
        workOrderId: workOrderId,
        customerId: document.getElementById('customerId')?.value || '',
        customerName: document.getElementById('customerName')?.value || '',
        priority: document.getElementById('priority')?.value || '2',
        networkType: document.getElementById('networkType')?.value || '4G_5G',
        dseName: document.getElementById('dseName')?.value || '',
        dseGroup: document.getElementById('dseGroup')?.value || '',
        autoSavedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`autosave_${workOrderId}`, JSON.stringify(formData));
    console.log(`Auto-saved form data for ${workOrderId}`);
}

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        const loadTime = navigationTiming.loadEventEnd - navigationTiming.loadEventStart;
        
        console.log(`Dashboard load time: ${loadTime.toFixed(2)}ms`);
        
        // Track user interactions
        let interactionCount = 0;
        document.addEventListener('click', () => {
            interactionCount++;
        });
        
        // Report usage statistics every 5 minutes
        setInterval(() => {
            console.log(`User interactions in last 5 minutes: ${interactionCount}`);
            interactionCount = 0;
        }, 300000);
    }
}

// Error handling and logging
window.addEventListener('error', function(e) {
    console.error('Dashboard error:', e.error);
    
    // In production, this would send to logging service
    const errorData = {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    // Store error locally for debugging
    const errors = JSON.parse(localStorage.getItem('dashboard_errors') || '[]');
    errors.push(errorData);
    
    // Keep only last 10 errors
    if (errors.length > 10) errors.splice(0, errors.length - 10);
    
    localStorage.setItem('dashboard_errors', JSON.stringify(errors));
});

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced MPN Dashboard initialized');
    
    // Initialize data
    filteredWorkOrders = [...allWorkOrders];
    updateResultsCount();
    updatePagination();
    
    // Setup event listeners for real-time filtering
    const filterInputs = document.querySelectorAll('.filter-input, .filter-select');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
        if (input.type === 'text') {
            input.addEventListener('keyup', debounce(applyFilters, 300));
        }
    });
    
    // Setup auto-save for forms
    setupAutoSave();
    
    // Start performance tracking
    trackPerformance();
    
    // Setup periodic data refresh (every 30 seconds)
    setInterval(() => {
        // In production, this would fetch fresh data from API
        console.log('Periodic data refresh...');
        updateResultsCount();
    }, 30000);
    
    console.log('✅ All dashboard components initialized successfully');
});

// Service Worker registration for offline capability
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered successfully');
        })
        .catch(error => {
            console.log('Service Worker registration failed');
        });
}

// Export functions for external use
window.MPNDashboard = {
    toggleWorkOrder,
    createNewWorkOrder,
    refreshDashboard,
    exportDashboard,
    applyFilters,
    clearFilters,
    viewConsoleLog,
    editWorkOrder,
    deleteWorkOrder,
    notifyVHAP,
    notifyUsers,
    bulkOperations,
    summarizePayloads,
    troubleshootFailures,
    predictIssues,
    optimizeWorkflows,
    generateReports
};// MPN Dashboard JavaScript Functions - Enhanced Version

// Global variables
let currentPage = 1;
let totalPages = 3415;
let filteredWorkOrders = [];
let allWorkOrders = [
    {
        id: 'WO-4915',
        customer: 'BMW Enterprise',
        customerId: '05421',
        status: 'provisioning',
        apn: 'custonet5g.vzwentp',
        networkType: '4G_5G',
        poolType: 'static',
        operation: 'create',
        priority: 'high'
    },
    {
        id: 'WO-4916',
        customer: 'Tesla Motors',
        customerId: '05422',
        status: 'completed',
        apn: 'custonet5g.vzwentp',
        networkType: '5G',
        poolType: 'dynamic',
        operation: 'create',
        priority: 'medium'
    },
    {
        id: 'WO-4917',
        customer: 'Walmart Inc.',
        customerId: '05423',
        status: 'failed',
        apn: 'enterprise.vzwentp',
        networkType: '4G_5G',
        poolType: 'static',
        operation: 'create',
        priority: 'high'
    }
];

// Toggle work order details
function toggleWorkOrder(workOrderId) {
    const details = document.getElementById(`details-${workOrderId}`);
    const chevron = document.getElementById(`chevron-${workOrderId}`);
    
    if (details && chevron) {
        if (details.classList.contains('expanded')) {
            details.classList.remove('expanded');
            chevron.classList.remove('expanded');
        } else {
            details.classList.add('expanded');
            chevron.classList.add('expanded');
        }
    }
}

// Filter Functions
function applyFilters() {
    const customerFilter = document.getElementById('customerFilter')?.value.toLowerCase() || '';
    const apnFilter = document.getElementById('apnFilter')?.value || '';
    const networkTypeFilter = document.getElementById('networkTypeFilter')?.value || '';
    const poolTypeFilter = document.getElementById('poolTypeFilter')?.value || '';
    const operationFilter = document.getElementById('operationFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    filteredWorkOrders = allWorkOrders.filter(wo => {
        return (
            (customerFilter === '' || wo.customer.toLowerCase().includes(customerFilter)) &&
            (apnFilter === '' || wo.apn === apnFilter) &&
            (networkTypeFilter === '' || wo.networkType === networkTypeFilter) &&
            (poolTypeFilter === '' || wo.poolType === poolTypeFilter) &&
            (operationFilter === '' || wo.operation === operationFilter) &&
            (statusFilter === '' || wo.status === statusFilter)
        );
    });

    updateResultsCount();
}

function clearFilters() {
    const filterElements = [
        'customerFilter', 'apnFilter', 'networkTypeFilter', 
        'poolTypeFilter', 'operationFilter', 'statusFilter'
    ];
    
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    filteredWorkOrders = [...allWorkOrders];
    updateResultsCount();
}

function updateResultsCount() {
    const count = filteredWorkOrders.length;
    const total = 10247;
    const resultsElement = document.getElementById('resultsCount');
    if (resultsElement) {
        resultsElement.textContent = 
            `Showing ${Math.min(count, 3)} of ${count} filtered work orders (${total} total)`;
    }
}

function saveFilterPreset() {
    const presetName = prompt('Enter a name for this filter preset:');
    if (presetName) {
        // In a real app, this would save to backend
        localStorage.setItem(`filter_preset_${presetName}`, JSON.stringify({
            customerFilter: document.getElementById('customerFilter')?.value || '',
            apnFilter: document.getElementById('apnFilter')?.value || '',
            networkTypeFilter: document.getElementById('networkTypeFilter')?.value || '',
            poolTypeFilter: document.getElementById('poolTypeFilter')?.value || '',
            operationFilter: document.getElementById('operationFilter')?.value || '',
            statusFilter: document.getElementById('statusFilter')?.value || ''
        }));
        alert(`Filter preset "${presetName}" saved successfully!`);
    }
}

// Pagination Functions
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
}

function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
    }
}

function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updatePagination();
    }
}

function updatePagination() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    
    console.log(`Loading page ${currentPage} of ${totalPages}`);
    
    // Update active page button
    document.querySelectorAll('.pagination button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent == currentPage) {
            btn.classList.add('active');
        }
    });
}

// Enhanced Work Order Management Functions
function createNewWorkOrder() {
    const modal = document.getElementById('newWorkOrderModal');
    if (modal) {
        modal.classList.add('show');
        generateWorkOrderId();
        setupDragAndDrop();
    }
}

function closeNewWorkOrderModal() {
    const modal = document.getElementById('newWorkOrderModal');
    const form = document.getElementById('newWorkOrderForm');
    
    if (modal) modal.classList.remove('show');
    if (form) form.reset();
    
    hideElement('filePreview');
    hideElement('configPreview');
    hideElement('validationResults');
    clearValidationErrors();
}

function generateWorkOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const workOrderId = `WO-${timestamp}`;
    const element = document.getElementById('workOrderId');
    if (element) element.value = workOrderId;
}

// Enhanced File Upload with Drag & Drop
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    if (!uploadArea) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    uploadArea.addEventListener('drop', handleDrop, false);
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) uploadArea.classList.add('drag-over');
}

function unhighlight(e) {
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        const fileInput = document.getElementById('jsonFile');
        if (fileInput) {
            fileInput.files = files;
            handleFileUpload({ target: { files: files } });
        }
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const validationResult = validateFileUpload(file);
    if (!validationResult.isValid) {
        showError('jsonFile', validationResult.message);
        return;
    }

    clearValidationErrors();
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const jsonContent = JSON.parse(e.target.result);
            displayFilePreview(file, jsonContent);
            parseJsonForPreview(jsonContent);
            showSuccess('jsonFile', 'File uploaded successfully');
        } catch (error) {
            showError('jsonFile', `Invalid JSON file: ${error.message}`);
        }
    };
    
    reader.onerror = function() {
        showError('jsonFile', 'Error reading file');
    };
    
    reader.readAsText(file);
}

function validateFileUpload(file) {
    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
        return { isValid: false, message: 'Please upload a valid JSON file' };
    }
    
    if (file.size > 10 * 1024 * 1024) {
        return { isValid: false, message: 'File size must be less than 10MB' };
    }
    
    if (file.size === 0) {
        return { isValid: false, message: 'File appears to be empty' };
    }
    
    return { isValid: true };
}

function displayFilePreview(file, jsonContent) {
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const jsonPreview = document.getElementById('jsonPreview');
    
    if (fileName) fileName.textContent = file.name;
    if (fileSize) fileSize.textContent = `(${(file.size / 1024).toFixed(1)} KB)`;
    if (jsonPreview) jsonPreview.textContent = JSON.stringify(jsonContent, null, 2);
    
    showElement('filePreview');
}

function parseJsonForPreview(jsonData) {
    if (jsonData && jsonData.orderSpecification) {
        const spec = jsonData.orderSpecification;
        
        // SMF Preview
        if (spec.SMF_Primary) {
            const smfData = spec.SMF_Primary['/ncs:services/smfService:smf-customer-onboard']?.[0];
            const smfPreview = document.getElementById('smfPreview');
            if (smfData && smfPreview) {
                smfPreview.innerHTML = `
                    Customer ID: ${smfData['customer-id'] || 'N/A'}<br>
                    CLLI: ${smfData['clli-name'] || 'N/A'}<br>
                    APN: ${smfData['apn-name'] || 'N/A'}<br>
                    Pools: ${smfData.pool?.length || 0} configured
                `;
            }
        }
        
        // UPF Preview
        if (spec.UPF_Primary) {
            const upfData = spec.UPF_Primary['/ncs:services/upfService:upf-customer-onboard']?.[0];
            const upfPreview = document.getElementById('upfPreview');
            if (upfData && upfPreview) {
                upfPreview.innerHTML = `
                    Customer ID: ${upfData['customer-id'] || 'N/A'}<br>
                    CLLI: ${upfData['clli-name'] || 'N/A'}<br>
                    VRF: ${upfData.vrf || 'N/A'}<br>
                    Transport: ${upfData['transport-type'] || 'N/A'}
                `;
            }
        }
        
        // ASR1K Preview
        if (spec.ASR1K_Primary) {
            const asr1kData = spec.ASR1K_Primary['/ncs:services/asr1kService:asr1k-customer-onboard']?.[0];
            const asr1kPreview = document.getElementById('asr1kPreview');
            if (asr1kData && asr1kPreview) {
                asr1kPreview.innerHTML = `
                    Customer ID: ${asr1kData['customer-id'] || 'N/A'}<br>
                    Device: ${asr1kData.device || 'N/A'}<br>
                    Customer Name: ${asr1kData['customer-vrf']?.['customer-name'] || 'N/A'}<br>
                    RD: ${asr1kData['customer-vrf']?.rd || 'N/A'}
                `;
            }
        }
        
        showElement('configPreview');
    }
}

function removeFile() {
    const fileInput = document.getElementById('jsonFile');
    if (fileInput) fileInput.value = '';
    
    hideElement('filePreview');
    hideElement('configPreview');
    clearValidationErrors();
}

function toggleManualInput() {
    const checkbox = document.getElementById('manualJsonToggle');
    const textarea = document.getElementById('manualJsonInput');
    
    if (checkbox && textarea) {
        if (checkbox.checked) {
            textarea.classList.remove('hidden');
        } else {
            textarea.classList.add('hidden');
            textarea.value = '';
        }
    }
}

console.log("Dashboard.js file loaded successfully");
window.createNewWorkOrder = createNewWorkOrder;
window.bulkOperations = bulkOperations;
window.toggleWorkOrder = toggleWorkOrder;
window.refreshDashboard = refreshDashboard;
window.exportDashboard = exportDashboard;
window.showMPNDashboard = showMPNDashboard;

console.log("Functions made global:", {
    createNewWorkOrder: typeof window.createNewWorkOrder,
    bulkOperations: typeof window.bulkOperations,
    toggleWorkOrder: typeof window.toggleWorkOrder
});