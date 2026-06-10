import mongoose from "mongoose";
import { DB_COLLECTIONS } from "../../constants/dbCollections.js";
import { USER_ROLES } from "../../constants/responseConstants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // built-in validation → "Path `name` is required."
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"], //customise required message
      unique: true, // creates a unique index in MongoDB
      lowercase: true, // auto-lowercases before saving
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES), // only "admin" or "user" allowed
      default: USER_ROLES.USER,
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt fields
  },
);

// Third arg: explicit collection name — overrides Mongoose's auto-pluralisation
export const User = mongoose.model(
  "User",
  userSchema,
  DB_COLLECTIONS.demoDB.USERS,
);
