const User = require("../model/user.js");
const {
  hashPassword,
  comparePassword,
  generateAccessToken,
  resetPasswordOtp,
  generateResetPasswordToken,
} = require("../services/auth.service.js");
const SignupValidator = require("../validators/validator.js");
const { asyncHandler } = require("../services/async.handler.js");
const EmailService = require("../services/email.service.js");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const { log } = require("console");

// const signup = asyncHandler(async (req, res) => {
//   const validator = new SignupValidator(req);
//   const errors = await validator.validate();
//   if (errors.length > 0) {
//     return res.status(400).json({ errors });
//   }
//   const { fullName, phoneNumber, password, gender, email, role } = req.body;
//   const hashedPassword = await hashPassword(password);
//   const boyProfilePic = `https://avatar.iran.liara.run/public/boy?userName=${phoneNumber}`;
//   const girlProfilePic = `https://avatar.iran.liara.run/public/girl?userName=${phoneNumber}`;
//   const newUser = await User.create({
//     fullName,
//     phoneNumber,
//     password: hashedPassword,
//     gender,
//     role,
//     email,
//     filename: null,
//     filepath: gender === "male" ? boyProfilePic : girlProfilePic,
//   });
//   const payload = { id: newUser.id, email: newUser.email };
//   const token = await generateAccessToken(payload, res);
//   res.status(201).json({
//     id: newUser.id,
//     fullName: newUser.fullName,
//     email: newUser.email,
//     filepath: newUser.filepath,
//     token,
//     message: "User created successfully",
//   });
// });

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const payload = { id: user.id, email: user.email };
  const token = await generateAccessToken(payload, res);

  res.status(200).json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    filepath: user.filepath,
    token,
    message: "Login successful",
  });
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("authToken", "", { maxAge: 0 });
  res.status(200).json({ message: "Logout successful" });
});

const updateEmailAndPassword = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newEmail, newPassword, confirmNewPassword } =
    req.body;

  console.log(currentPassword, newEmail, newPassword, confirmNewPassword);

  if (!currentPassword) {
    return res.status(400).json({ message: "Current password is required" });
  }
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isCurrentCorrect = await comparePassword(
    currentPassword,
    user.password
  );
  if (!isCurrentCorrect) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  const updatedFields = {};
  if (newEmail) {
    updatedFields.email = newEmail;
  }
  if (newPassword || confirmNewPassword) {
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        message: "Passwords do not match with Confirmation Password.",
      });
    }
    updatedFields.password = await hashPassword(newPassword);
  }

  if (Object.keys(updatedFields).length === 0) {
    return res
      .status(400)
      .json({ message: "No new email or password provided" });
  }
  await user.update(updatedFields);

  res.status(200).json({
    id: user.id,
    email: user.email,
    message: "Email/Password updated successfully",
  });
});

// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ where: { email } });
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const { otp, hashedOtp } = await resetPasswordOtp();
//   const resetTokenExpiry = Date.now() + 5 * 60 * 1000;
//   const token = await generateResetPasswordToken(user.email, otp);

//   try {
//     const resetLink = `http://localhost:5000/api/architecture-web-app/auth/reset-password?token=${token}`;

//     const sentEmail = await EmailService.sendMail(
//       process.env.EMAIL_FROM,
//       user.email,
//       "OTP for Password Reset",
//       `Click the link below to reset your password:\n\n${resetLink}`
//     );

//     if (sentEmail) {
//       user.passwordResetToken = hashedOtp;
//       user.passwordResetTokenExpiry = resetTokenExpiry;
//       await user.save();

//       res.status(200).json({ message: "Reset password OTP sent successfully" });
//     }
//   } catch (error) {
//     console.error("Email sending error:", error.message);
//     res.status(500).json({ message: "Failed to send email" });
//   }
// });

// const resetPassword = asyncHandler(async (req, res) => {
//   const { password, confirmPassword } = req.body;
//   const { token } = req.query;
//   if (!token) {
//     return res.status(400).json({ message: "Token is required" });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // console.log("Decoded token:", decoded);

//     const { email, otp } = decoded;

//     console.log("decoded email:", email, "otp:", otp);

//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const isOTPCorrect = await comparePassword(otp, user.passwordResetToken);
//     const isTokenExpired = user.passwordResetTokenExpiry < Date.now();
//     if (!isOTPCorrect || isTokenExpired) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }
//     user.password = await hashPassword(password);
//     user.passwordResetToken = null;
//     user.passwordResetTokenExpiry = null;
//     user.passwordChangedAt = Date.now();
//     await user.save();
//     res.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     console.error("Token error:", error);
//     return res.status(400).json({ message: "Invalid or expired token." });
//   }
// });

// const editProfile = asyncHandler(async (req, res) => {
//   const validator = new SignupValidator(req);
//   const errors = await validator.validate();
//   if (errors.length > 0) {
//     return res.status(400).json({ errors });
//   }

//   const userId = req.params.id;
//   const {
//     fullName,
//     phoneNumber,
//     email,
//     gender,
//     oldPassword,
//     password,
//     confirmPassword,
//   } = req.body;
//   const user = await User.findByPk(userId);
//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const updatedFields = {};
//   if (fullName) updatedFields.fullName = fullName;
//   if (phoneNumber) updatedFields.phoneNumber = phoneNumber;
//   if (email) updatedFields.email = email;
//   if (gender) updatedFields.gender = gender;

//   const uploadedImage = req.files?.image?.[0];
//   if (uploadedImage) {
//     if (user.filepath) {
//       const sanitizedPath = user.filepath.replace(/^\/+/, "");
//       const oldPath = path.join(__dirname, "..", "storage", sanitizedPath);
//       if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//     }
//     const folderName = dayjs().format("YYYYMMDD");
//     const filename = uploadedImage.filename;
//     const filepath = `/uploads/${folderName}/${filename}`;
//     updatedFields.filename = filename;
//     updatedFields.filepath = filepath;
//   }

//   if (password || confirmPassword) {
//     if (!oldPassword) {
//       return res
//         .status(400)
//         .json({ message: "Current password is required to change password" });
//     }

//     const isOldCorrect = await comparePassword(oldPassword, user.password);
//     if (!isOldCorrect) {
//       return res.status(400).json({ message: "Current password is incorrect" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "New passwords do not match" });
//     }

//     updatedFields.password = await hashPassword(password);
//   }

//   const updatedUser = await user.update(updatedFields);

//   res.status(200).json({
//     id: updatedUser.id,
//     fullName: updatedUser.fullName,
//     email: updatedUser.email,
//     filepath: updatedUser.filepath,
//     message: "Profile updated successfully",
//   });
// });

module.exports = {
  // signup,
  login,
  logout,
  // forgotPassword,
  // resetPassword,
  // editProfile,
  updateEmailAndPassword,
};
