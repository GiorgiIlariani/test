import { dmSans } from 'config';
import { isDev, isStaging } from 'helpers/checkEnvironment';
import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html className={dmSans.variable}>
      <Head>
        {isDev() && <link rel='icon' href='/favicon-work.ico' />}
        {isStaging() && <link rel='icon' href='/favicon-stage.ico' />}
      </Head>
      <body>
        <Main />
        <div id='modal_portal'></div>
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
