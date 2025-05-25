
import { defineAction } from "astro:actions";
import { z } from 'astro:schema';

import { firebase } from "@/firebase/config";
import { createUserWithEmailAndPassword, type AuthError } from "firebase/auth";

export const registerUser = defineAction({ 
  accept: 'form',
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({name, email, password, remember_me}, {cookies}) => {
    
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

    // Creacion de usuario
    try {

      const user = await createUserWithEmailAndPassword( 
        firebase.auth, 
        email, 
        password 
      );

      // Actializar el nombre de usuario

      // Verificar el correo

      // return user;
      return { ok: true, message: 'Usuario registrado correctamente' };

    } catch (error) {
      const firebaseError = error as AuthError;

      if(firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('El correo ya está en uso');
      }
      
      throw new Error('Auxilio! algo saliò mal');
    }
  },
})