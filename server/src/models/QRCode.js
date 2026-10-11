const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: true,
      unique: true,
    },
    qrUrl: {
      type: String,
      default: '',
    },
    qrImageUrl: {
      type: String,
      default: '',
    },
    scanCount: {
      type: Number,
      default: 0,
    },
    isPublicContact: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QRCode', qrCodeSchema);
