'use client';

import { useEffect } from 'react';

/** Tags <body> with the current page (page-home, page-lab, …), like the original templates did. */
export function BodyClass({ name }: { name: string }) {
  useEffect(() => {
    document.body.className = name;
  }, [name]);
  return null;
}
