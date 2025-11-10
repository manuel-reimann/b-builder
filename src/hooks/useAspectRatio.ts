import { useEffect, useState } from "react";

export function useAspectRatio(minWidth = 1024, minRatio = 1.3) {
  const [isTooNarrow, setIsTooNarrow] = useState(false);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const ratio = w / h;
      setIsTooNarrow(w < minWidth || ratio < minRatio);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [minWidth, minRatio]);

  return isTooNarrow;
}
