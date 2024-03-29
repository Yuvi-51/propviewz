import Footer from "@/components/footer/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./globals.scss";
import { Providers } from "./providers";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_HOST),
  title: {
    default: "Know actual selling prices & user reviews - Projects across Pune",
    template: "%s | Know actual selling prices & user reviews",
  },
  description:
    "PropViewz displays real reviews and recent transactions happening in projects enabling you to negotiate confidently. No more scams in finding dream home!",
  openGraph: {
    title: "Know actual selling prices & user reviews - Projects across Pune",
    description:
      "PropViewz displays real reviews and recent transactions happening in projects enabling you to negotiate confidently. No more scams in finding dream home!",
    images: ["/assets/seo/og-image.png"],
  },
  keywords:
    "Real Estate Reviews, Last Transaction Price, Location Based Reviews",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "de-DE": "/de-DE",
    },
  },
};

const inter = Inter({ subsets: ["latin"] });

export const revalidate = 86400; // revalidate at most every day

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      {process.env.NEXT_PUBLIC_HOST === "https://propviewz.com" && (
        <head>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-2MBQNTL2NC"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag() {
                dataLayer.push(arguments);
              }
              gtag("js", new Date());
              gtag("config", "G-2MBQNTL2NC");
            `,
            }}
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.fbAsyncInit = function() {
                FB.init({
                  appId      : '690887753209871',
                  cookie     : true,
                  xfbml      : true,
                  version    : 'v19.0'
                });
                    
                FB.AppEvents.logPageView();   
              };
              (function(d, s, id){
                 var js, fjs = d.getElementsByTagName(s)[0];
                 if (d.getElementById(id)) {return;}
                 js = d.createElement(s); js.id = id;
                 js.src = "https://connect.facebook.net/en_US/sdk.js";
                 fjs.parentNode.insertBefore(js, fjs);
               }(window.document, 'script', 'facebook-jssdk'));
            `,
            }}
          />
          <script async src="https://connect.facebook.net/en_US/fbevents.js" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '751638016578222');
              fbq('track', 'PageView');
            `,
            }}
          />

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: `
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://www.propviewz.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.propviewz.com?g_search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }
          `,
            }}
          />

          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=751638016578222&ev=PageView&noscript=1"
            />
          </noscript>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-2MBQNTL2NC"
          />
        </head>
      )}
      <body>
        <Providers>
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
