import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? "";


const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (JWT_SECRET == "")
    return res.status(500).json({ message: "Invalid jwt_secret" });

  if(token){
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error('Token verification failed:', err);
          return res.status(403).json({ message: 'Invalid token' });
        }
    
        req.app.locals.user = decoded;
        console.log('User extracted from token:', req.app.locals.user);
    
        next();
      });
}else{    
    // Return response with error
    return res.json({
        login: false,
        data: 'error'
    });
}
};

export default authenticateToken;
