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
const ref = db.ref("users/");

ref.once("value", (snapshot) => {
  const userData = snapshot.val();
  if (userData) {
    Object.keys(userData).forEach((userId) => {
      const user = userData[userId];
      if (user && user.info && user.info.firstName) {
        console.log(`User ID: ${userId}, firstName: ${user.info.firstName}`);
      }
    });
  } else {
    console.log("No user data found.");
  }

  admin.app().delete();
});

app.get("/", (req, res) => {
  res.send("Hello.. Anyone? boo");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
