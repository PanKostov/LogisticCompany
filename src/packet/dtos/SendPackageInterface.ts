export interface SendPackageInterface {
  senderId: number
  receiverId: number
  fromOfficeId?: number
  toOfficeId?: number
  fromAdress?: string
  toAdress?: string
  weight: number
  price?: number
  employeeId: number
  isRecieved: boolean
}
