import { AppProps } from "next/app";
import "../styles/fonts.css";
import "../styles/global.css";
import { ThemeProvider } from "styled-components";
import theme from "../styles/theme";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    );
};

export default App;
