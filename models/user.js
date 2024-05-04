const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: String,
  },
  pfpUrl: {
    type: String,
    required: true,
    default: "/images/default.png",
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;
  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");
  console.log(`static ${user}`);
  const hashedPassword = user.password;
  const salt = user.salt;

  const providedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== providedPassword)
    throw new Error("Incorrect Password");

  return user;
});

const User = model("user", userSchema);

module.exports = User;
