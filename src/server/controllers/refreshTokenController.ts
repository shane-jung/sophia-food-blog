import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const handleRefreshToken = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res
      .status(401)
      .json({ message: "No refresh token found, login again" });
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: err });
      const accessToken = jwt.sign(
        { user: decoded.user },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ accessToken, user: decoded.user });
    }
  );
};

export default { handleRefreshToken };
