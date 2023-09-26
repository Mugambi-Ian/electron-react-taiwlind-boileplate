import { createContext, useContext } from 'react';
import type { ProloxUser } from '../../../models/users';
import type { ProloxStore } from '@/models/store';

export interface UserFields extends ProloxUser {
  sessionToken: string;
  stores: ProloxStore[];
  password: string;
  confirm: string;
  update: string;
  otp: string;
}
interface UserContextValues {
  fields: UserFields;
  setFields: (x: UserFields) => void;
}

export const nullUser: UserFields = {
  otp: '',
  email: '',
  stores: [],
  update: '',
  confirm: '',
  fullName: '',
  password: '',
  phoneNumber: '',
  sessionToken: '',
};

export const UserContext = createContext<UserContextValues>({
  fields: nullUser,
  setFields: (x) => x,
});

export const useUserContext = () => useContext(UserContext);
