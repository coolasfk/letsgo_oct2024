const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.route("/updateSports").put(async (req, res) => {
  session = req.session;
  let id = req.session?.me?._id;
  let sports = req.body.sports;

  try {
    const updateSports = await User.findByIdAndUpdate(
      id,
      { sports: sports },
      { new: true }
    );
    if (!updateSports) {
      console.log("updatingSports not successful");
      return res.status(500);
    }
    console.log("success updating sports");
    res.status(200).json(updateSports);
  } catch (error) {
    console.log("error updating sports", error);
    res.status(500);
  }
});

router.route("/updateAge").put(async (req, res) => {
  session = req.session;
  let id = req.session?.me?._id;
  let age = req.body.age;
  console.log("age", age);
  try {
    const updatedAge = await User.findByIdAndUpdate(
      id,
      { age: age },
      { new: true }
    );
    if (!updatedAge) {
      console.log("updateAge was not succesful");
      res.status(500);
    }
    console.log("updating Age was successful", updatedAge);
    res.status(200).json(updatedAge);
  } catch (e) {
    console.log("error updating age", e);
    res.status(500);
  }
});

router.route("/addBio").put(async (req, res) => {
  console.log("trying to update bio");
  session = req.session;
  let id = req.session?.me?._id;
  let bio = req.body.bio;
  console.log("bio", bio);
  try {
    const updatedBio = await User.updateOne(
      { _id: id },
      { $set: { bio: bio } },
      { new: true, upsert: true }
    );
    if (!updatedBio) {
      console.log("updating bio wasn't successful");
      return res.status(500);
    }

    console.log("updating bio was successful");
    res.status(200).json(updatedBio);
  } catch (error) {
    console.log("error updating a bio caught", error);
    res.status(500);
  }
});

module.exports = router;
