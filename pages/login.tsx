import { AuthPage, LoginForm } from 'components';
import { NextPage } from 'next';

const Login: NextPage = () => {
  return (
    <AuthPage title='Login' heading='Welcome to the gates, human'>
      <LoginForm />
    </AuthPage>
  );
};

export default Login;
