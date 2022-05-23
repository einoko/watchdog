import jwt from "jsonwebtoken";

export const verifyJWT = (token) => {
  const errors = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { decoded, errors };
  } catch (err) {
    errors.push({ msg: "Invalid token." });
    return { errors };
  }
};
