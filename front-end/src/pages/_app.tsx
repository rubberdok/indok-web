import { AppProps } from "next/app";
import "../styles/global.css";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <>
            <Component {...pageProps} />
        </>
    );
};

export default App;
