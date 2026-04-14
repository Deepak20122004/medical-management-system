import jwt from "jsonwebtoken";

// userAuth: middleware that verifies JWT token from cookies
// - extracts user ID from token and sets req.userId for authenticated requests
// - returns 401 if token is missing or invalid
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  // console.log("Cookies:", req.cookies);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized login again" });
  }

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (tokenDecoded.id) {
      req.userId = tokenDecoded.id;
      // req.user = { id: decoded.id };
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Login Again!" });
    }
    next();
  } catch (error) {
    // console.error("Error in userAuth middleware:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default userAuth;
