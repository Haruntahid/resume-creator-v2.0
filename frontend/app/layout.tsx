import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { config } from "@/lib/config";
import Maintenance from "@/components/Maintenance";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `${config.projectName} - Create Professional Resumes`,
  description: "Build beautiful, professional resumes with AI-powered features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check maintenance mode
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {isMaintenanceMode ? (
              <Maintenance />
            ) : (
              /* Normal Application */
              <>
                {children}
                <Toaster />
              </>
            )}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
