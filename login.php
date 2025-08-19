<?php
session_start();
require_once __DIR__ . '/config/database.php';

$error = '';
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Replace with your actual user table and password check
    $stmt = $pdo->prepare('SELECT id, username, password FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        header('Location: index.php');
        exit();
    } else {
        $error = 'Invalid username or password.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Futuristic Login</title>
  <link href="./assets/css/style.css" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      background: #f7fafc;
      min-height: 100vh;
    }
  </style>
</head>
<body class="flex items-center justify-center min-h-screen">
  <form id="loginForm" class="bg-white p-8 w-full max-w-sm flex flex-col gap-6 rounded-xl shadow-md border border-gray-100 opacity-0 scale-95 transition-all duration-700" method="post" action="login.php">
    <h2 class="text-2xl font-semibold text-center text-gray-800 mb-2">Sign in</h2>
    <?php if ($error): ?>
      <div class="bg-red-100 text-red-700 rounded p-2 text-center mb-2 animate-fade-in"><?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>
    <input type="text" name="username" placeholder="Username" required class="px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
    <input type="password" name="password" placeholder="Password" required class="px-4 py-3 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300" />
    <button type="submit" id="loginBtn" class="mt-2 py-3 rounded-lg bg-cyan-600 text-white font-medium text-base tracking-wide hover:bg-cyan-700 transition-all duration-200">Sign In</button>
    <div class="flex justify-between text-xs text-gray-400 mt-2">
      <a href="#" class="hover:underline">Forgot password?</a>
      <a href="#" class="hover:underline">Create account</a>
    </div>
  </form>
  <script>
    // Animate form entrance
    window.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('loginForm');
      setTimeout(() => {
        form.classList.remove('opacity-0', 'scale-95');
        form.classList.add('opacity-100', 'scale-100');
      }, 150);
    });
  </script>
</body>
</html>
