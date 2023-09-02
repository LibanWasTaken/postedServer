const express = require("express");
const admin = require("firebase-admin");
const schedule = require("node-schedule");

const app = express();
const port = process.env.PORT || 3001;

const currentDateInUTC = new Date().toUTCString();
console.log(currentDateInUTC);

const serviceAccount = require("./posted-1413e-firebase-adminsdk-2g2ut-308e868f58.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://posted-1413e-default-rtdb.firebaseio.com",
});

const db = admin.database();
const ref = db.ref("users/unposted");

function addUserToPosted(user) {
  const refToUpdate = db.ref("users/posted/");
  // add the current time to the info (utc)
  // sendMail(user.emailsTo) -> array?
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

/**
DB:

users:
    unposted:
        asd4a65s4d6a5s4d6:
            userID
            letter
            diary
        g5sd4a5sda4sda4sd:
            userID
            letter
    posted: (/others)
        g5sd4a5sda4sda4sd:
            userID
            letter
            new -> posted time

 */

ref.once("value", (snapshot) => {
  const userData = snapshot.val();
  if (userData) {
    Object.keys(userData).forEach((userId) => {
      const user = userData[userId];
      if (user && user.info && user.info.firstName) {
        console.log(`User ID: ${userId}, firstName: ${user.info.firstName}`);
        // addUserToPosted(userData); // ✅
      }
    });
    // deleteUser("testID"); // ✅
  } else {
    console.log("No user data found.");
  }

  admin.app().delete();
});

app.get("/", (req, res) => {
  res.send("Server is running on port 3001");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
