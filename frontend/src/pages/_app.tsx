import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { createGenerateClassName, createMuiTheme, StylesProvider } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import "@styles/fonts.css";
import "@styles/global.css";
//import theme from "@styles/theme";
import { AppProps } from "next/app";

const generateClassName = createGenerateClassName({
  productionPrefix: "c",
});

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Montserrat", "sans-serif"].join(","),
    h3: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontWeight: 900,
    },
    h6: {
      fontFamily: ["Playfair Display", "sans-serif"].join(","),
      fontWeight: 900,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        padding: "16px 32px",
        textTransform: "none",
      },
    },
  },
  palette: {
    primary: {
      main: "#065A5A",
    },
    secondary: {
      main: "#11cb5f",
    },
  },
  shape: {
    borderRadius: 0,
  },
  shadows: [
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ],
});

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  const link = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_BACKEND_URI,
    credentials: "include",
  });
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });
  return (
    <ApolloProvider client={client}>
      <StylesProvider generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </StylesProvider>
    </ApolloProvider>
  );
};

export default App;
