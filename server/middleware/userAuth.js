import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  console.log("Token from cookie:", token); // Debugging log

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized login again" });
  }

  try {
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (tokenDecoded.id) {
     
    req.userId = tokenDecoded.id;
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Login Again!" });
    }
    next();
  } catch (error) {
    console.error("Error in userAuth middleware:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default userAuth;
