import { Lexend } from "next/font/google";
import { getServerSession } from "next-auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { authOptions } from "@/lib/auth";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Listfy",
  description: "Find the best businesses in your city",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${lexend.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <AuthProvider session={session}>
          <Header />
          <div className="flex min-h-full flex-1 flex-col">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
