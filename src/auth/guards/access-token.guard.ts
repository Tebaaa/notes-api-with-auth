import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const [accessToken] = await this.eventEmitter.emitAsync(
      'getTokenfromBearer',
      req,
    );
    const [tokenExistsInDB] = await this.eventEmitter.emitAsync(
      'getDBTokenByAccessToken',
      accessToken,
    );

    const [isBlacklisted] = await this.eventEmitter.emitAsync(
      'getBlacklistedTokenByAccessToken',
      accessToken,
    );
    if (!tokenExistsInDB || isBlacklisted) {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
