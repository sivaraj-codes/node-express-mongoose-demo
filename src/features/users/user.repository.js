import { User } from "./user.model.js";

// Returns an array of plain documents directly (no .toArray() needed)
export const findAll = () => User.find();

// Returns a single document or null
export const findByEmail = (email) => User.findOne({ email });

// Returns the full saved document including _id, createdAt, updatedAt
export const create = (userData) => User.create(userData);
