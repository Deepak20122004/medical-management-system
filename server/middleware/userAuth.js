import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized login again" });
  }

  try {

    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (tokenDecoded.id) {
      req.body.userId = tokenDecoded.id;
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Login Again!" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default userAuth;