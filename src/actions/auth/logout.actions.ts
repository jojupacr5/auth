import { firebase } from "@/firebase/config";
import { defineAction } from "astro:actions";
import { signOut } from "firebase/auth";

export const logoutUser = defineAction({
  accept: 'json',
  handler: async (_, { cookies }) => {

    return await signOut(firebase.auth);
  },
});