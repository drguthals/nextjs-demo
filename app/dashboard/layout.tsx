import SideNav from '@/app/ui/dashboard/sidenav';
import Script from 'next/script';
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
      <Script
        src="https://browser.sentry-cdn.com/sentry-toolbar/latest/toolbar.min.js" 
        strategy='beforeInteractive'
      />
    </div>
  );
}