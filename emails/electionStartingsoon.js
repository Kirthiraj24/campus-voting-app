module.exports = ({ electionTitle, startTime }) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f8fafc;
      padding: 20px;
    }
    .card {
      max-width: 520px;
      margin: auto;
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    }
    h2 {
      color: #d97706;
      margin-bottom: 10px;
    }
    .info {
      background: #fff7ed;
      padding: 12px;
      border-radius: 8px;
      margin: 16px 0;
      font-weight: 600;
    }
    .footer {
      margin-top: 24px;
      font-size: 13px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>

  <div class="card">
    <h2>⏳ Election Starting Soon</h2>

    <p>
      This is a reminder that the election
      <strong>${electionTitle}</strong>
      will start in <strong>5 minutes</strong>.
    </p>

    <div class="info">
      🗳️ Start Time: ${startTime}
    </div>

    <p>Please be ready to cast your vote on time.</p>

    <div class="footer">
      Campus Voting System<br>
      This is an automated notification
    </div>
  </div>

</body>
</html>
`;
