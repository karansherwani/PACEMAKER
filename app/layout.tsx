import type { Metadata } from "next";
import "./globals.css";
import Provider from "./components/Provider";

export const metadata: Metadata = {
  title: "Adaptive Pace",
  description: "Adaptive learning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
