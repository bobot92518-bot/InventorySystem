<?php
function getDashboardStats($pdo) {
    // Mock data for now - replace with actual database queries
    return [
        'total_items' => 1245,
        'available_items' => 876,
        'borrowed_items' => 369,
        'pending_requests' => 42
    ];
}

function getRecentActivities($pdo) {
    // Mock data for now - replace with actual database queries
    return [
        [
            'id' => 1,
            'action' => 'Item Borrowed',
            'item' => 'Projector',
            'user' => 'John Doe',
            'department' => 'Science',
            'time' => '2 hours ago'
        ],
        [
            'id' => 2,
            'action' => 'Item Returned',
            'item' => 'Laptop',
            'user' => 'Jane Smith',
            'department' => 'Math',
            'time' => '5 hours ago'
        ],
        [
            'id' => 3,
            'action' => 'New Item Added',
            'item' => 'Microscope',
            'user' => 'Admin',
            'department' => 'Science',
            'time' => '1 day ago'
        ],
        [
            'id' => 4,
            'action' => 'Request Approved',
            'item' => 'Tablet',
            'user' => 'Mike Johnson',
            'department' => 'English',
            'time' => '1 day ago'
        ]
    ];
}

function getItems($pdo, $type = 'available') {
    // Mock data for now - replace with actual database queries
    $items = [
        [
            'id' => 'IT001',
            'name' => 'Dell Laptop XPS 15',
            'department' => 'IT',
            'status' => 'available',
            'category' => 'Electronics',
            'quantity' => 5
        ],
        [
            'id' => 'IT002',
            'name' => 'HP Printer LaserJet Pro',
            'department' => 'IT',
            'status' => 'borrowed',
            'borrower' => 'John Doe',
            'borrowDate' => '2023-05-10',
            'returnDate' => '2023-05-20',
            'category' => 'Electronics',
            'quantity' => 2
        ],
        [
            'id' => 'SCI001',
            'name' => 'Microscope Set',
            'department' => 'Science',
            'status' => 'available',
            'category' => 'Lab Equipment',
            'quantity' => 10
        ],
        [
            'id' => 'SCI002',
            'name' => 'Chemistry Lab Kit',
            'department' => 'Science',
            'status' => 'pending',
            'borrower' => 'Jane Smith',
            'category' => 'Lab Equipment',
            'quantity' => 3
        ]
    ];
    
    return array_filter($items, function($item) use ($type) {
        return $item['status'] === $type;
    });
}
?>
