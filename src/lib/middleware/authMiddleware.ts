import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { verifyToken } from "./auth";
export const authMiddleware = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      verifyToken(token);

      return handler(req, res);
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};
