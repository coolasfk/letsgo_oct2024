const fs = require("fs");
const express = require("express");
const User = require("./models/User");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const users = require("./routes/users.js");
const editYourProfile = require("./routes/editYourProfile.js");
const ObjectId = require("mongodb").ObjectId;
// const MJ_APIKEY_PUBLIC = process.env['MJ_APIKEY_PUBLIC']
// const MJ_APIKEY_PRIVATE = process.env['MJ_APIKEY_PRIVATE']
const Mailjet = require("node-mailjet");
//const encrypt = require('mongoose-encryption');
const Message = require("./models/Message");
require("dotenv").config();
const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);
// const encrypt = require('mongoose-encryption');

// const {decrypt,encrypt} = require('./crypt.js')
//let session;

const app = express();
app.use(express.json({ limit: "90mb" }));
app.use(express.urlencoded({ limit: "90mb", extended: true }));
app.use(bodyParser.json({ limit: "90mg" }));
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;

const sessionKey = process.env.SESSION_KEY;

app.use(
  sessions({
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

try {
  mongoose.connect(
    "mongodb+srv://LETSGO:b5pgmJwSQVpE1fkv@letsgo.w5jvdwy.mongodb.net/LETSGO?retryWrites=true&w=majority"
  );
  console.log("server connection was successful");
} catch (error) {
  console.log("so this is not working");
}

//const port = process.env.PORT || 443 || 8080 || 3000;
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // can switch to spefific urls later, replace "*" with ["http://localhost:3010"]
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
console.log("cors", cors);
app.use(cors());
io.on("connection", (socket) => {
  console.log("New client connected");
  io.emit("Hello", "hi");
  io.emit("Hello", "hi");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

//server.listen(port); //, () => {
//console.log(`Server running on http://localhost:${port}`);
//});

app.post("/resetPass/", async (req, res) => {
  const email = req.body.email;

  // const code = req.body.code;

  let code = Math.floor(Math.random() * 9000 + 1000);

  setTimeout(() => {
    code = Math.floor(Math.random() * 9000 + 1000);
  }, 60000);

  // console.log("email", email, "code", code)
  // const name = req.body.name;

  try {
    const request = mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "whatevacreates@gmail.com",
              Name: "Unicorn",
            },
            To: [
              {
                Email: email,
                // Name: name
              },
            ],
            Subject: "Someone forgot their password, huh?",
            // TextPart: "Someone forgot their password, huh?",
            // HTMLPart: "<h3>Let's go & reset it!</h3><br />Click on this link to reset it. <a href=\"https://www.mailjet.com/\">Reset my password</a>"

            HTMLPart: `Hey there!
<p>Looks like someone (maybe you!) forgot their password and needs a little help getting back on track 🕺. You're in luck; we've got your back!</p>
<p>To reset your password, simply use this magical code: <h3><br/><strong>${code}</strong><br/></h3> and enter it in the Let's Go App fields. Once you enter the code, you'll be able to set up a new password and dive back into the excitement of connecting with adventurous buddies!</p>
<p>If you didn't forget your password and received this email by mistake, well, consider it a friendly reminder that we're here for you anyway 🧞‍♀️.</p>
<p>Keep exploring! 🤘</p>
<p>Eva from Let's Go App</p>
`,
          },
        ],
      })
      .then((result) => {
        res.status(200).json({ code: code });
        console.log(result.body, "success yeyeyeye");
      })
      .catch((err) => {
        console.log(err.statusCode, err, "caught error");
      });
  } catch (error) {
    console.log("error sending email", error);
  }
});

app.use("/users", users);
app.use("/editYourProfile", editYourProfile);

app.get("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json({ message: "successfully logged out" });
    }
  });
});

