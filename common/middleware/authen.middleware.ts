import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        const decoded = this.jwtService.verify(token);
        req['user'] = decoded;
      } catch (err) {
        return res.status(401).json({ message: 'Token invalid' });
      }
    }
    next();
  }
}
