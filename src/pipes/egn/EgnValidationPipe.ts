import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class EgnValidator implements ValidatorConstraintInterface {
  private EGN_WEIGHTS: number[] = [2, 4, 8, 5, 10, 9, 7, 3, 6];

  validate(egn: string, args: ValidationArguments): boolean {
    if (egn.length !== 10) {
      return false;
    }
    const year = Number(egn.substring(0, 2));
    const month = Number(egn.substring(2, 4));
    const day = Number(egn.substring(4, 6));

    if (month > 40) {
      if (!this.isValidDate(month - 40, day, year + 2000)) return false;
    } else if (month > 20) {
      //LogisticCompany considers people born in the 1800s having a invalid egn
      return false;
      //if (!this.isValidDate(month - 20, day, year + 1800)) retrun false
    } else {
      if (!this.isValidDate(month, day, year + 1900)) return false;
    }

    const checksum = Number(egn.substring(9, 10));
    let egnSum = 0;
    for (let i = 0; i < 9; i++) {
      egnSum += Number(egn.charAt(i)) * this.EGN_WEIGHTS[i];
    }

    const validChecksum = egnSum % 11 === 10 ? 0 : egnSum % 11;

    if (checksum === validChecksum) {
      return true;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} ${args.value} is not valid`;
  }

  private isValidDate(month: number, day: number, year: number): boolean {
    return !isNaN(new Date(year, month - 1, day).getTime());
  }
}
