import { Office } from 'src/office/office.entity';

export interface SendPackageInterface {
  senderId: number;
  receiverId: number;
  fromOfficeId?: number;
  toOfficeId?: number;
  fromAdress?: string;
  toAdress?: string;
  weight: number;
  employeeId: number;
  isRecieved: boolean;
}
