'use server'

import { signIn } from '@/auth.config';
import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    
    await signIn('credentials', Object.fromEntries(formData));
      
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return 'Invalid credentials'
  }
}