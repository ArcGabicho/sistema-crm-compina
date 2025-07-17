import { Poppins } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="es" className={`${poppins.variable}`}>
        <Head>
          <meta name="viewport" content="width=device-width" />
          <meta name="title" content="Sistema CRM | Compipro S.A.C." />
          <meta name="description" content="Sistema CRM para gestión de clientes de Compina con capacidad de gestión de 6000 clientes en tiempo real." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="author" content="Gabriel Polack"/>
          <meta name="image" content="https://i.imgur.com/RYfsVS9.png" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://astro-compipro-page.pages.dev/" />
          <meta property="og:title" content="Sistema CRM | Compipro S.A.C." />
          <meta property="og:description" content="Sistema CRM para gestión de clientes de Compina con capacidad de gestión de 6000 clientes en tiempo real."/>
          <meta property="og:image" content="https://i.imgur.com/RYfsVS9.png"/>
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://astro-compipro-page.pages.dev/"/>
          <meta property="twitter:title" content="Sistema CRM | Compipro S.A.C." />
          <meta property="twitter:description" content="Sistema CRM para gestión de clientes de Compina con capacidad de gestión de 6000 clientes en tiempo real."/>
          <meta property="twitter:image" content="https://i.imgur.com/RYfsVS9.png"/>
          <link rel="icon" type="image/svg+xml" href="/logo-compipro.png" />
          <title>Sistema CRM | Compina S.A.C.</title>
        </Head>
        <body>
          {children}
        </body>
      </html>
    </>
  );
}
