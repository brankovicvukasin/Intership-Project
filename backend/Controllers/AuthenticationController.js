const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const axios = require("axios");
const Keywords = require(".././Models/KeywordsModel");

const createToken = (email, role) =>
  jwt.sign({ email, role, isAuthenticated: true }, process.env.JWT_SECRET, {
    expiresIn: 300000000,
  });

exports.protect = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return next(new Error("You don`t have a token, please Sign in!", 401));
    }

    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    const email = decoded.email;

    const currentUser = await User.findOne({ email });

    if (!currentUser) {
      return next(new Error("User with this token doesn`t exist!", 401));
    }

    req.user = currentUser;

    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "fail",
      message: "Error during authentication!",
      error: error.message,
    });
  }
};

exports.restrict =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("You don`t have permission for this!!", 403));
    }
    next();
  };

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new Error("Please enter email or password!"));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || user.password !== password) {
      return next(new Error("Please enter valid email or password!"));
    }

    const token = createToken(user.email, user.role);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3600 * 1000 * 24 * 3),
      httpOnly: true,
      sameSite: "none",
      secure: "false",
    });

    res.status(200).json({
      status: "success",
      token,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "fail",
      message: "Error while login!",
      error: error.message,
    });
  }
};

exports.logout = (req, res, next) => {
  try {
    res.cookie("jwt", "logout", {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: "true",
    });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Error while logout!",
      error: error.message,
    });
  }
};

exports.addNewUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const newUser = await User.create({
      email: email,
      password: password,
      role: role,
    });

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: "Error while adding new User!",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    let { limit, currentPage } = req.query;

    currentPage = parseInt(currentPage) || 1;
    limit = parseInt(limit) || 5;
    const skip = (currentPage - 1) * limit;

    const totalUsers = await User.countDocuments({});
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find({}, "email role").skip(skip).limit(limit);

    res.status(200).json({
      status: "success",
      data: users,
      totalPages,
      currentPage,
      totalUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: "Error fetching users",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { email } = req.query;

  try {
    const deletedUser = await User.findOneAndDelete({ email: email });

    if (!deletedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "fail",
      message: "Error deleting user",
      error: error.message,
    });
  }
};

exports.getRole = async (req, res) => {
  try {
    const role = req.user.role;

    res.status(200).json({
      status: "success",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Failed to retrieve analysis",
      error: error.message,
    });
  }
};
