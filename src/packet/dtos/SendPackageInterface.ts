export interface SendPackageInterface {
  senderId: number
  receiverId: number
  fromOfficeId?: number
  toOfficeId?: number
  fromAddress?: string
  toAddress?: string
  weight: number
  employeeId: number
  isReceived: boolean
}
