# Mongoose Complete Learning Notes (for MongoDB Developers)

## Introduction

Mongoose is an ODM (Object Document Mapper) for MongoDB.

### MongoDB Driver

```js
const db = client.db("myapp");

await db.collection("users").insertOne({
  name: "Sivaraj"
});
```

### Mongoose

```js
await User.create({
  name: "Sivaraj"
});
```

Mongoose adds:

- Schemas
- Validation
- Middleware (hooks)
- Models
- Relationships (populate)
- Index management
- Transactions
- Cleaner code

---

# 1. Schema

A schema defines document structure.

## MongoDB Driver

```js
db.collection("users").insertOne({
  name: "Sivaraj",
  age: 25
});
```

No structure enforcement.

## Mongoose

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  age: Number
});
```

### Common Types

```js
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  isActive: Boolean,
  tags: [String],
  createdAt: Date,
  metadata: Object
});
```

---

# 2. Model

Schema = Blueprint

Model = Interface for CRUD operations

```js
const User = mongoose.model(
  "User",
  userSchema
);
```

Usage:

```js
await User.find();
await User.create({...});
```

Equivalent Mongo collection:

```text
User Model
    ↓
users collection
```

---

# 3. CRUD Operations

## Create

MongoDB

```js
db.collection("users")
  .insertOne(data);
```

Mongoose

```js
await User.create(data);
```

---

## Read

### Find All

MongoDB

```js
db.collection("users")
  .find()
  .toArray();
```

Mongoose

```js
await User.find();
```

### Find One

MongoDB

```js
findOne({ email });
```

Mongoose

```js
await User.findOne({ email });
```

### Find By Id

```js
await User.findById(id);
```

---

## Update

MongoDB

```js
updateOne(
  { _id: id },
  { $set: data }
);
```

Mongoose

```js
await User.findByIdAndUpdate(
  id,
  data,
  { new: true }
);
```

---

## Delete

MongoDB

```js
deleteOne({ _id: id });
```

Mongoose

```js
await User.findByIdAndDelete(id);
```

---

# 4. Validation

## Manual Validation

```js
if (!name) {
  throw new Error("Name required");
}
```

## Schema Validation

```js
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});
```

Now:

```js
await User.create({});
```

throws validation error.

### Additional Validators

```js
email: {
  type: String,
  required: true,
  lowercase: true,
  trim: true
}
```

```js
age: {
  type: Number,
  min: 18,
  max: 60
}
```

---

# 5. Timestamps

Instead of manually managing dates:

```js
{
  timestamps: true
}
```

Example:

```js
const userSchema =
  new mongoose.Schema(
    {
      name: String
    },
    {
      timestamps: true
    }
  );
