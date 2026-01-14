module.exports = ({ electionTitle, endTime }) => `
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
      color: #16a34a;
    }
    .info {
      background: #ecfeff;
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
    <h2>🟢 Election Has Started</h2>

    <p>
      The election <strong>${electionTitle}</strong> is now live.
    </p>

    <div class="info">
      ⏰ Voting Ends At: ${endTime}
    </div>

    <p>
      Please log in to the Campus Voting App and cast your vote before the deadline.
    </p>

    <div class="footer">
      Campus Voting System<br>
      Vote responsibly
    </div>
  </div>

</body>
</html>
`;
