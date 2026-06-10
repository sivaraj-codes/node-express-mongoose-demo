import { HTTP_STATUS, MESSAGES } from "../../constants/responseConstants.js";
import { AppError } from "../../shared/errors/AppError.js";
import * as userRepository from "./user.repository.js";

export const getUsers = () => userRepository.findAll();

export const createUser = async (userData) => {
  // name/email validation is handled by the Mongoose schema (required: true).
  // If those fields are missing, Mongoose throws a ValidationError which
  // the errorHandler catches and returns as a 500 by default.
  // To return 400 instead, the errorHandler normalises Mongoose errors — see errorHandler.js.
  return userRepository.create(userData);
};
