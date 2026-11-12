import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
export const metadata: Metadata = {
  icons: {
    icon: "/brand/jeverly-butique.jpg",
    apple: "/brand/jeverly-butique.jpg",
  },
  title: "Jeverly Butique — прикраси з вашим характером",
  description:
    "Відкрийте світ Jeverly Butique. Прикраси для особливих митей і на щодень.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={styles.body}>{children}</body>
    </html>
  );
}
