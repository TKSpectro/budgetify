import LoginForm from '~/components/Auth/LoginForm';
import { CustomLink } from '~/components/UI/CustomLink';

export default function Login() {
  return (
    <div>
      <LoginForm />
      <CustomLink href="/auth/signup">No Account? No Problem! Signup</CustomLink>
    </div>
  );
}
