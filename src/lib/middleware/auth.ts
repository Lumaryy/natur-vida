import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key";

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY);
};
