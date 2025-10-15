import "@/styles/globals.css";
import "@/styles/forms/transfer.css";
import type { AppProps } from "next/app";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeContextProvider>
      <Component {...pageProps} />
    </ThemeContextProvider>
  );
}
