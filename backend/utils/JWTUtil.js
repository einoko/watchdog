import jwt from "jsonwebtoken";

/**
 * Verifies a JSON Web Token
 * @param {*} JSON Web Token
 * @returns {object} Object of the decoded JWT or an error object
 */
export const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      decoded,
      errors: [],
    };
  } catch (err) {
    return {
      errors: [{ msg: "Invalid token." }],
    };
  }
};
