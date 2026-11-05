import { AuthPage } from 'components';

const VerifyNotice = () => {
  return (
    <AuthPage title='Verify notice'>
      <img src='/images/mailbox.gif' alt='mailbox animation' />
      <h1 className='text-2xl font-bold text-center mb-2'>Prove yourself, please</h1>
      <p className='text-center'>Check your virtual mail box and follow the clues</p>
    </AuthPage>
  );
};

export default VerifyNotice;
