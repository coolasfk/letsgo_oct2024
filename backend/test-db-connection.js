const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://LETSGO:b5pgmJwSQVpE1fkv@letsgo.w5jvdwy.mongodb.net/LETSGO?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});