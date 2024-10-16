require('dotenv').config();

const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const secretMessageKey = process.env.SECRET_MESSAGE_KEY
const sigMessageKey = process.env.SIG_MESSAGE_KEY



const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


messageSchema.plugin(encrypt, { encryptionKey: secretMessageKey, signingKey: sigMessageKey });

module.exports = mongoose.model('Messagee', messageSchema);




// const User = mongoose.model("User", userschema);


// module.exports = User;