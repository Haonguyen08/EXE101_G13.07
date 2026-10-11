const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    petCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      default: '',
    },
    breed: {
      type: String,
      default: '',
    },
    sex: {
      type: String,
      default: '',
    },
    birthday: {
      type: Date,
    },
    weight: {
      type: Number,
      default: 0,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', petSchema);
