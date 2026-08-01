<?php
// upload.php - Place this on your Hostinger server (e.g. in public_html/api/upload.php)

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow Netlify to access
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// =========================================================================
// CONFIGURATION : REMPLACEZ CECI PAR UN MOT DE PASSE SECRET LONG ET COMPLEXE
// =========================================================================
$SECRET_KEY = 'VOTRE_MOT_DE_PASSE_SECRET_ICI'; 
$UPLOAD_DIR = __DIR__ . '/uploads/'; // Dossier où les images seront sauvegardées
// Le dossier 'uploads' sera créé automatiquement dans le même dossier que ce fichier.

// Vérification de la méthode
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit();
}

// Vérification de la clé secrète
$provided_secret = $_POST['secret'] ?? '';
if ($provided_secret !== $SECRET_KEY) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized: Invalid secret key']);
    exit();
}

// Vérification du fichier
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded or upload error']);
    exit();
}

$file = $_FILES['file'];
$file_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// Liste des extensions autorisées
$allowed_extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
if (!in_array($file_ext, $allowed_extensions)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file extension']);
    exit();
}

// Création du dossier d'upload s'il n'existe pas
if (!is_dir($UPLOAD_DIR)) {
    mkdir($UPLOAD_DIR, 0755, true);
}

// Nom unique pour le fichier
$new_filename = uniqid('img_') . '.' . $file_ext;
$target_path = $UPLOAD_DIR . $new_filename;

// Déplacement du fichier
if (move_uploaded_file($file['tmp_name'], $target_path)) {
    // Déduction de l'URL publique
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $path = str_replace($_SERVER['DOCUMENT_ROOT'], '', $target_path);
    // Assurer que le chemin utilise des slashes normaux
    $path = str_replace('\\', '/', $path);
    
    $public_url = $protocol . '://' . $host . $path;
    
    echo json_encode(['success' => true, 'url' => $public_url]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
}
