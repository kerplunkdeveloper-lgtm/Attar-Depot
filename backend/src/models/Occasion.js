import mongoose from 'mongoose';

const occasionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Occasion name is required'],
      trim: true,
      unique: true,
      maxlength: [60, 'Occasion name cannot exceed 60 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Occasion = mongoose.model('Occasion', occasionSchema);
export default Occasion;
