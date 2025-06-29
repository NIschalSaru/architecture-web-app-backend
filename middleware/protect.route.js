const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
class ProtectRoute {
  static async authorize(req, res, next) {
    try {
      // console.log("Cookies: ", req.cookies);
      const token = req.cookies.authToken;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      if (!decoded)
        return res
          .status(401)
          .json({ message: "Session expired. Please log in again." });
      const user = await User.findOne({
        where: { id: decoded.userData.id },
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return res.status(404).json({ message: "Unauthorized" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = ProtectRoute.authorize;
