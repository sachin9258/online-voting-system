// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

      req.user = {
        id: decoded.id,
        role: decoded.role?.toUpperCase()
      };

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Access forbidden" });
      }

      next();
    } catch (err) {
      
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
  };
};

export const verifyECIToken = verifyToken(["ECI"]);
export const verifyAdminToken = verifyToken(["ADMIN"]);
export const verifyCandidateToken = verifyToken(["CANDIDATE"]);
export const verifyVoterToken = verifyToken(["VOTER"]);