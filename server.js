const express = require("express");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const { EMAIL_ADDRESS, EMAIL_PASS } = require("./env");

// import * as constants from "./constants";
const SERVICE_ACCOUNT_JSON =
  "./posted-1413e-firebase-adminsdk-2g2ut-308e868f58.json";
const DATABASE_URL = "https://posted-1413e-default-rtdb.firebaseio.com";

const app = express();
const port = process.env.PORT || 3001;

const currentDateInUTC = new Date().toUTCString();
console.log(currentDateInUTC);

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_ADDRESS,
    pass: EMAIL_PASS,
  },
});

// Function to send an email
function sendEmail() {
  const mailOptions = {
    from: EMAIL_ADDRESS,
    to: "libanmesbah@gmail.com",
    subject: "Daily Email",
    text: "This is the email content, lesgo.",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

transporter.verify(function (error, success) {
  if (error) {
    console.log("🔴", error);
  } else {
    console.log("🟢", "Server is ready to take our messages");
  }
});

const job = schedule.scheduleJob("1 0 * * *", () => {
  sendEmail();
});

// const serviceAccount = require(SERVICE_ACCOUNT_JSON);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: DATABASE_URL,
// });

// const db = admin.database();
// const ref = db.ref("users/unposted");

function updatePostDB(postID, userID) {
  /*
  -> add post to posted, with same id + add the timestamp
  -> remove post from posts
  -> add posted ref or id to users>usersID>posted=[postedRef/Id]  

  sendPostMail(postID)?
  */
}

function sendDelayMail(userInfo) {
  /**
   users posts date - 1 week/3 days = send mail

   get usersInfo.ownMail
   */

  console.log(EMAIL_ADDRESS);
}

function sendPostMail(postIDs) {
  /**
   if todayDate = postID>release date
    -> postID>userRef = const userID
    -> get users>id>ownMail + [mails]
    -> [mails].map(()=> sendMail to em)
   
   */

  console.log(EMAIL_ADDRESS);
}

function addUserToPosted(user) {
  const refToUpdate = db.ref("users/posted/");
  // add the current time (utc)
  const now = new Date();

  const utcTimeObject = {
    Year: now.getUTCFullYear(),
    Month: String(now.getUTCMonth() + 1).padStart(2, "0"), // Month is zero-based
    Date: String(now.getUTCDate()).padStart(2, "0"),
    Hour: String(now.getUTCHours()).padStart(2, "0"),
    Minute: String(now.getUTCMinutes()).padStart(2, "0"),
    Second: String(now.getUTCSeconds()).padStart(2, "0"),
    Millisecond: String(now.getUTCMilliseconds()).padStart(3, "0"),
  };

  console.log(utcTimeObject);

  refToUpdate
    .update(user)
    .then(() => {
      console.log("Data updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating data:", error);
    });
}

function deleteUser(uid) {
  const refToDelete = db.ref("users/unposted/" + uid);
  refToDelete
    .remove()
    .then(() => {
      console.log("Data deleted successfully.");
    })
    .catch((error) => {
      console.error("Error deleting data:", error);
    });
}

// function checkDesiredDate() {
//     const currentDate = new Date();
//     const desiredDate = new Date('2023-05-15T00:00:00Z');

//     if (currentDate >= desiredDate) {
//       console.log('Desired date reached. Executing your function...');
//       // yourCustomFunction();
//     } else {
//       console.log('Waiting for the desired date...');
//     }
//   }

// const dailySchedule = schedule.scheduleJob('0 0 * * *', checkDesiredDate);

// ref.once("value", (snapshot) => {
//   const userData = snapshot.val();
//   if (userData) {
//     Object.keys(userData).forEach((userId) => {
//       const user = userData[userId];
//       if (user && user.info && user.info.firstName) {
//         console.log(`User ID: ${userId}, firstName: ${user.info.firstName}`);
//         // addUserToPosted(userData); // ✅

//         // -> updatePostDB(postID, userID?)
//       }
//     });
//     // deleteUser("testID"); // ✅
//   } else {
//     console.log("No user data found.");
//   }

//   admin.app().delete();
// });

app.get("/", (req, res) => {
  res.send("Server is running on port 3001");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*

https://geshan.com.np/blog/2021/01/free-nodejs-hosting/
https://console.cloud.google.com/appengine/cronjobs?project=posted-1413e
https://glitch.com/edit/#!/first-spiced-gas?path=server.js%3A1%3A0
https://www.digitalocean.com/community/tutorials/nodejs-cron-jobs-by-examples
https://cron-job.org/en/
https://reflectoring.io/schedule-cron-job-in-node/

node-cron, node-schedule

https://www.youtube.com/watch?v=27GoRa4d15c

*/
