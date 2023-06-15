import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const handleRefreshToken = (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res
      .status(401)
      .json({ message: "No refresh token found, login again" });
  const refreshToken = cookies.jwt;
  //console.log(`Verifying refresh token in cookies: ${refreshToken}`);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: err });
      // console.log("Generating new access token from refresh token.")
      const accessToken = jwt.sign(
        { user: decoded.user },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "1h" }
      );
      // console.log(`New access token: ${accessToken}`)
      // console.log("Storing new access token in cookies? (Should I be doing this)")
      // req.headers['Authorization'] = `Bearer ${accessToken}`
      // res.cookie('jwt', accessToken, { httpOnly: true});
      return res.status(200).json({ accessToken, user: decoded.user });
    }
  );
};

export default { handleRefreshToken };
