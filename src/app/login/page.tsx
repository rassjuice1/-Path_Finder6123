import GoogleSignIn from '@/components/auth/GoogleSignIn';

export const metadata = {
  title: 'Sign In - API Dashboard',
  description: 'Sign in to access your API Dashboard'
};

export default function LoginPage() {
  return <GoogleSignIn />;
}