app.post("/myfriends", async (req, res) => {
  console.log("getting my friends");

  let id = req.session?.me?._id;

  try {
    const session = req.session;

    if (session.me) {
      const me = session.me;
      let result = await User.find({ _id: { $in: me.friends } });

      const idToCheck = new ObjectId(id);
      let arrayMatches = [];

      for (let i = 0; i < result.length; i++) {
        let array = result[i].friends;

        if (array.includes(idToCheck)) {
          arrayMatches.push(result[i]);
        }
      }
      result = arrayMatches;
      // console.log(result, "result")

      res.status(200).json(result);
    } else {
      res.status(401).json("Error fetching friends");
    }
  } catch (error) {
    console.log("error fetching friends", error);
    res.status(500).json({ error: "Error fetching friends" });
  }
});
app.get("/allusers", async (req, res) => {
  console.log("getting all users", req.session);
  let result = await User.find({}).select({ image: 0 });

  result = result.map((user) => ({ name: user.name }));

  res.json(result);
});

app.post("/users_nearby", async (req, res) => {
  console.log("------a request to find the users nearby");
  const { distance, sports, location } = req.body;
  session = req.session;

  if (!req.session.me) {
    return res.status(401).send("Error fetching users");
  }

  const me = req.session.me;
  try {
    const nearbyUsers = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: location.coordinates,
          },
          distanceField: "distance",
          maxDistance: distance,
          spherical: true,
        },
      },
      {
        // Step 2: Exclude the requesting user by their _id and match sports
        $match: {
          _id: { $ne: me._id },
          sports: { $in: sports },
        },
      },
    ]);

    const filteredUsers = nearbyUsers.filter((user) => !user._id.equals(me._id));

    // Manually decrypt each result by creating Mongoose model instances
    const decryptedUsers = filteredUsers.map((encryptedDoc) => {
      const decryptedDoc = User.hydrate(encryptedDoc);
      return decryptedDoc.toObject(); // Triggers decryption of fields
    });

    //console.log("Decrypted users:", decryptedUsers);
    res.json(decryptedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

/*
app.post("/users_nearby", async (req, res) => {
  console.log("------a request to find the users nearby");
  const { distance, sports, location } = req.body;
  session = req.session;

  if (!req.session.me) {
    return res.status(401).send("Error fetching users");
  }

  const me = req.session.me;

  try {
    const results = await User.find({
      _id: { $nin: [...me.friends, me._id, ...me.peopleIdontWannaSeeAgain] },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: location.coordinates
          },
          $maxDistance: distance
        }
      },
      sports: { $in: sports }
    })
    .select('name age location city sports distance');

    console.log("Matching users:", results);
    res.json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});
*/

/*
app.post("/users_nearby", async (req, res) => {
  console.log("------a request to find the users nearby");
  const { distance, sports, location } = req.body;
  session = req.session;

  if (!req.session.me) {
    return res.status(401).send("Error fetching users");
  }

  const me = req.session.me;

  try {
    const results = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: location.coordinates,
          },
          distanceField: "distance",
          maxDistance: distance,
          spherical: true,
          query: {
            _id: {
              $nin: [...me.friends, me._id, ...me.peopleIdontWannaSeeAgain],
            },
          },
        },
      },
      {
        $project: {
          _ct: 1,
          _ac: 1,
          location: 1,
          city: 1
        },
      },
      /*
      {
        $match: {
          sports: { $in: sports }
        }
      },
    ]);

    console.log("Matching users name::", results, "those were results");
    res.json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});*/
/*
app.post("/users_nearby", async (req, res) => {
  console.log("------a request to find the users nearby");
  const { distance, sports, location } = req.body;
  session = req.session;

  if (!req.session.me) {
    return res.status(401).send("Error fetching users");
  }

  const me = req.session.me;

  try {
    const results = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: location.coordinates,
          },
          distanceField: "distance",
          maxDistance: distance,
          spherical: true,
          query: {
            _id: { $nin: [...me.friends, me._id, ...me.peopleIdontWannaSeeAgain] }
          }
        }
      },
      {
        $match: {
          sports: { $in: sports }
        }
      },
    ]);

    console.log("Matching users:", results);
    res.json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});
*/
/*
app.post("/users_nearby", async (req, res) => {
  console.log("------a request to find the users nearby");
  let distance = req.body.distance;

  let sports = req.body.sports;

  let location = req.body.location;

  console.log("distance", location);

  session = req.session;

  if (req.session.me) {
    let me = req.session?.me;

    User.find({
      _id: { $nin: [...me.friends, me._id, ...me.peopleIdontWannaSeeAgain] },

      location: {
        $near: {
          $geometry: {
            type: "Point",

            coordinates: location.coordinates,
          },
          $maxDistance: distance,
        },
      },
    })
      .select(["-password", "-email1"])
      .then((results) => {
        let matchingUsers = [];
        results.forEach((user) => {
          console.log("sports._", sports);
          console.log(user.sports, "user.sports");

          if (user.sports.some((el) => sports.includes(el))) {
            matchingUsers.push(user);
          }
          console.log(matchingUsers, "matchingUsers");
        });

        res.json(matchingUsers);
      });
  } else {
    res.status(401).send("Error fetching users");
  }
});
*/
/*
app.post("/users_nearby", async (req, res) => {
  console.log("------a request to find the users nearby");
  let distance = req.body.distance;
  let sports = req.body.sports;
  let location = req.body.location;
  session = req.session;

  if (req.session.me) {
    let me = req.session?.me;
    try {
      const results = await User.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: location.coordinates // Ensure this is correct
            },
            distanceField: "distance",
            maxDistance: distance, // Ensure `distance` is a valid number
            spherical: true
          }
        },
        // Optional: add further stages to filter by `sports`, etc.
        { $match: { sports: { $in: sports } } }
      ]);
      console.log("success no error here");
      res.json(results); 
    } catch (e) {
      console.error("nope it did not work out", e);
      res.status(500).send("Error fetching users");
    }
  }
});
*/

app.get("/check", (req, res) => {
  req.session.ollo = "ok";
  req.session.save((err) => {
    console.log(err);
    res.json(req.session.ollo);
  });
});
app.get("/check2", (req, res) => {
  res.json(req.session.ollo || "not ok");
});

app.put("/updatePassword/", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  console.log("email&password", email, password);
  try {
    let updatedPassword = await User.findOneAndUpdate(
      { email1: email },
      { password: password },
      { new: true }
    );

    if (!updatedPassword) {
      console.log("error updating password");
      res.status(500);
      return;
    }
    console.log("password successfully updated");
    res.status(200).json({ message: "yes" });
  } catch (error) {
    console.log(error, "error updating password");
  }
});

