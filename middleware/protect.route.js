const jwt = require("jsonwebtoken");
const User = require("../model/user.js");

class ProtectRoute {
  static async authorize(req, res, next) {
    try {
      const token = req.cookies.authToken;
      
      if (!token) {
        return res.status(401).json({ 
          success: false,
          message: "Unauthorized - No token provided" 
        });
      }

      if (typeof token !== "string" || token.split(".").length !== 3) {
        return res.status(401).json({ 
          success: false,
          message: "Unauthorized - Invalid token format" 
        });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (jwtError) {
        if (jwtError.name === "TokenExpiredError") {
          return res.status(401).json({ 
            success: false,
            message: "Session expired. Please log in again." 
          });
        }
        if (jwtError.name === "JsonWebTokenError") {
          return res.status(401).json({ 
            success: false,
            message: "Unauthorized - Invalid token" 
          });
        }
        throw jwtError;
      }

      if (!decoded || !decoded.userData || !decoded.userData.id) {
        return res.status(401).json({ 
          success: false,
          message: "Unauthorized - Invalid token payload" 
        });
      }

      const user = await User.findOne({
        where: { id: decoded.userData.id },
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(500).json({ 
        success: false,
        message: "Internal Server Error" 
      });
    }
  }
}

module.exports = ProtectRoute.authorize;
