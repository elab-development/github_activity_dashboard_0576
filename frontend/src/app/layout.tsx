import './globals.css';

export const metadata = {
  title: 'GitHub Activity Dashboard',
  description: 'Open-source JS GitHub Activity Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}