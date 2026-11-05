import { AuthPage, PasswordResetForm } from 'components';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

const PasswordReset: NextPage<{
  token: string;
  email: string;
}> = (props) => {
  const router = useRouter();
  const title = Number(router.query['new-admin']) ? 'Create password' : 'Change password';

  return (
    <AuthPage title={title} heading={title}>
      <PasswordResetForm email={props.email} token={props.token} />
    </AuthPage>
  );
};

export default PasswordReset;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.query.token && context.query.email) {
    return {
      props: {
        token: context.query.token,
        email: context.query.email,
      },
    };
  }
  return {
    props: {},
    notFound: true,
  };
};
