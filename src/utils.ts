import moment from "moment";

export function storeToken({expires_in, access_token, refresh_token}) {
  const startDate = moment.utc();
  const expirationDate = startDate.add(Number(expires_in), 'seconds');
  
  localStorage.setItem('webex_token', access_token);
  localStorage.setItem('expiration_date', expirationDate.format());
  localStorage.setItem('refresh_token', refresh_token);
}