// components/NavigationElement.tsx
import { FadeOverlayLeft, FadeOverlayRight, NextButton, PrevButton } from "@styles/common/SliderStyles";
interface SliderNavProps {
  isVisible: boolean;
  direction: "prev" | "next";
  onClick: () => void;
}

export default function SliderNav({
  isVisible,
  direction,
  onClick,
}: SliderNavProps) {
  return (
    <>
      {direction === "prev" ? (
        <>
          <PrevButton
            onClick={isVisible ? onClick : undefined}
            style={{ opacity: isVisible ? 1 : 0, zIndex: isVisible ? 1 : -1 }}
          />
          <FadeOverlayLeft style={{ opacity: isVisible ? 1 : 0 }} />
        </>
      ) : (
        <>
          <NextButton
            onClick={isVisible ? onClick : undefined}
            style={{ opacity: isVisible ? 1 : 0, zIndex: isVisible ? 1 : -1 }}
          />
          <FadeOverlayRight style={{ opacity: isVisible ? 1 : 0 }} />
        </>
      )}
    </>
  );
}
