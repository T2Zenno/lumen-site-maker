import * as React from "react";

export function useOrientation() {
  const [orientation, setOrientation] = React.useState<"portrait" | "landscape">("portrait");

  React.useEffect(() => {
    function updateOrientation() {
      if (window.matchMedia("(orientation: portrait)").matches) {
        setOrientation("portrait");
      } else {
        setOrientation("landscape");
      }
    }

    updateOrientation();

    window.addEventListener("orientationchange", updateOrientation);
    window.addEventListener("resize", updateOrientation);

    return () => {
      window.removeEventListener("orientationchange", updateOrientation);
      window.removeEventListener("resize", updateOrientation);
    };
  }, []);

  return orientation;
}
