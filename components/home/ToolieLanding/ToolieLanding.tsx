import { Props } from './types';
import React from 'react';
import { ToolieLandingFooter, Services, AboutToolie, ToolieLandingHero } from 'components';
import Head from 'next/head';

const ToolieLanding: React.FC<Props> = () => {
  return (
    <div>
      <Head>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <title>
          Skippit app - Manage and forecast agency resources, projects, traffic, utilization and
          profitability in real-time with a single platform.{' '}
        </title>
        <meta
          name='description'
          content='Manage and forecast agency resources, projects, traffic, utilization and profitability in real-time with a single platform.'
        />
        <meta name='robots' content='all' />
        <meta property='og:title' content='Skippit app - Manage and forecast agency resources' />
        <meta
          property='og:description'
          content='Manage and forecast agency resources, projects, traffic, utilization and profitability in real-time with a single platform.'
        />
        <meta property='og:url' content='https://www.skippit.io' />
        <meta property='og:type' content='website' />
      </Head>
      <main className='overflow-x-hidden'>
        <ToolieLandingHero />
        <Services />
        <AboutToolie />
        <ToolieLandingFooter />
      </main>
    </div>
  );
};

export default ToolieLanding;
