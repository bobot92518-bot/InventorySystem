<?php
session_start();
require_once 'config/database.php';
require_once 'includes/functions.php';

// Get dashboard statistics
$stats = getDashboardStats($pdo);
$recentActivities = getRecentActivities($pdo);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>School Property Management System</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="header-left">
                <i class="fas fa-box"></i>
                <h1>School Property Management System</h1>
            </div>
            <div class="header-right">
                <button class="icon-btn"><i class="fas fa-bell"></i></button>
                <button class="icon-btn"><i class="fas fa-cog"></i></button>
                <div class="user-info">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="User" class="avatar">
                    <div class="user-details">
                        <p class="user-name">Admin User</p>
                        <p class="user-email">admin@school.edu</p>
                    </div>
                </div>
                <button class="icon-btn"><i class="fas fa-sign-out-alt"></i></button>
            </div>
        </div>
    </header>

    <div class="main-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <nav class="sidebar-nav">
                <a href="#" class="nav-item active">
                    <i class="fas fa-tachometer-alt"></i>
                    Dashboard
                </a>
                <a href="#" class="nav-item">
                    <i class="fas fa-clipboard-list"></i>
                    Inventory
                </a>
                <a href="#" class="nav-item">
                    <i class="fas fa-file-alt"></i>
                    Reports
                </a>
                <a href="#" class="nav-item">
                    <i class="fas fa-cog"></i>
                    Settings
                </a>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Dashboard Stats -->
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Items</h3>
                    <div class="stat-number"><?php echo $stats['total_items']; ?></div>
                    <p>Across all departments</p>
                </div>
                <div class="stat-card">
                    <h3>Available Items</h3>
                    <div class="stat-number"><?php echo $stats['available_items']; ?></div>
                    <p>Ready for borrowing</p>
                </div>
                <div class="stat-card">
                    <h3>Borrowed Items</h3>
                    <div class="stat-number"><?php echo $stats['borrowed_items']; ?></div>
                    <p>Currently in use</p>
                </div>
                <div class="stat-card">
                    <h3>Pending Requests</h3>
                    <div class="stat-number"><?php echo $stats['pending_requests']; ?></div>
                    <p>Awaiting approval</p>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="openModal('addItemModal')">
                    <i class="fas fa-plus"></i> Add New Item
                </button>
                <button class="btn btn-outline" onclick="openModal('borrowItemModal')">
                    <i class="fas fa-plus"></i> Borrow Item
                </button>
                <button class="btn btn-outline" onclick="openModal('reportModal')">
                    <i class="fas fa-file-alt"></i> Generate Report
                </button>
            </div>

            <!-- Recent Activities -->
            <div class="card">
                <div class="card-header">
                    <h2>Recent Activities</h2>
                    <p>Latest actions in the system</p>
                </div>
                <div class="card-content">
                    <?php foreach ($recentActivities as $activity): ?>
                    <div class="activity-item">
                        <div class="activity-info">
                            <p class="activity-action"><?php echo htmlspecialchars($activity['action']); ?></p>
                            <p class="activity-details">
                                <?php echo htmlspecialchars($activity['item']); ?> • 
                                <?php echo htmlspecialchars($activity['department']); ?> • 
                                <?php echo htmlspecialchars($activity['user']); ?>
                            </p>
                        </div>
                        <span class="activity-time"><?php echo $activity['time']; ?></span>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Items Tabs -->
            <div class="tabs">
                <div class="tab-list">
                    <button class="tab-trigger active" data-tab="available">Available Items</button>
                    <button class="tab-trigger" data-tab="borrowed">Borrowed Items</button>
                    <button class="tab-trigger" data-tab="pending">Pending Requests</button>
                </div>

                <div class="tab-content active" id="available">
                    <div id="availableItemsTable"></div>
                </div>

                <div class="tab-content" id="borrowed">
                    <div id="borrowedItemsTable"></div>
                </div>

                <div class="tab-content" id="pending">
                    <div id="pendingItemsTable"></div>
                </div>
            </div>
        </main>
    </div>

    <!-- Modals -->
    <?php include 'includes/modals.php'; ?>

    <script src="assets/js/main.js"></script>
</body>
</html>
