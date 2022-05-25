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

/**
 * Creates a deletion token for a monitoring job.
 * @param {*} id ID of the monitoring job
 * @param {*} type Type of the monitoring job ["visual", "text"]
 * @returns {string} JSON Web Token
 */
export const createDeletionToken = (id, type) => {
  const token = jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: "1y",
  });
  return Buffer.from(token).toString("base64");
};
