// Global variables
let currentTab = "available";
let currentModalTab = "borrow";

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeTabs();
  initializeModals();
  initializeForms();
  loadItemsTable("available");
});

// Tab functionality
function initializeTabs() {
  const tabTriggers = document.querySelectorAll(".tab-trigger");

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const tabName = this.getAttribute("data-tab");
      switchTab(tabName, this.closest(".tabs"));
    });
  });
}

function switchTab(tabName, tabsContainer) {
  // Update triggers
  const triggers = tabsContainer.querySelectorAll(".tab-trigger");
  triggers.forEach((trigger) => {
    trigger.classList.remove("active");
    if (trigger.getAttribute("data-tab") === tabName) {
      trigger.classList.add("active");
    }
  });

  // Update content
  const contents = tabsContainer.querySelectorAll(".tab-content");
  contents.forEach((content) => {
    content.classList.remove("active");
    if (content.id === tabName) {
      content.classList.add("active");
    }
  });

  // Load appropriate content for main tabs
  if (tabsContainer.closest(".main-content")) {
    currentTab = tabName;
    loadItemsTable(tabName);
  }

  // Handle modal tabs
  if (tabsContainer.closest(".modal")) {
    currentModalTab = tabName;
    updateModalSubmitButton();
  }
}

// Modal functionality
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";

    // Reset forms
    const forms = modal.querySelectorAll("form");
    forms.forEach((form) => form.reset());
  }
}

function initializeModals() {
  // Close modal when clicking outside
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal.active");
      if (activeModal) {
        closeModal(activeModal.id);
      }
    }
  });
}

// Form handling
function initializeForms() {
  // Add Item Form
  const addItemForm = document.getElementById("addItemForm");
  if (addItemForm) {
    addItemForm.addEventListener("submit", handleAddItem);
  }

  // Borrow Form
  const borrowForm = document.getElementById("borrowForm");
  if (borrowForm) {
    borrowForm.addEventListener("submit", handleBorrowRequest);
  }

  // Return Form
  const returnForm = document.getElementById("returnForm");
  if (returnForm) {
    returnForm.addEventListener("submit", handleReturnRequest);
  }

  // Report Forms
  const reportForms = [
    "inventoryReportForm",
    "borrowingReportForm",
    "auditReportForm",
  ];
  reportForms.forEach((formId) => {
    const form = document.getElementById(formId);
    if (form) {
      form.addEventListener("submit", handleReportGeneration);
    }
  });
}

function updateModalSubmitButton() {
  const submitBtn = document.getElementById("borrowSubmitBtn");
  if (submitBtn) {
    if (currentModalTab === "borrow") {
      submitBtn.textContent = "Submit Borrowing Request";
      submitBtn.onclick = () =>
        document
          .getElementById("borrowForm")
          .dispatchEvent(new Event("submit"));
    } else if (currentModalTab === "return") {
      submitBtn.textContent = "Process Return";
      submitBtn.onclick = () =>
        document
          .getElementById("returnForm")
          .dispatchEvent(new Event("submit"));
    }
  }
}

// Items table loading
function loadItemsTable(type) {
  const tableContainer = document.getElementById(type + "ItemsTable");
  if (!tableContainer) return;

  // Show loading state
  tableContainer.innerHTML = '<div class="loading">Loading items...</div>';

  // Simulate API call
  setTimeout(() => {
    const items = getItemsByType(type);
    renderItemsTable(items, type, tableContainer);
  }, 500);
}

function getItemsByType(type) {
  // Mock data - replace with actual API calls
  const allItems = [
    {
      id: "IT001",
      name: "Dell Laptop XPS 15",
      department: "IT",
      status: "available",
      category: "Electronics",
      quantity: 5,
    },
    {
      id: "IT002",
      name: "HP Printer LaserJet Pro",
      department: "IT",
      status: "borrowed",
      borrower: "John Doe",
      borrowDate: "2023-05-10",
      returnDate: "2023-05-20",
      category: "Electronics",
      quantity: 2,
    },
    {
      id: "SCI001",
      name: "Microscope Set",
      department: "Science",
      status: "available",
      category: "Lab Equipment",
      quantity: 10,
    },
    {
      id: "SCI002",
      name: "Chemistry Lab Kit",
      department: "Science",
      status: "pending",
      borrower: "Jane Smith",
      category: "Lab Equipment",
      quantity: 3,
    },
  ];

  return allItems.filter((item) => item.status === type);
}

