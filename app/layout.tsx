import { Suspense, type ReactNode } from "react";
import { Short } from "./short";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Suspense fallback={null}>
          <Short />
        </Suspense>
      </body>
    </html>
  );
}
