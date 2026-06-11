import { HTTP_STATUS } from "../../constants/responseConstants.js";
import { sendError } from "../utils/handlers.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // ── Mongoose ValidationError ──────────────────────────────────────────────
  // Thrown when schema validation fails (required, enum, minlength, etc.)
  // err.errors is an object: { fieldName: { message, kind, value } }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return sendError({ res, message, statusCode: HTTP_STATUS.BAD_REQUEST });
  }

  // ── Mongoose Duplicate Key Error ──────────────────────────────────────────
  // Thrown by MongoDB when a unique index constraint is violated.
  // Code 11000 = duplicate key.
  // but this is the safety net if it somehow slips through.
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError({
      res,
      message: `${field} already exists`,
      statusCode: HTTP_STATUS.CONFLICT,
    });
  }

  // ── Mongoose CastError ────────────────────────────────────────────────────
  // Thrown when an invalid ObjectId is passed in a URL param (e.g. /users/abc)
  if (err.name === "CastError") {
    return sendError({
      res,
      message: `Invalid ${err.path}: ${err.value}`,
      statusCode: HTTP_STATUS.BAD_REQUEST,
    });
  }

  // ── AppError (known operational errors) ──────────────────────────────────
  // ── Default (unknown/unexpected errors) ──────────────────────────────────
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  sendError({ res, message, statusCode });
};
