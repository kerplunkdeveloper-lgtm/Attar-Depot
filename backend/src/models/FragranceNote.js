import mongoose from 'mongoose';

const fragranceNoteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Fragrance note name is required'],
      trim: true,
      unique: true,
      maxlength: [60, 'Fragrance note name cannot exceed 60 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    family: {
      type: String,
      trim: true,
      default: 'Woody', // e.g., Woody, Floral, Amber/Oriental, Fresh & Aquatic, Citrus, Spicy, Musk, Gourmand
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

const FragranceNote = mongoose.model('FragranceNote', fragranceNoteSchema);
export default FragranceNote;
