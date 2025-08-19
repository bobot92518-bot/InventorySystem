-- School Property Management System Database Schema

CREATE DATABASE IF NOT EXISTS school_property_management;
USE school_property_management;

-- Items table
CREATE TABLE items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    status ENUM('available', 'borrowed', 'maintenance', 'unavailable') DEFAULT 'available',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_department (department),
    INDEX idx_category (category)
);

-- Borrowing records table
CREATE TABLE borrowing_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id VARCHAR(50) NOT NULL,
    borrower_name VARCHAR(255) NOT NULL,
    borrower_email VARCHAR(255),
    quantity INT NOT NULL DEFAULT 1,
    purpose TEXT NOT NULL,
    expected_return_date DATE NOT NULL,
    actual_return_date DATE NULL,
    department VARCHAR(100) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'returned') DEFAULT 'pending',
    return_condition TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_department (department),
    INDEX idx_borrower (borrower_email)
);

-- Activity logs table
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    item_id VARCHAR(50),
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    department VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE SET NULL,
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- Users table (for authentication)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'teacher') DEFAULT 'teacher',
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Departments table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    head_of_department VARCHAR(255),
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data

-- Sample departments
INSERT INTO departments (name, description) VALUES
('IT Department', 'Information Technology and Computer Services'),
('Science Department', 'Physics, Chemistry, Biology laboratories'),
('Math Department', 'Mathematics and Statistics'),
('English Department', 'Language Arts and Literature'),
('Arts Department', 'Visual and Performing Arts'),
('Sports Department', 'Physical Education and Athletics'),
('Library', 'Library and Information Services'),
('Administration', 'Administrative Offices');

-- Sample categories
INSERT INTO categories (name, description) VALUES
('Electronics', 'Computers, tablets, projectors, and electronic devices'),
('Furniture', 'Desks, chairs, cabinets, and office furniture'),
('Books', 'Textbooks, reference materials, and educational resources'),
('Sports Equipment', 'Athletic equipment and sports gear'),
('Lab Equipment', 'Scientific instruments and laboratory tools'),
('Art Supplies', 'Paints, brushes, canvases, and art materials'),
('Instruments', 'Musical instruments and audio equipment'),
('Other', 'Miscellaneous items and supplies');

-- Sample admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role, department) VALUES
('Admin User', 'admin@school.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administration');

-- Sample items
INSERT INTO items (id, name, description, category, department, quantity, status) VALUES
('IT001', 'Dell Laptop XPS 15', 'High-performance laptop for programming and design work', 'Electronics', 'IT Department', 5, 'available'),
('IT002', 'HP Printer LaserJet Pro', 'Black and white laser printer for office use', 'Electronics', 'IT Department', 2, 'available'),
('IT003', 'Epson Projector', 'HD projector for presentations and classroom use', 'Electronics', 'IT Department', 3, 'available'),
('SCI001', 'Microscope Set', 'Digital microscope with camera for biology classes', 'Lab Equipment', 'Science Department', 10, 'available'),
('SCI002', 'Chemistry Lab Kit', 'Complete chemistry experiment kit with safety equipment', 'Lab Equipment', 'Science Department', 5, 'available'),
('SCI003', 'Physics Demonstration Kit', 'Physics experiments and demonstration tools', 'Lab Equipment', 'Science Department', 3, 'available'),
('LIB001', 'History Textbooks', 'World History textbook set for grades 9-12', 'Books', 'Library', 25, 'available'),
('LIB002', 'Literature Collection', 'Classic literature books for English classes', 'Books', 'Library', 30, 'available'),
('SPT001', 'Basketball Set', 'Official basketballs and equipment', 'Sports Equipment', 'Sports Department', 8, 'available'),
('SPT002', 'Soccer Balls', 'FIFA approved soccer balls', 'Sports Equipment', 'Sports Department', 12, 'available'),
('ART001', 'Paint Supplies', 'Acrylic paints, brushes, and canvases', 'Art Supplies', 'Arts Department', 20, 'available'),
('ART002', 'Drawing Tablets', 'Digital drawing tablets for graphic design', 'Electronics', 'Arts Department', 5, 'available'),
('MUS001', 'Acoustic Guitars', 'Student acoustic guitars for music classes', 'Instruments', 'Arts Department', 7, 'available'),
('MUS002', 'Digital Piano', 'Electronic piano with weighted keys', 'Instruments', 'Arts Department', 2, 'available'),
('ADM001', 'Office Chairs', 'Ergonomic office chairs for staff', 'Furniture', 'Administration', 15, 'available');

-- Sample borrowing records
INSERT INTO borrowing_records (item_id, borrower_name, borrower_email, quantity, purpose, expected_return_date, department, status) VALUES
('IT002', 'John Doe', 'john.doe@school.edu', 1, 'Printing course materials for Math class', '2024-01-20', 'Math Department', 'approved'),
('SCI002', 'Jane Smith', 'jane.smith@school.edu', 1, 'Chemistry experiments for advanced students', '2024-01-25', 'Science Department', 'pending'),
('LIB002', 'Mark Johnson', 'mark.johnson@school.edu', 5, 'Literature study for English honors class', '2024-02-05', 'English Department', 'approved'),
('ART001', 'Lisa Wong', 'lisa.wong@school.edu', 3, 'Art project for senior exhibition', '2024-01-19', 'Arts Department', 'approved'),
('ART002', 'David Chen', 'david.chen@school.edu', 2, 'Digital art workshop for students', '2024-01-30', 'Arts Department', 'pending'),
('MUS002', 'Sarah Miller', 'sarah.miller@school.edu', 1, 'Music recital preparation', '2024-01-30', 'Arts Department', 'approved');

-- Sample activity logs
INSERT INTO activity_logs (action, item_id, user_name, user_email, department, details) VALUES
('Item Borrowed', 'IT003', 'John Doe', 'john.doe@school.edu', 'Science Department', 'Projector borrowed for science presentation'),
('Item Returned', 'IT001', 'Jane Smith', 'jane.smith@school.edu', 'Math Department', 'Laptop returned in good condition'),
('New Item Added', 'SCI001', 'Admin User', 'admin@school.edu', 'Science Department', 'New microscope set added to inventory'),
('Request Approved', 'SPT002', 'Mike Johnson', 'mike.johnson@school.edu', 'English Department', 'Soccer ball request approved for PE class'),
('Item Updated', 'LIB001', 'Admin User', 'admin@school.edu', 'Library', 'Updated quantity of history textbooks'),
('Request Rejected', 'MUS001', 'Tom Wilson', 'tom.wilson@school.edu', 'Math Department', 'Guitar request rejected - not relevant to department');
