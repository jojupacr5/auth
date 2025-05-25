import { defineAction } from "astro:actions";
import { z } from "astro:content";

import { firebase } from "@/firebase/config";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";

export const loginUser = defineAction({
  accept: 'form',
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ email, password, remember_me }, { cookies }) => {

    // Cookies
    if( remember_me ) {
      cookies.set('email', email, {
        expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000), // 1 año
        path: '/',
      })
    } else {
      cookies.delete('email', {
        path: '/',
      });
    }

    // Login de usuario
    try {

      const user = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      )

      return { ok: true, message: 'Usuario logeado correctamente' };
      
    } catch (error) {
      const firebaseError = error as AuthError;

      if(firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('El correo ya está en uso');
      }
      if(firebaseError.code === 'auth/wrong-password') {
        throw new Error('La contraseña es incorrecta');
      }

      throw new Error('Auxilio! algo salió mal');
    }
  },
});