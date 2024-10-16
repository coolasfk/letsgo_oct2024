const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { createSecretToken } = require("../util/secretToken");
const bcrypt = require("bcryptjs");
// const {decrypt,encrypt} = require('../crypt.js')

/*
router.route('/')
.post(async (req, res) => {

 console.log("req body", req.body)

 let { email1 } = req.body

  const user = await User.findOne({ email1 })



 if (!user) {
 console.log("!user not found")
  User.create(req.body).then((result) => {

  req.session.me = result
   console.log(result)
         res.status(200).json(result);
      });

   } else {

      console.log("the user exists")
       res.status(403).send({ message: "user exists" })

     }
  })
*/
router
  .route("/")
  .post(async (req, res) => {
    let { email1 } = req.body;
    console.log("---WE ARE AT THIS TOUCHPOINT");
    const user = await User.findOne({ email1 });
    try {
      // const user = await User.findOne({ email1 })

      if (!user) {     
        
        console.log("BODY CHECK WHAT GOT SENT TO THE SERVER: ", req.body);
      
  
        User.create(req.body).then((result) => {
          const token = createSecretToken(result._id);

          req.session.me = result;

          res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
          });
          console.log("result", result);
          res.status(200).json(result);
        });
      } else {
        console.log("the user exists");
        res.status(403).send({ error: "user exists" });
      }
    } catch (error) {
      console.log("error", error);
    }
  })
  .delete(async (req, res) => {
    session = req.session;
    console.log("trying to delete");
    let id = req.session?.me?._id;

    try {
      await User.updateMany(
        { friends: { $in: [id] } },
        { $pull: { friends: id } }
      );
      await User.updateMany(
        { peopleIdontWannaSeeAgain: { $in: [id] } },
        { $pull: { peopleIdontWannaSeeAgain: id } }
      );

      const deletedUser = await User.deleteOne({ _id: id });

      if (!deletedUser) {
        console.log("doc was deleted");
      } else {
        console.log("err");
      }

      res.status(200).json({ message: "user was successfully deleted" });
    } catch (error) {
      console.log("user was not deleted", error);
      res.status(500).json({ message: "user was not deleted" });
    }
  });

// router.route('/:email1/')
//   .post(async (req, res) => {

//     console.log(req.body)
//     let { email1, password } = req.body

//     console.log("new email", email1, password)

//     const query = { email1: `${email1}`, password: `${password}` }

//     console.log("query", query)

//     try {

//       const user = await User.findOne(query)

//       if (!user) {
//         console.log("!user not found")
//         res.sendStatus(404)
//         return
//       }

//       req.session.me = user
//       console.log("user", user)
//       res.json(user)

//     } catch (error) {
//       console.log("error at email1", error)
//       res.sendStatus(500)
//     }

//   })

router.route("/:email1/").post(async (req, res) => {
  console.log("req body, checking email", req.body);
  let { email1, password } = req.body;

  if (!email1 || !password) {
    return res.json({ message: "All fields are required" });
  }
  console.log("new email", email1, password);
  const query = { email1: `${email1}` };
  console.log("query", query);
  try {
    const user = await User.findOne(query);
    if (!user) {
      console.log("!user not found");
      res.sendStatus(404);
      return;
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    req.session.me = user;
    console.log("user", user);
    res.json(user);
  } catch (error) {
    console.log("error at email1", error);
    res.sendStatus(500);
  }
});

router.route("/peopleIdontWannaSeeAgain").patch(async (req, res) => {
  session = req.session;

  let id = req.session?.me?._id;

  let peopleIdontWannaSeeAgainOneUser = req.body.peopleIdontWannaSeeAgain;

  let peopleIdontWannaSeeAgain = req.session?.me?.peopleIdontWannaSeeAgain;

  console.log(
    "---------peopleIdontWannaSeeAgain",
    req.session?.me?._id,
    "console.log",
    peopleIdontWannaSeeAgainOneUser
  );

  try {
    const updatePeopleIdontWannaSeeAgain = await User.findByIdAndUpdate(
      id,
      { $push: { peopleIdontWannaSeeAgain: peopleIdontWannaSeeAgainOneUser } },
      { new: true }
    );

    if (!updatePeopleIdontWannaSeeAgain) {
      return res.status(404).json({ error: "document not found" });
    }
    req.session.me.peopleIdontWannaSeeAgain.push(
      peopleIdontWannaSeeAgainOneUser
    );
    res.status(200).json(updatePeopleIdontWannaSeeAgain);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.route("/updateArrayFriends").patch(async (req, res) => {
  session = req.session;
  console.log("trying to patch");
  let id = req.session?.me?._id;

  let newFriendId = req.body.newFriend;

  try {
    const updateArrayWithMyFriendsId = await User.findByIdAndUpdate(
      id,
      { $push: { friends: newFriendId } },
      { new: true }
    );

    if (!updateArrayWithMyFriendsId) {
      return res.status(404).json({ error: "document not found" });
    }
    req.session.me.friends.push(newFriendId);
    res.status(200).json(updateArrayWithMyFriendsId);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.route("/updateImage").put(async (req, res) => {
  console.log("trying to update");
  session = req.session;
  let id = req.session?.me?._id;
  const newImage = req.body.image;
  let imageToBeReplaced = req.session?.me?.image;
  console.log("id", id);
  try {
    let updatePic = await User.findByIdAndUpdate(
      id,
      { image: newImage },
      { new: true }
    );
    if (!updatePic) {
      return console.log("image doc not found");
    }
    console.log("update pic", updatePic);
    res.status(200).json(updatePic);
  } catch (error) {
    console.log("error pic", error);
  }
});

router.route("/updateName").put(async (req, res) => {
  session = req.session;
  let id = req.session?.me?._id;
  let name = req.body.name;

  try {
    const updatedName = await User.findByIdAndUpdate(
      id,
      { name: name },
      { new: true }
    );
    if (!updatedName) {
      res.status(500);
      return console.log("error updating name");
    }

    res.status(200).json(updatedName);
  } catch (error) {
    console.log("error updating name caught");
  }
});

router.route("/updateLocation").put(async (req, res) => {
  console.log("trying to update location");
  session = req.session;
  let id = req.session?.me?._id;
  let location = req.body.location;
  console.log("location", location, "location");

  try {
    const updateLocation = await User.findByIdAndUpdate(
      id,
      { location: location },
      { new: true }
    );
    if (!updateLocation) {
      res.status(500);
      return console.log("error updating location");
    }
    console.log("success!");
    res.status(200).json(updateLocation);
  } catch (error) {
    console.log("error updating location caught", error);
  }
});

module.exports = router;
