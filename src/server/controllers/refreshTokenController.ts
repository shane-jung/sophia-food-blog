import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const handleRefreshToken = (req: Request, res:Response) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(401).json({message: 'Unauthorized'});  
    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        (err: any, user: any) => {
            console.log(user);
            if (err) return res.status(403).json({message: 'Forbidden'});
            const accessToken = jwt.sign(
                { email: user.email },
                process.env.ACCESS_TOKEN_SECRET!,
                { expiresIn: '1h' }
            );
            res.cookie('jwt', accessToken, { httpOnly: true});
            return res.status(200).json({ accessToken });
        }
    )
}

export default { handleRefreshToken };