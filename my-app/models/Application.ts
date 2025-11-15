import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  fullName: string;
  email: string;
  mobile: string;
  linkedin: string;
  role: string;
  about: string;
  portfolioFileName?: string;
  portfolioFileSize?: number;
  submittedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    linkedin: {
      type: String,
      required: [true, "LinkedIn profile is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Product", "Design", "Marketing", "Tech", "Operations", "Other"],
    },
    about: {
      type: String,
      required: [true, "About section is required"],
      trim: true,
    },
    portfolioFileName: {
      type: String,
      trim: true,
    },
    portfolioFileSize: {
      type: Number,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Application =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;

