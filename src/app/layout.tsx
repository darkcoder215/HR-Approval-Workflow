import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: "نموذج طلب فتح شاغر وظيفي | ثمانية",
  description: "منظومة اعتماد الشواغر الوظيفية — كل شاغر تفتحه هو قرار استثماري",
  icons: { icon: "/thamanyah.png" },
};

// Inline pre-paint script: read the saved theme and apply it to <html> before
// any content renders. Prevents a classic→bold flash on first load.
const themeInitScript = `
try {
  var t = localStorage.getItem("thmanyah-theme");
  if (t !== "bold" && t !== "classic") t = "classic";
  document.documentElement.setAttribute("data-theme", t);
} catch (e) {
  document.documentElement.setAttribute("data-theme", "classic");
}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" data-theme="classic">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-thmanyah-off-white text-thmanyah-black antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
