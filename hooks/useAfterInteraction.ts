import { useEffect, useState } from "react";

export function useDeferredRender(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Tunda ke frame berikutnya agar screen shell bisa paint dulu
    const id = requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  return isReady;
}
