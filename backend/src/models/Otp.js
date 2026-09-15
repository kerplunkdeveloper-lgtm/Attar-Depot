import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, 'Phone number is required for OTP verification'],
      index: true,
      trim: true,
    },
    otp: {
      type: String,
      required: [true, 'OTP code is required'],
    },
    attempts: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatically delete document after expiry time
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
