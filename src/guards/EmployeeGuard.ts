import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { UserAccess } from '../user/models/UserAccess.enum'

export class EmployeeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.session?.user

    if (!user) {
      return false
    }

    // Admins have full access; staff are identified by isEmployee flag.
    if (user.type === UserAccess.ADMIN) {
      return true
    }

    return Boolean(user.isEmployee)
  }
}