function renderItemsTable(items, type, container) {
  if (items.length === 0) {
    container.innerHTML =
      '<div class="no-items">No ' + type + " items found</div>";
    return;
  }

  let tableHTML = `
        <div class="search-filter">
            <div class="search-input">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search items..." onkeyup="filterTable(this.value, '${type}')">
            </div>
            <select onchange="filterByDepartment(this.value, '${type}')">
                <option value="">All Departments</option>
                <option value="IT">IT</option>
                <option value="Science">Science</option>
                <option value="Arts">Arts</option>
                <option value="Sports">Sports</option>
            </select>
            <button class="btn btn-outline" onclick="resetFilters('${type}')">
                <i class="fas fa-refresh"></i>
            </button>
        </div>
        <div class="table-container">
            <table class="table" id="${type}Table">
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        ${type === "borrowed" || type === "pending" ? "<th>Borrower</th>" : ""}
                        ${type === "borrowed" ? "<th>Return Date</th>" : ""}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

  items.forEach((item) => {
    tableHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.department}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td><span class="badge badge-${item.status}">${item.status}</span></td>
                ${type === "borrowed" || type === "pending" ? `<td>${item.borrower || "N/A"}</td>` : ""}
                ${type === "borrowed" ? `<td>${item.returnDate || "N/A"}</td>` : ""}
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-outline btn-sm" onclick="viewItem('${item.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="editItem('${item.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${type === "available" ? `<button class="btn btn-outline btn-sm" onclick="borrowItem('${item.id}')">Borrow</button>` : ""}
                        ${type === "borrowed" ? `<button class="btn btn-outline btn-sm" onclick="returnItem('${item.id}')">Return</button>` : ""}
                        ${
                          type === "pending"
                            ? `
                            <button class="btn btn-primary btn-sm" onclick="approveRequest('${item.id}')">Approve</button>
                            <button class="btn btn-outline btn-sm" onclick="rejectRequest('${item.id}')">Reject</button>
                        `
                            : ""
                        }
                    </div>
                </td>
            </tr>
        `;
  });

  tableHTML += `
                </tbody>
            </table>
        </div>
    `;

  container.innerHTML = tableHTML;
}

// Item actions
function viewItem(itemId) {
  alert("View item: " + itemId);
}

function editItem(itemId) {
  alert("Edit item: " + itemId);
}

function borrowItem(itemId) {
  openModal("borrowItemModal");
  // Pre-select the item in the form
  const borrowSelect = document.getElementById("borrowItem");
  if (borrowSelect) {
    borrowSelect.value = itemId;
  }
}

function returnItem(itemId) {
  openModal("borrowItemModal");
  // Switch to return tab and pre-select item
  const modal = document.getElementById("borrowItemModal");
  const tabsContainer = modal.querySelector(".tabs");
  switchTab("return", tabsContainer);

  const returnSelect = document.getElementById("returnItem");
  if (returnSelect) {
    returnSelect.value = itemId;
  }
}

function approveRequest(itemId) {
  if (confirm("Approve this borrowing request?")) {
    alert("Request approved for item: " + itemId);
    loadItemsTable(currentTab);
  }
}

function rejectRequest(itemId) {
  if (confirm("Reject this borrowing request?")) {
    alert("Request rejected for item: " + itemId);
    loadItemsTable(currentTab);
  }
}

// Form handlers
function handleAddItem(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const itemData = Object.fromEntries(formData.entries());

  // Simulate API call
  setTimeout(() => {
    alert("Item added successfully!");
    closeModal("addItemModal");
    loadItemsTable(currentTab);
  }, 1000);
}

function handleBorrowRequest(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const requestData = Object.fromEntries(formData.entries());

  // Simulate API call
  setTimeout(() => {
    alert("Borrowing request submitted successfully!");
    closeModal("borrowItemModal");
    loadItemsTable(currentTab);
  }, 1000);
}

function handleReturnRequest(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const returnData = Object.fromEntries(formData.entries());

  // Simulate API call
  setTimeout(() => {
    alert("Return processed successfully!");
    closeModal("borrowItemModal");
    loadItemsTable(currentTab);
  }, 1000);
}

function handleReportGeneration(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const reportData = Object.fromEntries(formData.entries());

  // Simulate report generation
  setTimeout(() => {
    alert("Report generated successfully!");
    closeModal("reportModal");
  }, 2000);
}

// Table filtering
function filterTable(searchTerm, type) {
  const table = document.getElementById(type + "Table");
  if (!table) return;

  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    const matches = text.includes(searchTerm.toLowerCase());
    row.style.display = matches ? "" : "none";
  });
}

function filterByDepartment(department, type) {
  const table = document.getElementById(type + "Table");
  if (!table) return;

  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    if (!department) {
      row.style.display = "";
      return;
    }

    const deptCell = row.cells[2]; // Department column
    const matches = deptCell.textContent === department;
    row.style.display = matches ? "" : "none";
  });
}

function resetFilters(type) {
  // Reset search input
  const searchInput = document.querySelector(
    `#${type}ItemsTable .search-input input`,
  );
  if (searchInput) {
    searchInput.value = "";
  }

  // Reset department filter
  const deptSelect = document.querySelector(`#${type}ItemsTable select`);
  if (deptSelect) {
    deptSelect.value = "";
  }

  // Show all rows
  const table = document.getElementById(type + "Table");
  if (table) {
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      row.style.display = "";
    });
  }
}

// Utility functions
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add to page
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Set default dates for forms
function setDefaultDates() {
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Set return date default
  const returnDateInput = document.getElementById("returnDate");
  if (returnDateInput) {
    returnDateInput.value = nextWeek;
    returnDateInput.min = today;
  }

  // Set report date defaults
  const fromDateInputs = document.querySelectorAll("#fromDate");
  const toDateInputs = document.querySelectorAll("#toDate");

  fromDateInputs.forEach((input) => {
    input.value = today;
  });

  toDateInputs.forEach((input) => {
    input.value = today;
  });
}

// Initialize default dates when page loads
document.addEventListener("DOMContentLoaded", setDefaultDates);
