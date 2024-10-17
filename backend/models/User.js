const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const encrypt = require('mongoose-encryption');
require('dotenv').config();
const Schema = mongoose.Schema;

const  secretMessageKey = process.env.SECRET_MESSAGE_KEY
const sigMessageKey = process.env.SIG_MESSAGE_KEY


const userschema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },

  email1: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  sports: {
    type: [String],
    required: true,
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      index: { type: '2dsphere', sparse: false },
      required: true
    },
  },


  city: {
    type: String,
    required: true
  },
  friends: [{
    type: Schema.ObjectId,
    // type: Schema.Types.ObjectId,
    ref: "User",
  }],
  peopleIdontWannaSeeAgain: [{
    type: Schema.ObjectId,
    // type: Schema.Types.ObjectId,
    ref: "User",
  }],
  bio: {
    type: String
  }
});


// userSchema.plugin(encrypt,  {
//   secret: "mySecretKey", encryptedFields: ['password']
// })

userschema.pre("save", async function() {
  this.password = await bcrypt.hash(this.password, 12);
});

userschema.plugin(encrypt, { encryptionKey: secretMessageKey, signingKey: sigMessageKey, encryptedFields: ['age', 'friends', 'peopleIdontWannaSeeAgain', 'bio', 'image', 'name'] });
const User = mongoose.model("User", userschema);
module.exports = User;
