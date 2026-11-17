'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackWebsiteEvent } from '@/lib/website-events-client';

export function WebsiteAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    if (!document.querySelector('script[data-cc-presence]')) { const script=document.createElement('script'); script.src='/cc-presence.js'; script.dataset.ccPresence='true'; script.defer=true; document.head.append(script); }
    window.dispatchEvent(new Event('cc:page'));
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
