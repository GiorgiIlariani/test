import localFont from 'next/font/local';

// Fonts are self-hosted instead of using next/font/google, so the build doesn't
// depend on fetching from Google Fonts. next/font/google downloads the fonts during
// `next build`, and Google sometimes responds with font URLs that have no file
// extension, which Next fails to parse ("An error occurred in `next/font`. TypeError:
// Cannot read properties of null (reading '1')"). That made the CI build fail at
// random and pass again on a re-run.
const dmSans = localFont({
  src: '../assets/fonts/dm-sans/dm-sans-latin-wght-normal.woff2',
  weight: '100 1000',
  variable: '--font-dm-sans',
});

// Only used by the CV preview. It loads the same Poppins files the PDF renderer uses
// (see hooks/shared/useCvStyles), so the preview matches the generated CV PDF. Not
// preloaded, since it's only needed once the preview is opened.
const poppins = localFont({
  src: [
    { path: '../public/fonts/Poppins/Poppins-Light.ttf', weight: '300' },
    { path: '../public/fonts/Poppins/Poppins-Regular.ttf', weight: '400' },
    { path: '../public/fonts/Poppins/Poppins-SemiBold.ttf', weight: '600' },
    { path: '../public/fonts/Poppins/Poppins-Bold.ttf', weight: '700' },
  ],
  preload: false,
});

export { dmSans, poppins };
