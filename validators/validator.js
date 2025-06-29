const User = require("../model/user.js");
class SignupValidator {
  constructor(req) {
    this.req = req;
    this.errors = [];
  }
  validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^(98|97)\d{8}$/;
    return phoneRegex.test(phoneNumber);
  }

  validatePassword(password) {
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = 8;
    return (
      hasLowerCase &&
      hasUpperCase &&
      hasDigit &&
      hasSpecialChar &&
      password.length >= minLength
    );
  }

  async validate() {
    const { phoneNumber, password, confirmPassword, email } = this.req.body;

    if (email) {
      if (!this.validateEmail(email)) {
        this.errors.push("Please enter a valid email address");
      }
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        this.errors.push("Email already in use");
      }
    }

    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        this.errors.push("Passwords do not match");
      }

      if (!this.validatePassword(password)) {
        this.errors.push(
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
        );
      }
    }

    if (phoneNumber) {
      if (!this.validatePhoneNumber(phoneNumber)) {
        this.errors.push("Please enter a valid Phone number.");
      }
      const existingPhonenumber = await User.findOne({
        where: { phoneNumber },
      });
      if (existingPhonenumber) {
        this.errors.push("phoneNumber already exists");
      }
    }

    return this.errors;
  }
}

module.exports = SignupValidator;
