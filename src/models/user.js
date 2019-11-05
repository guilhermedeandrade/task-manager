const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 7,
    trim: true,
    validate: value => {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Passwords cannot contain the word 'password'");
      }
    }
  },
  age: {
    type: Number,
    validate: value => {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    }
  }
});

userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
