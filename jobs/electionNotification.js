const cron = require("node-cron");
const db = require("../config/db");
const nodemailer = require("nodemailer");

// mail transporter (reuse same env vars)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// helper: get all registered users
function getAllUsers(cb) {
  db.query("SELECT email FROM users", (err, users) => {
    if (err) return cb([]);
    cb(users.map(u => u.email));
  });
}

// helper: send mail
function sendMail(to, subject, html) {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  });
}

/* ===============================
   CRON JOB – RUNS EVERY MINUTE
================================= */
cron.schedule("* * * * *", () => {
  const now = new Date();

  // get all elections
  db.query("SELECT * FROM elections", (err, elections) => {
    if (err) return;

    elections.forEach(election => {
      const start = new Date(election.start_time);
      const end = new Date(election.end_time);

      const diffToStart = start - now;
      const diffToEnd = end - now;

      /* ===============================
         1️⃣ Starts in 5 minutes
      ================================ */
      if (
        diffToStart <= 5 * 60 * 1000 &&
        diffToStart > 4 * 60 * 1000 &&
        !election.start_notified
      ) {
        getAllUsers(users => {
          users.forEach(email => {
            sendMail(
              email,
              `⏰ Election Starting Soon: ${election.title}`,
              `
              <h2>${election.title}</h2>
              <p>The election will start in <b>5 minutes</b>.</p>
              <p>Please be ready to cast your vote.</p>
              `
            );
          });

          db.query(
            "UPDATE elections SET start_notified = 1 WHERE id = ?",
            [election.id]
          );
        });
      }

      /* ===============================
         2️⃣ Election Started
      ================================ */
      if (
        now >= start &&
        now <= start.getTime() + 60 * 1000 &&
        !election.started_notified
      ) {
        getAllUsers(users => {
          users.forEach(email => {
            sendMail(
              email,
              `🟢 Election Started: ${election.title}`,
              `
              <h2>${election.title}</h2>
              <p>The election has <b>started</b>.</p>
              <p>You can now log in and vote.</p>
              `
            );
          });

          db.query(
            "UPDATE elections SET started_notified = 1 WHERE id = ?",
            [election.id]
          );
        });
      }

      /* ===============================
         3️⃣ Election Ended + Results
      ================================ */
      if (diffToEnd <= 0 && !election.ended_notified) {
        db.query(
          `
          SELECT c.name, COUNT(v.id) AS votes
          FROM candidates c
          LEFT JOIN votes v ON v.candidate_id = c.id
          WHERE c.election_id = ?
          GROUP BY c.id
          ORDER BY votes DESC
          `,
          [election.id],
          (err, results) => {
            if (err || !results.length) return;

            const winner = results[0];

            let resultHtml = `
              <h2>${election.title} – Results</h2>
              <p><b>Winner:</b> ${winner.name} (${winner.votes} votes)</p>
              <hr/>
              <ul>
            `;

            results.forEach(r => {
              resultHtml += `<li>${r.name}: ${r.votes} votes</li>`;
            });

            resultHtml += "</ul>";

            getAllUsers(users => {
              users.forEach(email => {
                sendMail(
                  email,
                  `🏁 Election Results: ${election.title}`,
                  resultHtml
                );
              });

              db.query(
                "UPDATE elections SET ended_notified = 1 WHERE id = ?",
                [election.id]
              );
            });
          }
        );
      }
    });
  });
});
