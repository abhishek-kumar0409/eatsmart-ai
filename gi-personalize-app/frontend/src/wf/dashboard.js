// MPN Dashboard JavaScript Functions

// Global variables
let currentPage = 1;
let totalPages = 3415;
let filteredWorkOrders = [];
let allWorkOrders = [
    {
        id: 'WO-12345',
        customer: 'BMW Enterprise',
        customerId: '01234',
        status: 'provisioning',
        apn: 'lmasmfup5g.vzwentp',
        networkType: '4G_5G',
        poolType: 'static',
        operation: 'create',
        priority: 'high'
    },
    {
        id: 'WO-12346',
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
        id: 'WO-12347',
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
    
    if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        chevron.classList.remove('expanded');
    } else {
        details.classList.add('expanded');
        chevron.classList.add('expanded');
    }
}

// Filter Functions
function applyFilters() {
    const customerFilter = document.getElementById('customerFilter').value.toLowerCase();
    const apnFilter = document.getElementById('apnFilter').value;
    const networkTypeFilter = document.getElementById('networkTypeFilter').value;
    const poolTypeFilter = document.getElementById('poolTypeFilter').value;
    const operationFilter = document.getElementById('operationFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

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
    document.getElementById('customerFilter').value = '';
    document.getElementById('apnFilter').value = '';
    document.getElementById('networkTypeFilter').value = '';
    document.getElementById('poolTypeFilter').value = '';
    document.getElementById('operationFilter').value = '';
    document.getElementById('statusFilter').value = '';
    
    filteredWorkOrders = allWorkOrders;
    updateResultsCount();
}

function updateResultsCount() {
    const count = filteredWorkOrders.length;
    const total = 10247;
    document.getElementById('resultsCount').textContent = 
        `Showing ${Math.min(count, 3)} of ${count} filtered work orders (${total} total)`;
}

function saveFilterPreset() {
    alert('Filter preset saved successfully!');
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
    currentPage = page;
    updatePagination();
}

function updatePagination() {
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
    console.log(`Loading page ${currentPage} of ${totalPages}`);
}

// Enhanced Work Order Management Functions
function createNewWorkOrder() {
    document.getElementById('newWorkOrderModal').classList.add('show');
    generateWorkOrderId();
    setupDragAndDrop();
}

function closeNewWorkOrderModal() {
    document.getElementById('newWorkOrderModal').classList.remove('show');
    document.getElementById('newWorkOrderForm').reset();
    hideElement('filePreview');
    clearValidationErrors();
}

function generateWorkOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const workOrderId = `WO-${timestamp}`;
    document.getElementById('workOrderId').value = workOrderId;
}

// Enhanced File Upload with Drag & Drop
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    
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
    document.getElementById('uploadArea').classList.add('drag-over');
}

function unhighlight(e) {
    document.getElementById('uploadArea').classList.remove('drag-over');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        document.getElementById('jsonFile').files = files;
        handleFileUpload({ target: { files: files } });
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
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = `(${(file.size / 1024).toFixed(1)} KB)`;
    showElement('filePreview');
}

function removeFile() {
    document.getElementById('jsonFile').value = '';
    hideElement('filePreview');
    clearValidationErrors();
}

function validateJson() {
    const fileInput = document.getElementById('jsonFile');
    
    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonContent = JSON.parse(e.target.result);
                alert('✅ JSON structure is valid');
            } catch (error) {
                alert(`❌ Invalid JSON: ${error.message}`);
            }
        };
        reader.readAsText(fileInput.files[0]);
    } else {
        alert('Please upload a JSON file first.');
    }
}

function submitWorkOrder(event) {
    event.preventDefault();
    
    const customerId = document.getElementById('customerId').value;
    const customerName = document.getElementById('customerName').value;
    
    if (!customerId || !customerName) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const fileInput = document.getElementById('jsonFile');
    
    if (fileInput.files.length === 0) {
        alert('Please upload a JSON file.');
        return;
    }
    
    alert(`✅ Work order created successfully!\nCustomer: ${customerName}\nID: ${customerId}`);
    closeNewWorkOrderModal();
}

