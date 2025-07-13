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
          <meta name="description" content="Sistema CRM para gestión de clientes de Compina" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Sistema CRM | Compina S.A.C.</title>
        </Head>
        <body>
          {children}
        </body>
      </html>
    </>
  );
}
