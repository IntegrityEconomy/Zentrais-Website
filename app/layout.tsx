import "./globals.css";
import Navbar from "../components/navbar";
import LanguageProviderWrapper from "../components/language-provider-wrapper";
import FloatingCTA from "../components/floating-cta";
import { Space_Grotesk, Playfair_Display, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Zentrais",
  description: "More than a social network!",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QW0W2XQB7Y"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QW0W2XQB7Y');
            `,
          }}
        />
      </head>
      <body className={`min-h-screen flex flex-col ${spaceGrotesk.variable} ${playfairDisplay.variable} ${inter.variable}`} style={{ backgroundColor: 'transparent' }}>
        <LanguageProviderWrapper>
          {/* NAVBAR */}
          <Navbar />

          {/* CONTENIDO PRINCIPAL */}
          <main className="flex-grow">{children}</main>

          {/* FLOATING CTA */}
          <FloatingCTA />
        </LanguageProviderWrapper>
      </body>
    </html>
  );
}
