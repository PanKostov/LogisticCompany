import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { UserAccess } from '../user/models/UserAccess.enum'

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const type = request.session.user.type
    //return type === UserAccess.ADMIN
    //TODO: returns true for testing purposes
    return true
  }
}
