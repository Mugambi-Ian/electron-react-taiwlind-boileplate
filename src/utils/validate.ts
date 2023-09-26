export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const phoneRegex = /^.{0,10}$/;

export const stringRegex = /^.{0,3}$/;
export function validatePassword(p: string) {
  if (p.length <= 7) return false;
  return /^(?=.*[!@#$%^&*()\-_=+{}[\]:;<>,.?/~])(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/.test(
    p
  );
}
export function sanitizePhoneNumber(r: string) {
  let result = r.replace(/\D/g, '');
  if (result.length === 10) result = `+254${result.substring(1)}`;
  else if (result.includes('254')) result = `+${result}`;
  return result;
}
