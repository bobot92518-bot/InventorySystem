<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        handleGetItems();
        break;
    case 'POST':
        handleCreateItem($input);
        break;
    case 'PUT':
        handleUpdateItem($input);
        break;
    case 'DELETE':
        handleDeleteItem();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGetItems() {
    global $pdo;
    
    $type = $_GET['type'] ?? 'all';
    $department = $_GET['department'] ?? '';
    $search = $_GET['search'] ?? '';
    
    $sql = "SELECT * FROM items WHERE 1=1";
    $params = [];
    
    if ($type !== 'all') {
        $sql .= " AND status = ?";
        $params[] = $type;
    }
    
    if ($department) {
        $sql .= " AND department = ?";
        $params[] = $department;
    }
    
    if ($search) {
        $sql .= " AND (name LIKE ? OR id LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $items = $stmt->fetchAll();
        
        echo json_encode([
            'success' => true,
            'data' => $items
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
}

function handleCreateItem($data) {
    global $pdo;
    
    $required = ['name', 'category', 'department', 'quantity'];
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
    
    $sql = "INSERT INTO items (id, name, description, category, department, quantity, status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())";
    
    $itemId = generateItemId($data['department']);
    $status = isset($data['available']) && $data['available'] ? 'available' : 'unavailable';
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $itemId,
            $data['name'],
            $data['description'] ?? '',
            $data['category'],
            $data['department'],
            $data['quantity'],
            $status
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Item created successfully',
            'item_id' => $itemId
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
}

function handleUpdateItem($data) {
    global $pdo;
    
    $itemId = $_GET['id'] ?? null;
    if (!$itemId) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Item ID is required'
        ]);
        return;
    }
    
    $sql = "UPDATE items SET name = ?, description = ?, category = ?, 
            department = ?, quantity = ?, status = ?, updated_at = NOW() 
            WHERE id = ?";
    
    $status = isset($data['available']) && $data['available'] ? 'available' : 'unavailable';
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['description'] ?? '',
            $data['category'],
            $data['department'],
            $data['quantity'],
            $status,
            $itemId
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Item updated successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
}

function handleDeleteItem() {
    global $pdo;
    
    $itemId = $_GET['id'] ?? null;
    if (!$itemId) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Item ID is required'
        ]);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM items WHERE id = ?");
        $stmt->execute([$itemId]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Item deleted successfully'
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
}

function generateItemId($department) {
    $prefix = strtoupper(substr($department, 0, 3));
    $timestamp = time();
    $random = rand(100, 999);
    return $prefix . $timestamp . $random;
}
?>
