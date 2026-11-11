'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackWebsiteEvent } from '@/lib/website-events-client';

export function WebsiteAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    const track = () => {
      trackWebsiteEvent('session_started');
      if (/^\/shop\/[^/]+$/.test(pathname ?? '')) trackWebsiteEvent('product_viewed');
    };
    track();
    window.addEventListener('goool:marketing-consent', track);
    return () => window.removeEventListener('goool:marketing-consent', track);
  }, [pathname]);
  return null;
}
