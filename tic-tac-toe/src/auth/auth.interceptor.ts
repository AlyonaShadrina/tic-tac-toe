import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly _authService: AuthService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [request] = context.getArgs();
    request.body.authenticatedUserId = this._authService.getUserIdFromToken(
      request.headers.authorization,
    );
    return next.handle();
  }
}
