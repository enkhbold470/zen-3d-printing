import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import {
  ClerkProvider,
  // SignInButton,
  // SignedIn,
  // SignedOut,
  // UserButton,
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Zen 3D Printing Service",
  description: "Your one-stop solution for 3D printing needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          <header>
            <Header />
            {/* <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn> */}
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
