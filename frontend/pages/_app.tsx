import * as Sentry from "@sentry/browser";
import splitbee from '@splitbee/web';
import SuperTokensReact from 'supertokens-auth-react';
import SessionReact from 'supertokens-auth-react/recipe/session';
import EmailPasswordReact from 'supertokens-auth-react/recipe/emailpassword';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactElement, ReactNode } from 'react';
import { extendTheme } from "@chakra-ui/react";
import { myColors } from '../theme/theme';

if (process.env.NEXT_PUBLIC_WEBSITE_DOMAIN !== "http://localhost:3000") {
  Sentry.init({ dsn: process.env.DSN_GLITCHTIP }); // This initiliazes sentry 
  splitbee.init({ // This initiliazes Splitbee.js
    scriptUrl: "/bee.js",
    apiUrl: "/_hive",
  })
}


type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

if (typeof window !== 'undefined') {
  // we only want to call this init function on the frontend, so we check typeof window !== 'undefined'
  SuperTokensReact.init({
    appInfo: {
      appName: "lupax",
      apiDomain: `${process.env.NEXT_PUBLIC_URL_BASE_API}`,
      websiteDomain: `${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}`,
      apiBasePath: "/api/auth",
      websiteBasePath: "/auth/login"
    },
    recipeList: [
      SessionReact.init(),
      EmailPasswordReact.init()
    ]
  });
}


export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  const theme = extendTheme({
    colors: myColors
  })

  return getLayout(
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
