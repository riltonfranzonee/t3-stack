import "../../styles/globals.css";
import "@fontsource/poppins";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { ServerRouter } from "@/server/router";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withTRPC<ServerRouter>({
  config() {
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return { url };
  },
  ssr: true,
})(App);
