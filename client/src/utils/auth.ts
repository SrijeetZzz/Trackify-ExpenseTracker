import {jwtDecode} from "jwt-decode";
interface TokenPayload{
  email:string,
  userId:string,
  exp:number,
  name:string,
  iat:number,
}


export const useAuth = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (decoded.exp * 1000 < Date.now()) {
      return null; 
    }
    return decoded;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
};
