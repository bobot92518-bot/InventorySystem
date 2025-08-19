<!-- Add Item Modal -->
<div id="addItemModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Add New Item</h2>
            <button class="close-btn" onclick="closeModal('addItemModal')">&times;</button>
        </div>
        <form id="addItemForm" class="modal-body">
            <div class="form-grid">
                <div class="form-group">
                    <label for="itemName">Item Name</label>
                    <input type="text" id="itemName" name="name" required>
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <select id="category" name="category" required>
                        <option value="">Select category</option>
                        <option value="electronics">Electronics</option>
                        <option value="furniture">Furniture</option>
                        <option value="books">Books</option>
                        <option value="sports">Sports Equipment</option>
                        <option value="lab">Lab Equipment</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" rows="3"></textarea>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label for="department">Department</label>
                    <select id="department" name="department" required>
                        <option value="">Select department</option>
                        <option value="it">IT Department</option>
                        <option value="science">Science Department</option>
                        <option value="arts">Arts Department</option>
                        <option value="sports">Sports Department</option>
                        <option value="admin">Administration</option>
                        <option value="library">Library</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="quantity">Quantity</label>
                    <input type="number" id="quantity" name="quantity" min="1" value="1" required>
                </div>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="available" name="available" checked>
                    Available for borrowing
                </label>
            </div>
        </form>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal('addItemModal')">Cancel</button>
            <button type="submit" form="addItemForm" class="btn btn-primary">Add Item</button>
        </div>
    </div>
</div>

<!-- Borrow Item Modal -->
<div id="borrowItemModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Borrow Item</h2>
            <button class="close-btn" onclick="closeModal('borrowItemModal')">&times;</button>
        </div>
        <div class="modal-body">
            <div class="tabs">
                <div class="tab-list">
                    <button class="tab-trigger active" data-tab="borrow">Borrow Request</button>
                    <button class="tab-trigger" data-tab="return">Return Item</button>
                </div>
                
                <div class="tab-content active" id="borrow">
                    <form id="borrowForm">
                        <div class="form-group">
                            <label for="borrowItem">Select Item</label>
                            <select id="borrowItem" name="itemId" required>
                                <option value="">Select an item to borrow</option>
                                <option value="1">Laptop</option>
                                <option value="2">Projector</option>
                                <option value="3">Whiteboard</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="borrowQuantity">Quantity</label>
                            <input type="number" id="borrowQuantity" name="quantity" min="1" value="1" required>
                        </div>
                        <div class="form-group">
                            <label for="purpose">Purpose</label>
                            <textarea id="purpose" name="purpose" rows="3" placeholder="Explain why you need this item" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="returnDate">Expected Return Date</label>
                            <input type="date" id="returnDate" name="returnDate" required>
                        </div>
                        <div class="form-group">
                            <label for="borrowDepartment">Department</label>
                            <select id="borrowDepartment" name="department" required>
                                <option value="">Select your department</option>
                                <option value="1">IT Department</option>
                                <option value="2">Science Department</option>
                                <option value="3">Math Department</option>
                                <option value="4">English Department</option>
                            </select>
                        </div>
                    </form>
                </div>
                
                <div class="tab-content" id="return">
                    <form id="returnForm">
                        <div class="form-group">
                            <label for="returnItem">Select Borrowed Item</label>
                            <select id="returnItem" name="itemId" required>
                                <option value="">Select an item to return</option>
                                <option value="4">Printer</option>
                                <option value="5">Scanner</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="condition">Return Condition</label>
                            <textarea id="condition" name="condition" rows="3" placeholder="Describe the condition of the item being returned" required></textarea>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal('borrowItemModal')">Cancel</button>
            <button type="submit" class="btn btn-primary" id="borrowSubmitBtn">Submit Request</button>
        </div>
    </div>
</div>

