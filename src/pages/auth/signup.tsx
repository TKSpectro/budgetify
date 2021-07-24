import SignupForm from '~/components/Auth/SignupForm';
import { CustomLink } from '~/components/UI/CustomLink';

export default function Signup() {
  return (
    <div>
      <SignupForm />
      <CustomLink href="/auth/login">Do you already have an account? Login</CustomLink>
    </div>
  );
}
