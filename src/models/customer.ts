export interface ProloxCustomer {
  _id?: string;
  email?: string;
  fullName?: string;
  company?: string;
  phoneNumber?: string;
}

export class CustomerDTO implements Omit<ProloxCustomer, '_id'> {
  email: string = '';

  fullName: string = '';

  company: string = '';

  phoneNumber: string = '';
}
export type CustomerType = 'company' | 'individual';