<!-- Report Modal -->
<div id="reportModal" class="modal">
    <div class="modal-content large">
        <div class="modal-header">
            <h2>Generate Report</h2>
            <button class="close-btn" onclick="closeModal('reportModal')">&times;</button>
        </div>
        <div class="modal-body">
            <div class="tabs">
                <div class="tab-list">
                    <button class="tab-trigger active" data-tab="inventory">Inventory Report</button>
                    <button class="tab-trigger" data-tab="borrowing">Borrowing Receipt</button>
                    <button class="tab-trigger" data-tab="audit">Audit Trail</button>
                </div>
                
                <div class="tab-content active" id="inventory">
                    <form id="inventoryReportForm">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="invDepartment">Department</label>
                                <select id="invDepartment" name="department">
                                    <option value="">All Departments</option>
                                    <option value="it">IT Department</option>
                                    <option value="science">Science Department</option>
                                    <option value="math">Math Department</option>
                                    <option value="english">English Department</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="invTemplate">Report Template</label>
                                <select id="invTemplate" name="template">
                                    <option value="standard">Standard Template</option>
                                    <option value="detailed">Detailed Template</option>
                                    <option value="summary">Summary Template</option>
                                    <option value="compact">Compact Template</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="fromDate">From Date</label>
                                <input type="date" id="fromDate" name="fromDate">
                            </div>
                            <div class="form-group">
                                <label for="toDate">To Date</label>
                                <input type="date" id="toDate" name="toDate">
                            </div>
                        </div>
                    </form>
                </div>
                
                <div class="tab-content" id="borrowing">
                    <form id="borrowingReportForm">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="borDepartment">Department</label>
                                <select id="borDepartment" name="department">
                                    <option value="">All Departments</option>
                                    <option value="it">IT Department</option>
                                    <option value="science">Science Department</option>
                                    <option value="math">Math Department</option>
                                    <option value="english">English Department</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="borTemplate">Receipt Template</label>
                                <select id="borTemplate" name="template">
                                    <option value="standard">Standard Template</option>
                                    <option value="detailed">Detailed Template</option>
                                    <option value="summary">Summary Template</option>
                                    <option value="compact">Compact Template</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="receiptId">Receipt ID (Optional)</label>
                            <input type="text" id="receiptId" name="receiptId" placeholder="Enter receipt ID for specific receipt">
                        </div>
                    </form>
                </div>
                
                <div class="tab-content" id="audit">
                    <form id="auditReportForm">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="audDepartment">Department</label>
                                <select id="audDepartment" name="department">
                                    <option value="">All Departments</option>
                                    <option value="it">IT Department</option>
                                    <option value="science">Science Department</option>
                                    <option value="math">Math Department</option>
                                    <option value="english">English Department</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="audTemplate">Audit Template</label>
                                <select id="audTemplate" name="template">
                                    <option value="standard">Standard Template</option>
                                    <option value="detailed">Detailed Template</option>
                                    <option value="summary">Summary Template</option>
                                    <option value="compact">Compact Template</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="activityType">Activity Type</label>
                            <select id="activityType" name="activityType">
                                <option value="all">All Activities</option>
                                <option value="borrowing">Borrowing</option>
                                <option value="return">Returns</option>
                                <option value="inventory">Inventory Changes</option>
                                <option value="user">User Actions</option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>
            
            <div class="report-preview">
                <div class="preview-header">
                    <h3>Preview</h3>
                    <button class="btn btn-outline btn-sm">
                        <i class="fas fa-cog"></i> Customize Template
                    </button>
                </div>
                <div class="preview-content">
                    <div class="preview-placeholder">
                        <i class="fas fa-file-alt"></i>
                        <p>Report preview will appear here</p>
                        <p class="small">Configure options and click Generate to preview</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="closeModal('reportModal')">Cancel</button>
            <button type="button" class="btn btn-outline">
                <i class="fas fa-print"></i> Print
            </button>
            <button type="button" class="btn btn-outline">
                <i class="fas fa-download"></i> Download
            </button>
            <button type="button" class="btn btn-primary">Generate Report</button>
        </div>
    </div>
</div>
