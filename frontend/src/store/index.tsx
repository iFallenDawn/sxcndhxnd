import { atom } from '@tanstack/store'

export interface User {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  instagram: string,
  commissionIds: Array<String>,
  productIds: Array<String>
}