// Console Log Functions
function viewConsoleLog(nfId, customerName) {
    document.getElementById('consoleLogModal').classList.add('show');
    document.getElementById('consoleLogTitle').textContent = `Console Log - ${nfId.toUpperCase()} (${customerName})`;
    
    const logContent = generateConsoleLog(nfId, customerName);
    const consoleDiv = document.getElementById('consoleLogContent');
    consoleDiv.innerHTML = logContent;
    
    if (document.getElementById('autoScrollLog').checked) {
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
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
                `[${timestamp}] Blocking APN: lmasmfup5g.vzwentp`,
                `[${timestamp}] Blocking Shared IP Pool: LMASMFUP5GONE001`,
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
                `[${timestamp}] Configuring VRF: MPN01234`,
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
    }
    
    return logs.map(log => `<div style="margin-bottom: 4px;">${log}</div>`).join('');
}

function closeConsoleLogModal() {
    document.getElementById('consoleLogModal').classList.remove('show');
}

function clearConsoleLog() {
    document.getElementById('consoleLogContent').innerHTML = '';
}

function downloadConsoleLog() {
    const logContent = document.getElementById('consoleLogContent').textContent;
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `console_log_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function refreshConsoleLog() {
    const title = document.getElementById('consoleLogTitle').textContent;
    const matches = title.match(/Console Log - (.+) \((.+)\)/);
    
    if (matches) {
        const nfId = matches[1].toLowerCase().replace(' ', '-');
        const customerName = matches[2];
        viewConsoleLog(nfId, customerName);
    }
}

function aiTroubleshootFromLog() {
    const logContent = document.getElementById('consoleLogContent').textContent;
    
    if (logContent.includes('ERROR') || logContent.includes('FAILED')) {
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
• Monitor network performance metrics`);
    } else {
        alert(`🤖 AI Analysis: 
✅ All operations completed successfully
📊 Performance within normal parameters
💡 No issues detected in current logs`);
    }
}

