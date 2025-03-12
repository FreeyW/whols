import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-switch";
import { strEnv } from "@/lib/env";
import { inter } from "@/lib/fonts";
import PWAInstaller, { usePWAInstaller } from "@/components/PWAInstaller";

const siteTitle = strEnv("NEXT_PUBLIC_SITE_TITLE", "W.is Whois Lookup Tool");
const siteDescription = strEnv(
  "NEXT_PUBLIC_SITE_DESCRIPTION",
  "🧪 Your Next Generation Of Whois Lookup Tool With Modern UI. Support Domain/IPv4/IPv6/ASN/CIDR Whois Lookup And Powerful Features.",
);
const siteKeywords = strEnv(
  "NEXT_PUBLIC_SITE_KEYWORDS",
  "Whois, Lookup, Tool, W.is Whois UI",
);

export default function App({ Component, pageProps }: AppProps) {
  const { install } = usePWAInstaller();

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="tags" content={siteKeywords} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script defer data-domain="w.is" src="https://stat.re/js/script.js"></script>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Toaster />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {/* 已禁用PWA安装器
        <PWAInstaller
          manifest-url="/manifest.json"
          name="W.is Whois UI"
          description="🧪 Your Next Generation Of Whois Lookup Tool With Modern UI. Support Domain/IPv4/IPv6/ASN/CIDR Whois Lookup And Powerful Features."
        />
        */}
        <div className={cn(`relative w-full h-full`, inter.className)}>
          <div
            className={cn(
              `absolute w-full p-2 px-4 bg-background border-b select-none flex flex-row items-center z-50 space-x-2`,
            )}
          >
            <img
              src={`/icons/icon-192x192.png`}
              alt={``}
              className={`cursor-pointer w-10 h-10 p-1 shadow-sm bg-black border rounded-md transition hover:shadow`}
              onClick={() => {
                install(true);
              }}
            />
            <div className={`grow`} />
            <Link href="https://t.im" target="_blank" className="mr-2">
              <Button variant={`outline`} size={`icon`} tapEnabled>
                <img 
                  src="https://favicon.is/t.im" 
                  alt="IP Lookup" 
                  className="w-5 h-5" 
                  title="T.im Shortest URL shortener"
                />
              </Button>
            </Link>

            <Link href="https://ip.im" target="_blank" className="mr-2">
              <Button variant={`outline`} size={`icon`} tapEnabled>
                <img 
                  src="https://favicon.is/ip.im" 
                  alt="IP Lookup" 
                  className="w-5 h-5" 
                  title="IP address lookup"
                />
              </Button>
            </Link>

            <Link href="https://mr.email" target="_blank" className="mr-2">
              <Button variant={`outline`} size={`icon`} tapEnabled>
                <img 
                  src="https://favicon.is/mr.email" 
                  alt="IP Lookup" 
                  className="w-5 h-5" 
                  title="Temporary email service"
                />
              </Button>
            </Link>

            <Link href="https://dns.is" target="_blank" className="mr-2">
              <Button variant={`outline`} size={`icon`} tapEnabled>
                <img 
                  src="https://favicon.is/dns.is" 
                  alt="DNS Lookup" 
                  className="w-5 h-5" 
                  title="DNS lookup"
                />
              </Button>
            </Link>

            <Link href="https://pdf.is" target="_blank" className="mr-2">
              <Button variant={`outline`} size={`icon`} tapEnabled>
                <img 
                  src="https://favicon.is/pdf.is" 
                  alt="DNS Lookup" 
                  className="w-5 h-5" 
                  title="Free online PDF tools"
                />
              </Button>
            </Link>

            <Link href="https://trueurl.com" target="_blank" className="mr-2">
              <Button variant={`outline`} size={`icon`} tapEnabled>
                <img 
                  src="https://favicon.is/trueurl.com" 
                  alt="DNS Lookup" 
                  className="w-5 h-5" 
                  title="The free URL redirect checker"
                />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}
