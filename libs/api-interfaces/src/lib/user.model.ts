import { Company } from './company.model';
import { UserAddress } from './user-address.model';

export interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  address: UserAddress;
  phone: string;
  website: string;
  company: Company;
}
