import 'styles/globals.css';
import type { AppProps } from 'next/app';
import { GlobalApiInfoProvider } from 'context';
import { Toaster, TooltipProvider } from 'components';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import { dmSans } from 'config';
import Script from 'next/script';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { analytics } from 'helpers';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => analytics.page({ path: url });
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <main className={dmSans.variable}>
      <GlobalApiInfoProvider>
        <TooltipProvider>
          <Toaster />
          <ToastContainer
            style={{
              width: '400px',
              zIndex: 999999999,
            }}
            position='bottom-right'
            hideProgressBar={true}
            closeButton={false}
          />
          <Script src='https://www.googletagmanager.com/gtag/js?id=G-HQ5SB3JGGD' />
          <Script id='google-analytics'>
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-HQ5SB3JGGD');
        `}
          </Script>
          <Component {...pageProps} />
        </TooltipProvider>
      </GlobalApiInfoProvider>
    </main>
  );
}

export default MyApp;
