import { firebase } from "@/firebase/config";
import { defineAction } from "astro:actions";
import { z } from "astro:content";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

export const loginWithGoogle = defineAction({
  accept: 'json',
  input: z.any(),
  handler: async (credentials) => {

    const credential = GoogleAuthProvider.credentialFromResult(credentials);
    
    if (!credential) {
      throw new Error("Google SignIn falló");
    }
    
    await signInWithCredential(firebase.auth, credential);
    
    return {
      success: true,
      message: "Inicio de sesión exitoso con Google",
    };
  },
});
