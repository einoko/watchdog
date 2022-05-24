import { User } from "../models/user.js";
import { verifyJWT } from "../utils/JWTUtil.js";

export const authChecker = async function (req, res, next) {
  const userToken = verifyJWT(req.headers.authorization);

  if (userToken.errors.length > 0) {
    return res.status(401).json({ errors: userToken.errors });
  }

  const userId = userToken.decoded.user.id;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(400).json({
      errors: [{ msg: "No account with this username exists." }],
    });
  }

  req.userId = userId;

  next();
};
