import { loginUser, loginWithGoogle, logoutUser, registerUser } from "./auth";

export const server = {
  // actions

  //Auth
  registerUser,
  logoutUser,
  loginUser,
  loginWithGoogle

}