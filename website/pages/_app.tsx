import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { Box, LinearProgress } from "@material-ui/core";
import { IntrospectionQuery, buildClientSchema } from "graphql";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue, green, red } from "@material-ui/core/colors";

import CssBaseline from "@material-ui/core/CssBaseline";
import Head from "next/head";
import Page from "../components/Page";
import React from "react";
import { createUploadLink } from "apollo-upload-client";
import introspectionResult from "../lib/graphql/generated/graphql.schema.json";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import usePaletteType from "../lib/usePaletteType";
import withApollo from "next-with-apollo";
import { withScalars } from "apollo-link-scalars";

const schema = buildClientSchema(
  (introspectionResult as unknown) as IntrospectionQuery
);

function App({ Component, pageProps, apollo }) {
  // const [paletteType] = usePaletteType();
  const paletteType = "dark";

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: paletteType,
          primary: blue,
          secondary: green,
          error: {
            main: red[200],
          },
        },
      }),
    [paletteType]
  );

  return (
    <ApolloProvider client={apollo}>
      <ThemeProvider theme={theme}>
        <Page>
          <Head>
            <title>Worms League</title>
          </Head>
          <CssBaseline />
          {/* <Box position="fixed" top={0} zIndex={1200} width="100%">
            <LinearProgress color="primary" />
          </Box> */}
          <Component {...pageProps} />
        </Page>
      </ThemeProvider>
    </ApolloProvider>
  );
}

const uploadLink = createUploadLink({
  credentials: "include",
  uri: "/api/graphql",
  fetchOptions: {
    credentials: "inlude",
  },
});

const typesMap = {
  DateTime: {
    serialize: (date: Date) => date.toISOString(),
    parseValue: (raw: string | number | null): Date | null => {
      return raw ? new Date(raw) : null;
    },
  },
};

const link = ApolloLink.from([
  withScalars({ schema, typesMap }),
  (uploadLink as unknown) as ApolloLink,
]);

export default withApollo(({ initialState }) => {
  return new ApolloClient({
    cache: new InMemoryCache().restore(initialState || {}),
    link,
  });
})(App);
