import type { Metadata } from "next";
import Font from "next/font/local";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const inter = Font({
  src: "../assets/fonts/Inter/Inter-VariableFont_slnt,wght.ttf",
});

export const metadata: Metadata = {
  title: "SIT Ice Breaker",
  description: "With ❤️ by CodeX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
