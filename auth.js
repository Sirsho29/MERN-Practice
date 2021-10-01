const { User } = require("../models/user");
const bcrypt = require('bcrypt');
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

const { errorResponse, userProfileImage } = require("../globals/functions");

exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg);
  }

  try {
    const prev = await User.findOne({
      where: {
        phone: req.body.phone,
      }
    });
    if (prev) {
      return errorResponse(res, "User with phone number already exists");

    }
    var user = await User.create({ ...req.body, image: userProfileImage() });
    // console.log(user);
    return res.json(user);
  } catch (error) {
    return errorResponse(res, "Not able to save user");
  }
};

exports.signin = async (req, res) => {
  const errors = validationResult(req);
  const { phone, email, password } = req.body;

  if (!errors.isEmpty()) {
    return errorResponse(res, errors.array()[0].msg);
  }
  user = await User.findOne({
    where: {
      phone: phone
    }
  });

  if (!user) {
    return errorResponse(res, "No user exists with this phone number and email id");
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return errorResponse(res, "Phone number and password do not match");
  }
  const token = jwt.sign({ id: user.id }, process.env.SECRET);
  const { id, firstname, lastname, role, image } = user;
  return res.json({ token, user: { id, firstname, lastname, email, role, phone, image } });
}


exports.signout = (req, res) => {
  res.json({
    status: true,
    message: "User logged out successfully",
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ['sha256'],
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile.id == req.auth.id;
  if (!checker) {
    return errorResponse(res, "Unauthorized access. Please login to continue", { code: 401 });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 1) {
    return errorResponse(res, "Unauthorized access. You dont have admin privileges");
  }
  next();
};
