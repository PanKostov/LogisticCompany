import { registerDecorator, ValidationOptions } from 'class-validator'
import { EgnValidator } from './EgnValidationPipe'

export function IsEgnValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEgnValid',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: EgnValidator,
    })
  }
}