```

Stored:

```json
{
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

# 6. Indexes & Unique

## MongoDB

```js
db.users.createIndex(
  { email: 1 },
  { unique: true }
);
```

## Mongoose

```js
email: {
  type: String,
  unique: true
}
```

Important:

`unique` creates an index.

It is NOT validation.

Always handle duplicate errors:

```js
if (err.code === 11000) {
  ...
}
```

### Compound Index

```js
userSchema.index({
  firstName: 1,
  lastName: 1
});
```

---

# 7. Populate (Joins)

MongoDB doesn't perform joins automatically.

## User

```js
const userSchema =
  new mongoose.Schema({
    name: String
  });
```

## Post

```js
const postSchema =
  new mongoose.Schema({
    title: String,

    user: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  });
```

Stored:

```json
{
  "title": "My Post",
  "user": "665123..."
}
```

### Populate

```js
await Post.find()
  .populate("user");
```

Result:

```json
{
  "title": "My Post",
  "user": {
    "_id": "...",
    "name": "Sivaraj"
  }
}
```

---

# 8. Middleware (Hooks)

Run code before or after operations.

## Pre Save

```js
userSchema.pre(
  "save",
  async function (next) {

    console.log(
      "Before Save"
    );

    next();
  }
);
```

### Password Hashing Example

```js
userSchema.pre(
  "save",
  async function(next) {

    if (
      !this.isModified("password")
    ) {
      return next();
    }

    this.password =
      await bcrypt.hash(
        this.password,
        10
      );

    next();
  }
);
```

---

## Post Save

```js
userSchema.post(
  "save",
  function(doc) {
    console.log(
      "User Saved"
    );
  }
);
```

---

# 9. Methods & Statics

## Instance Method

```js
userSchema.methods.sayHello =
  function() {
    return `Hello ${this.name}`;
  };
```

Usage:

```js
const user =
  await User.findById(id);

user.sayHello();
```

---

## Static Method

```js
userSchema.statics.findByEmail =
  function(email) {
    return this.findOne({
      email
    });
  };
```

Usage:

```js
await User.findByEmail(
  "test@gmail.com"
);
```

---

# 10. Transactions

Used when multiple operations must succeed together.

Example:

Transfer money.

```text
Deduct balance
Add balance
Create audit log
```

All must succeed or fail together.

## MongoDB Session

```js
const session =
  await mongoose.startSession();
session.startTransaction();

await session.commitTransaction();  ->TRY

await session.abortTransaction(); ->CATCH
throw error;


session.endSession(); ->FINALLY

```

Example:

```js
import mongoose from "mongoose";
import User from "./user.model.js";

export const transferMoney =
  async (
    senderId,
    receiverId,
    amount
  ) => {

    const session =
      await mongoose.startSession();

    try {

      session.startTransaction();

      await User.updateOne(
        { _id: senderId },
        {
          $inc: {
            balance: -amount
          }
        },
        { session }
      );

      await User.updateOne(
        { _id: receiverId },
        {
          $inc: {
            balance: amount
          }
        },
        { session }
      );

      await session.commitTransaction();

    } catch (error) {

      await session.abortTransaction();

      throw error;

    } finally {

      session.endSession();

    }
  };
```

---

# 11. Aggregation

Aggregation is MongoDB's data-processing pipeline.

## MongoDB Driver

```js
db.collection("users")
  .aggregate([...]);
```

## Mongoose

```js
User.aggregate([...]);
```

---

## Match

```js
User.aggregate([
  {
    $match: {
      isActive: true
    }
  }
]);
```

---

## Group

```js
User.aggregate([
  {
    $group: {
      _id: "$country",
      count: {
        $sum: 1
      }
    }
  }
]);
```

---

## Project

```js
User.aggregate([
  {
    $project: {
      name: 1,
      email: 1
    }
  }
]);
```

---

## Lookup (Join)

```js
User.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders"
    }
  }
]);
```

---

# Lean Queries

Default:

```js
await User.find();
```

Returns Mongoose Documents.

Better for read-heavy APIs:

```js
await User.find().lean();
```

Returns plain JS objects.

Recommended for most GET APIs.

---

# Feature-Based Repository Example

```js
import User from "./user.model.js";

export const findAll = () =>
  User.find().lean();

export const findById = (id) =>
  User.findById(id);

export const findByEmail = (
  email
) =>
  User.findOne({ email });

export const create = (
  userData
) =>
  User.create(userData);
```

---

# Production Best Practices

1. Use timestamps.
2. Use lean() for read APIs.
3. Create indexes for search fields.
4. Use unique indexes for email/username.
5. Keep business logic in services.
6. Keep DB queries in repositories.
7. Use transactions for critical multi-step updates.
8. Handle duplicate key errors (11000).
9. Use populate carefully.
10. Prefer aggregation for reporting.

---

# MongoDB Driver vs Mongoose Summary

| Feature | MongoDB Driver | Mongoose |
|----------|----------|----------|
| CRUD | Yes | Yes |
| Validation | Manual | Built-in |
| Schema | No | Yes |
| Relationships | Manual | Populate |
| Middleware | No | Yes |
| Models | No | Yes |
| Transactions | Yes | Yes |
| Aggregation | Yes | Yes |
| Learning Curve | Lower | Higher |
| Productivity | Medium | High |