app.get("/messages/:userId/:friendId", async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    console.log("userId", userId, "friendId", friendId);

    const sessionData = req.session;

    sessionData.userId = userId;
    sessionData.friendId = friendId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).sort({ createdAt: -1 });

    if (messages === null) {
      console.log("there are no messages yeet");
      res.status(200).res.json({ message: "there are no messages yet" });
    }
    console.log("success");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

app.post("/messages", async (req, res) => {
  console.log("trying to save the message");
  try {
    const { text, senderId, receiverId } = req.body;
    // const check = "i'm checking the connection"
    // io.emit('room', check)

    const message = new Message({
      text,
      sender: senderId,
      receiver: receiverId,
    });
    await message.save();

    console.log("the message saved");
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
});

// const checkEncrypt = async () => {
//   try {
//     const user = await
//       User.findOne({ name: "B" })
//     console.log("user", user)
//   } catch (err) {
//     console.log(err)
//   }

// }

// checkEncrypt()

// module.exports = {
//   data: new SlashCommandBuilder().setName('dbtest').setDescription('db test'),
//   async execute(interaction) {
//     try {
//       const data = await testSchema.findOne({
//         GuildID: interaction.guild.id,
//         UserID: interaction.user.id,
//       });

//       if (!data) {
//         testSchema.create({
//           GuildID: interaction.guild.id,
//           UserID: interaction.user.id,
//         });
//       }

//       if (data) {
//         console.log(data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   },
// };
