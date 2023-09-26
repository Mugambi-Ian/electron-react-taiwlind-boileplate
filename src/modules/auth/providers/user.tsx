import { useMemo, useState, type ReactNode } from 'react';
import { nullUser, UserContext } from '../context/user';

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [fields, setFields] = useState(nullUser);
  const values = useMemo(() => ({ fields, setFields }), [fields]);
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
}
