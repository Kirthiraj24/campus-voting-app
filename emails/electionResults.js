module.exports = ({ electionTitle, results }) => {
  const rows = results.map(
    r => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb">${r.name}</td>
        <td style="padding:8px;border-bottom:1px solid #e5e7eb">${r.votes}</td>
      </tr>
    `
  ).join("");

  const winner = results[0];

  return `
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
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
    }
    h2 {
      color: #1d4ed8;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    th {
      text-align: left;
      padding: 8px;
      background: #f1f5f9;
    }
    .winner {
      background: #dcfce7;
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
    <h2>🏁 Election Results Declared</h2>

    <p>
      The election <strong>${electionTitle}</strong> has officially concluded.
    </p>

    <div class="winner">
      🏆 Winner: ${winner.name} (${winner.votes} votes)
    </div>

    <table>
      <tr>
        <th>Candidate</th>
        <th>Votes</th>
      </tr>
      ${rows}
    </table>

    <div class="footer">
      Campus Voting System<br>
      Thank you for participating
    </div>
  </div>

</body>
</html>
`;
};
