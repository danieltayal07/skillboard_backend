import jwt from "jsonwebtoken";

/**
 * Authentication middleware to protect routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticate = async (req, res, next) => {
  try {
    // Check if NEXTAUTH_SECRET is configured
    if (!process.env.NEXTAUTH_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error - NEXTAUTH_SECRET not set",
      });
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      // Also check cookies for NextAuth session token
      // NextAuth uses different cookie names based on environment
      const sessionToken = req.cookies?.["next-auth.session-token"] || 
                          req.cookies?.["__Secure-next-auth.session-token"] ||
                          req.cookies?.sessionToken;
      
      if (!sessionToken) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - No token provided",
        });
      }

      // Verify NextAuth session token
      try {
        const decoded = jwt.verify(sessionToken, process.env.NEXTAUTH_SECRET);
        req.user = {
          id: decoded.id || decoded.sub,
          email: decoded.email,
          name: decoded.name,
        };
        return next();
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized - Invalid token",
        });
      }
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    
    // Attach user info to request
    req.user = {
      id: decoded.id || decoded.sub,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
      error: error.message,
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    const sessionToken = req.cookies?.["next-auth.session-token"] || 
                        req.cookies?.["__Secure-next-auth.session-token"] ||
                        req.cookies?.sessionToken;

    const tokenToVerify = token || sessionToken;

    if (tokenToVerify) {
      try {
        const decoded = jwt.verify(tokenToVerify, process.env.NEXTAUTH_SECRET);
        req.user = {
          id: decoded.id || decoded.sub,
          email: decoded.email,
          name: decoded.name,
        };
      } catch (err) {
        // Invalid token, but continue anyway
      }
    }

    next();
  } catch (error) {
    // Continue even if token is invalid
    next();
  }
};
/////
