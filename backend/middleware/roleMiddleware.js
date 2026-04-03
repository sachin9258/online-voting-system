// backend/middleware/roleMiddleware.js

// ================= ROLE CHECK MIDDLEWARE =================
// roles = array of roles allowed to access the route
// Only JWT-based req.user.role is considered
export const allowRoles = (roles = []) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role; // JWT middleware should attach req.user

      // Not authenticated
      if (!userRole) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated: no role found"
        });
      }

      // Role not allowed
      if (roles.length && !roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Access denied: insufficient permissions"
        });
      }

      // Role allowed
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Role check failed"
      });
    }
  };
};

// ================= PRESET HELPERS =================
// ECI Admin only
export const allowECI = () => allowRoles(["ECI"]);