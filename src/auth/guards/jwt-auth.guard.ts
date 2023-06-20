import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly eventEmitter: EventEmitter2) {
    super();
  }

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

    // TODO: revisar en la blacklist :)
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
