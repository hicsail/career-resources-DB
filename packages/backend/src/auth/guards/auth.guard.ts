import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TokenExpiredError, verify, decode } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import { Role } from '../utils/role';
import { Roles } from '../utils/roles.decorator';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private cachedPublicKeys: string[] | null = null;

  constructor(private readonly reflector: Reflector) {}

  //Fetch array of public keys (cached)
  private async getPublicKeys(): Promise<string[]> {
    if (this.cachedPublicKeys) return this.cachedPublicKeys;

    try {
      const response = await axios.get<string[]>(`${process.env.AUTH_SERVICE_URL}/public-key`, {
        responseType: 'json',
      });
      this.cachedPublicKeys = response.data.map((key) => key.replace(/\\n/g, '\n')); // normalize line breaks
      return this.cachedPublicKeys;
    } catch (err) {
      this.logger.error('Failed to fetch public keys from AUTH_PK_API', err);
      throw new HttpException('Auth service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    let headers: any = {};
    if (ctx.getType() === 'http') {
      const req = ctx.switchToHttp().getRequest();
      headers = req.headers;
    }

    if (!headers.authorization) {
      this.logger.log('No authorization header found');
      throw new HttpException('Missing Authentication Token', HttpStatus.UNAUTHORIZED);
    }

    const token = headers.authorization.split(' ')[1] || '';
    let decodedToken: any;

    try {
      const keys = await this.getPublicKeys();
      let lastError: any;

      // Try verifying with each public key until one works
      for (const key of keys) {
        try {
          decodedToken = verify(token, key, { algorithms: ['RS256'] });
          break; // success, exit loop
        } catch (err) {
          lastError = err;
          continue; // try next key
        }
      }

      if (!decodedToken) {
        this.logger.error('JWT verification failed with all keys', lastError);
        if (lastError instanceof TokenExpiredError) {
          throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
    } catch (err) {
      this.logger.error('JWT processing failed', err);
      throw err;
    }
    
    if (decodedToken.type !== 'access') {
      this.logger.error('Invalid access token');
      throw new HttpException('Invalid access token', HttpStatus.UNAUTHORIZED);
    }

    //Role-based authorization
    const roles = this.reflector.get<Role[]>(Roles, ctx.getHandler());
    if (!roles) return true;
    if (roles.includes(decodedToken.role)) return true;

    this.logger.error('Insufficient permissions');
    throw new HttpException('Insufficient permissions', HttpStatus.FORBIDDEN);
  }
}