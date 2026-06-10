// Explicit collection names passed to mongoose.model() as the third argument.
// This overrides Mongoose's auto-pluralisation so the collection name
// is always predictable, regardless of how the model is named.
export const DB_COLLECTIONS = {
  demoDB: { USERS: "users" },
};