// VHAP Notification Function
function notifyVHAP(workOrderId) {
    const workOrder = allWorkOrders.find(wo => wo.id === workOrderId.replace('wo', 'WO-1234'));
    
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
• Recovery actions`);
}

// Orchestration Support Notification
function notifyOrchestration(workOrderId) {
    const workOrder = allWorkOrders.find(wo => wo.id === workOrderId.replace('wo', 'WO-1234'));
    
    alert(`📧 Orchestration Support Team Notified:

Work Order: ${workOrderId.toUpperCase()}
Customer: ${workOrder ? workOrder.customer : 'Unknown'}
Priority: ${workOrder && workOrder.priority === 'high' ? 'HIGH PRIORITY 🚨' : 'Standard'}
Status: ${workOrder ? workOrder.status.toUpperCase() : 'Unknown'}

Notification sent to:
• orchestration-support@verizon.com
• mpn-ops-team@verizon.com
• network-engineering@verizon.com

Slack channels notified:
• #orchestration-alerts
• #mpn-operations
• #network-support

Support ticket auto-created: ORCH-${Date.now()}`);
}

// Network Function Actions
function pauseNF(nfId) {
    alert(`⏸️ Pausing ${nfId}...`);
}

function retryNF(nfId) {
    alert(`🔄 Retrying ${nfId}...`);
}

function debugNF(nfId) {
    alert(`🔍 Opening debug console for ${nfId}...`);
}

function retryWorkOrder(workOrderId) {
    alert(`🔄 Retrying work order ${workOrderId}...`);
}

function viewErrorLogs(workOrderId) {
    alert(`📋 Error Analysis for ${workOrderId}:

Root Cause Analysis:
• Primary SMF: Authentication failure with RADIUS server
• UPF Primary: Network connectivity timeout
• Oracle DSS: Database connection pool exhausted

Recommended Actions:
1. Verify RADIUS server credentials
2. Check firewall rules for UPF connectivity  
3. Restart Oracle DSS connection pool
4. Implement circuit breaker pattern`);
}

// Bulk Operations
function bulkOperations() {
    alert('⚙️ Bulk Operations panel would open here...');
}

// AI Functions
function summarizePayloads() {
    alert(`🤖 AI Payload Summary:

ANALYSIS COMPLETE:
• 3 Work Orders analyzed
• 24 Network Functions total
• 18 Successful, 4 Failed, 2 Pending

KEY INSIGHTS:
• BMW: UPF Primary needs attention (timeout issues)
• Tesla: All functions operational ✅
• Walmart: Multiple critical failures require escalation

RECOMMENDATIONS:
• Increase timeout values for UPF connections
• Implement retry logic for Oracle DSS
• Review RADIUS authentication for Walmart`);
}

function troubleshootFailures() {
    alert(`🔍 AI Troubleshooting Analysis:

FAILURES DETECTED:
• BMW UPF Primary: Connection timeout
• Walmart SMF Primary: Auth failure  
• Walmart Oracle DSS: Database timeout

AI RECOMMENDATIONS:
1. Check network connectivity between sites
2. Verify RADIUS server status and credentials
3. Restart Oracle connection pools
4. Implement exponential backoff retry logic
5. Enable circuit breaker patterns

PROBABILITY OF SUCCESS: 85% with recommended fixes`);
}

function predictIssues() {
    alert(`🔮 AI Predictive Analysis:

POTENTIAL ISSUES (Next 24 hours):
• 73% chance of Oracle DSS overload during peak hours
• 45% probability of RADIUS timeout in Dallas region  
• Resource contention likely in Tesla workloads (15:00-17:00 UTC)

PREVENTIVE ACTIONS:
• Scale Oracle DSS instances before 14:00 UTC
• Pre-warm RADIUS connection pools
• Schedule maintenance window for Tesla during low-traffic hours`);
}

function optimizeWorkflows() {
    alert(`⚡ AI Workflow Optimization:

CURRENT PERFORMANCE:
• Average provisioning time: 18 minutes
• Success rate: 76.8%
• Manual intervention required: 23.2%

OPTIMIZATION OPPORTUNITIES:
• Parallel execution can reduce time by 45%
• Pre-validation checks improve success rate to 89%
• Automated retry logic reduces manual intervention to 8%

ESTIMATED IMPROVEMENTS:
• Time savings: 8 minutes per work order
• Success rate improvement: +12.2%
• Reduced manual effort: 65%`);
}

function generateReports() {
    alert(`📊 AI Report Generation:

GENERATING REPORTS:
• Executive Dashboard Summary ✅
• Technical Performance Metrics ✅  
• Customer Impact Analysis ✅
• Trend Analysis & Forecasting ✅
• SLA Compliance Report ✅

Reports will be available in:
• PDF format for executives
• Interactive dashboards for engineers
• API endpoints for integration
• Automated email distribution

Estimated completion: 2 minutes`);
}

// Dashboard Functions
function refreshDashboard() {
    alert('🔄 Refreshing dashboard data...');
    setTimeout(() => {
        alert('✅ Dashboard refreshed successfully!');
    }, 1000);
}

function exportDashboard() {
    alert(`📊 Exporting Dashboard:

Export Options:
• PDF Report (Executive Summary)
• Excel Spreadsheet (Detailed Data)
• JSON API Export (Raw Data)
• PowerBI Template

Select your preferred format and download will begin automatically.`);
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
        
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
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
        
        const existingMessages = field.parentNode.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        field.parentNode.appendChild(successDiv);
        
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

// Debounce utility function
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

// Event listeners
document.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced MPN Dashboard initialized');
    filteredWorkOrders = allWorkOrders;
    updateResultsCount();
    updatePagination();

    // Add event listeners for real-time filtering
    const filterInputs = document.querySelectorAll('.filter-input, .filter-select');
    filterInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
        if (input.type === 'text') {
            input.addEventListener('keyup', debounce(applyFilters, 300));
        }
    });
}); {
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
    document.getElementById('uploadArea').classList.add('drag-over');
}

function unhighlight(e) {
    document.getElementById('uploadArea').classList.remove('drag-over');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        document.getElementById('jsonFile').files = files;
        handleFileUpload({ target: { files: files } });
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
            showSuccess('jsonFile', 'File uploaded successfully');
        } catch (error) {
            showError('jsonFile', `Invalid JSON file: ${error.message}`);
        }
    };
    
    reader.onerror = function() {
        showError('jsonFile', 'Error reading file');
    };