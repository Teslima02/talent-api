const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { dateToString } = require('../../helpers/date');
const User = require("../../models/user");

module.exports = {
  createUser: async (args) => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist!");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
  me: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      return await User.findById(req.userId);
    } catch (err) {
      throw err;
    }
  },
  getUser: async (args, req) => {
    try {
      return await User.findById(args.userId);
    } catch (err) {
      throw err;
    }
  },
  updateUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const updatedValue = JSON.parse(JSON.stringify(args.updateUserInput));
      const getUser = await User.findById(req.userId);
      if(updatedValue.password){
        updatedValue.password = await bcrypt.hash(updatedValue.password, 12);
      }
      return await User.findOneAndUpdate({ _id: getUser.id }, updatedValue, {
        new: true,
        useFindAndModify: true,
      });
    } catch (err) {
      throw err;
    }
  },
};
