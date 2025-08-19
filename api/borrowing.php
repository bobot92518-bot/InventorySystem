<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        handleGetBorrowingRecords();
        break;
    case 'POST':
        if (isset($_GET['action']) && $_GET['action'] === 'return') {
            handleReturnItem($input);
        } else {
            handleBorrowRequest($input);
        }
        break;
    case 'PUT':
        handleUpdateBorrowingStatus($input);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGetBorrowingRecords() {
    global $pdo;
    
    $status = $_GET['status'] ?? 'all';
    $department = $_GET['department'] ?? '';
    
    $sql = "SELECT b.*, i.name as item_name, i.category, i.department 
            FROM borrowing_records b 
            JOIN items i ON b.item_id = i.id 
            WHERE 1=1";
    $params = [];
    
    if ($status !== 'all') {
        $sql .= " AND b.status = ?";
        $params[] = $status;
    }
    
    if ($department) {
        $sql .= " AND b.department = ?";
        $params[] = $department;
    }
    
    $sql .= " ORDER BY b.created_at DESC";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $records = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $records
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
}

function handleBorrowRequest($data) {
    global $pdo;
    
    $required = ['itemId', 'quantity', 'purpose', 'returnDate', 'department'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => "Field '$field' is required"
            ]);
            return;
        }
    }
    
    try {
        $pdo->beginTransaction();
        
        // Check item availability
        $stmt = $pdo->prepare("SELECT quantity, status FROM items WHERE id = ?");
        $stmt->execute([$data['itemId']]);
        $item = $stmt->fetch();
        
        if (!$item) {
            throw new Exception('Item not found');
        }
        
        if ($item['status'] !== 'available') {
            throw new Exception('Item is not available for borrowing');
        }
        
        if ($item['quantity'] < $data['quantity']) {
            throw new Exception('Insufficient quantity available');
        }
        
        // Create borrowing record
        $sql = "INSERT INTO borrowing_records (item_id, borrower_name, borrower_email, 
                quantity, purpose, expected_return_date, department, status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['itemId'],
            $data['borrowerName'] ?? 'Unknown',
            $data['borrowerEmail'] ?? '',
            $data['quantity'],
            $data['purpose'],
            $data['returnDate'],
            $data['department']
        ]);
        
        $borrowingId = $pdo->lastInsertId();
        
        // Update item quantity
        $newQuantity = $item['quantity'] - $data['quantity'];
        $newStatus = $newQuantity > 0 ? 'available' : 'borrowed';
        
        $stmt = $pdo->prepare("UPDATE items SET quantity = ?, status = ? WHERE id = ?");
        $stmt->execute([$newQuantity, $newStatus, $data['itemId']]);
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Borrowing request submitted successfully',
            'borrowing_id' => $borrowingId
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

function handleReturnItem($data) {
    global $pdo;
    
    $required = ['itemId', 'condition'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => "Field '$field' is required"
            ]);
            return;
        }
    }
    
    try {
        $pdo->beginTransaction();
        
        // Find active borrowing record
        $stmt = $pdo->prepare("SELECT * FROM borrowing_records 
                              WHERE item_id = ? AND status = 'approved' 
                              ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([$data['itemId']]);
        $borrowingRecord = $stmt->fetch();
        
        if (!$borrowingRecord) {
            throw new Exception('No active borrowing record found for this item');
        }
        
        // Update borrowing record
        $stmt = $pdo->prepare("UPDATE borrowing_records 
                              SET status = 'returned', return_date = NOW(), 
                                  return_condition = ?, updated_at = NOW() 
                              WHERE id = ?");
        $stmt->execute([$data['condition'], $borrowingRecord['id']]);
        
        // Update item quantity and status
        $stmt = $pdo->prepare("SELECT quantity FROM items WHERE id = ?");
        $stmt->execute([$data['itemId']]);
        $item = $stmt->fetch();
        
        $newQuantity = $item['quantity'] + $borrowingRecord['quantity'];
        $newStatus = 'available';
        
        $stmt = $pdo->prepare("UPDATE items SET quantity = ?, status = ? WHERE id = ?");
        $stmt->execute([$newQuantity, $newStatus, $data['itemId']]);
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Item returned successfully'
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}

function handleUpdateBorrowingStatus($data) {
    global $pdo;
    
    $borrowingId = $_GET['id'] ?? null;
    $action = $data['action'] ?? null;
    
    if (!$borrowingId || !$action) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Borrowing ID and action are required'
        ]);
        return;
    }
    
    $validActions = ['approve', 'reject'];
    if (!in_array($action, $validActions)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid action'
        ]);
        return;
    }
    
    try {
        $newStatus = $action === 'approve' ? 'approved' : 'rejected';
        
        $stmt = $pdo->prepare("UPDATE borrowing_records 
                              SET status = ?, updated_at = NOW() 
                              WHERE id = ?");
        $stmt->execute([$newStatus, $borrowingId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Borrowing request ' . $action . 'd successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
}
?>
