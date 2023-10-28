const express = require("express");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const serviceAccount = require("./posted-1413e-firebase-adminsdk-2g2ut-308e868f58.json");
const { EMAIL_ADDRESS, EMAIL_PASS } = require("./env");

// dayjs
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);

const app = express();
const port = process.env.PORT || 3001;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Single Doc info
function getPostInfo(postID) {
  const docRef = db.collection("posts").doc(postID);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const releaseDate = dayjs(data.releaseDate);
        console.log("Document data:", data);
        console.log("Deserialized releaseDate:", releaseDate);
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

// Collection info
function getPostCollection() {
  const collectionRef = db.collection("posts");
  collectionRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        console.log("");
        console.log(doc.id);
        console.log("user:", postData.user);
        console.log("title:", postData.title, "date:", postData.releaseDate);

        const emailArray = [];
        true && emailArray.push("blabla@gmail.com"); //postData.email
        postData.mail1 && emailArray.push(postData.mail1);
        postData.mail2 && emailArray.push(postData.mail2);
        const concatenatedEmails = emailArray.join(", ");
        console.log("mails:", concatenatedEmails);

        if (postData.disabled) {
          console.log("❌ Disabled");
        } else {
          // Checking Date
          const currentDateUTC = dayjs().utc();
          const date = dayjs(postData.releaseDate).utc();

          console.log(
            dayjs(postData.releaseDate).utc().format("DD/MM/YYYY HH:mm:ss")
          );
          console.log(
            dayjs(postData.timestamp).utc().format("DD/MM/YYYY HH:mm:ss")
          );
          if (currentDateUTC.isSameOrAfter(date)) {
            console.log(
              "✅ currentDateUTC",
              currentDateUTC.format("DD-MM-YY HH:mm:ss"),
              "equal/after",
              date.format("DD-MM-YY HH:mm:ss")
            );
            // const emailArray = [];
            // if (true) {
            //   //postData.email
            //   emailArray.push("blabla@gmail.com");
            // }
            // if (postData.mail1) {
            //   emailArray.push(postData.mail1);
            // }
            // if (postData.mail2) {
            //   emailArray.push(postData.mail2);
            // }
            // const concatenatedEmails = emailArray.join(", ");

            // console.log(concatenatedEmails);
          } else {
            console.log(
              "❌ currentDateUTC",
              currentDateUTC.format(),
              "before",
              date.format("DD-MM-YY HH:mm:ss")
            );
          }
        }
      });
    })
    .catch((error) => {
      console.log("Error getting documents:", error);
    });
}

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

const transporterTest = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "audra.purdy@ethereal.email",
    pass: "q1JaYNUA9YxDK3GZBg",
  },
});

// Function to send an email
function sendEmailAnnoying(count) {
  const mailOptions = {
    from: EMAIL_ADDRESS,
    to: "galang1721@gmail.com",
    subject: "distracting from ur webinar",
    text: "bozo ${count}",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", count);
    }
  });
}
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
function sendEmailTest() {
  const mailOptions = {
    from: EMAIL_ADDRESS,
    to: "audra.purdy@ethereal.email",
    subject: "Daily Email",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Missed Scheduled Postponement</title>
        <style>
            /* Add your CSS styles here */
            div {
                margin: 1rem;
                font-style: italic;
                margin-right: 1rem;
                padding: 1rem;
                border-left: 5px solid #ccc;
            }
            button {
                background: black;
                padding: 1rem 1.5rem;
                color: white;
                border: none;
                outline: none;
                letter-spacing: 2px;
                text-transform: uppercase;
                margin-top: 2rem;
            }
        </style>
    </head>
    <body>
        <p>Hello,</p>
        <br />
        <p>This automated email has been configured by <strong>Liban</strong> to be dispatched in the event of a missed scheduled postponement.</p>
        <br />
        <p>Referring to the message below:</p>
        <div>Yeah Hello it is I</div>
        <br />
        <p>Find the rest here:</p>
        <button>Posted</button>
    </body>
    </html>
`,
  };

  transporterTest.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log("🔴", error);
//   } else {
//     console.log("🟢", "Server is ready for mails");
//     sendEmailTest();
//   }
// });

const job = schedule.scheduleJob("1 0 * * *", () => {
  // sendEmail();
  // console.log("mail func running");
});

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

function movePostToPosted(post) {
  // Add post to posted
  // Remove post from posts
  // Add posted arr with post if in user
}

// async function movePostToPosted(postID) {
//   const sourceDocRef = db.collection("posts").doc(postID);
//   const targetCollectionRef = collection(db, "posted");
//   try {
//     const sourceDocSnapshot = await getDoc(sourceDocRef);
//     if (sourceDocSnapshot.exists()) {
//       // Copy the data
//       const data = sourceDocSnapshot.data();

//       // Add the copied data to the target collection
//       const targetDocRef = await addDoc(targetCollectionRef, data);

//       // Delete the document from the source collection
//       await deleteDoc(sourceDocRef);

//       console.log(`Document moved ${postID}- ${targetDocRef.id}`);
//     } else {
//       console.log(`Document ${postID} not found in`);
//     }
//   } catch (error) {
//     console.error("Error moving document:", error);
//   }
// }

async function movePostToPosted(postID) {
  const sourceDocRef = db.collection("posts").doc(postID);
  const targetDocRef = db.collection("posted").doc(postID);

  try {
    console.log("Starting");
    const sourceDocSnapshot = await sourceDocRef.get();

    if (sourceDocSnapshot.exists) {
      const data = sourceDocSnapshot.data();

      await targetDocRef.set(data);
      console.log("Copied Post");
      await sourceDocRef.delete();
      console.log("Deleted Post");

      console.log(
        `Document moved from "posts/${postID}" to "posted/${postID}"`
      );
    } else {
      console.log(`Document with ID ${postID} not found in "posts"`);
    }
  } catch (error) {
    console.error("Error moving document:", error);
  }
}

function recordMailInfo(mailID) {}

// ======================== Run here:

// getPostInfo("R9VTuJl0hEmJXgl4YrPs")
// getPostCollection();
movePostToPosted("test");

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
https://reflectoring.io/schedule-cron-job-in-node/

https://www.youtube.com/watch?v=27GoRa4d15c


Set Data:

To set data in a Firestore document, If the document does not exist, it will be created; if it does exist, it will be replaced with the new data.

const dataToSet = {
  title: "Updated Title",
  content: "Updated Content",
};

docRef.set(dataToSet)
  .then(() => {
    console.log("Document successfully written!");
  })
  .catch((error) => {
    console.error("Error writing document: ", error);
  });


Add Data:

To add data to a Firestore collection, This creates a new document with an automatically generated ID.

const dataToAdd = {
  title: "New Title",
  content: "New Content",
};

db.collection("posts").add(dataToAdd)
  .then((docRef) => {
    console.log("Document added with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });

Update Data:

To update data in an existing Firestore document, This will only modify the fields you specify and will not replace the entire document.

const dataToUpdate = {
  title: "Updated Title",
};

docRef.update(dataToUpdate)
  .then(() => {
    console.log("Document successfully updated!");
  })
  .catch((error) => {
    console.error("Error updating document: ", error);
  });

const currentDateUTC = dayjs().utc();
const serializedDate = currentDateUTC.format(); // string format
const deserializedDate = dayjs(serializedDate);

*/
