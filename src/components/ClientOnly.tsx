import React, { useEffect, useState } from 'react';

/**
 * Component which can wrap children which just just be rendered client-side and not server-side
 */
export function ClientOnly({ children, ...delegated }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...delegated}>{children}</div>;
}
