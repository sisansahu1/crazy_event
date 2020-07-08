const User = require("../../models/users");

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

 
module.exports = {
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("Email already exists");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hashedPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then((result) => {
        return { ...result._doc, password: null, _id: result._doc._id};
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist");
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Password is invalid");
    }
    const token = jwt.sign({userId:user.id,email:user.email},'somesupersecretkey',
    {expiresIn:'1h'});
    return {userId:user.id,tokenid:token,tokenExpiration:1};

  },
};
