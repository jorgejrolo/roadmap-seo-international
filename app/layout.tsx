import './globals.css';

export const metadata = {
  title: 'Roadmap SEO Internacional — Jorge J. Rolo',
  description: 'Roadmap interactivo para SEO internacional con presets, checklist por mercado, evidencias, timeline y exportaciones.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
