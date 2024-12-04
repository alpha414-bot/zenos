import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import Globe from "vanta/dist/vanta.globe.min";
import HALO from "vanta/dist/vanta.halo.min";
import NET from "vanta/dist/vanta.net.min";

interface ImagePropsType {
  height: number;
  className?: string | undefined;
  typeOfCanva?: "halo" | "net" | "globe";
  animationConfig?: VantaEffectOptions;
}

const Anime: React.FC<ImagePropsType> = ({
  // path,
  height,
  className,
  typeOfCanva = "halo",
  animationConfig,
}) => {
  const [vantaEffect, setVantaEffect] = useState<{ destroy: any } | null>(null);
  const myRef = useRef<HTMLDivElement>(null);
  const AnimationConfig = {
    ...{
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      // minHeight: 500.0,
      // minWidth: 100.0,
      scale: 1.0,
      scaleMobile: 1.0,
      color1: 0xffffff,
      color: 0xca4c04,
      color2: 0xff820c,
      // backgroundColor: 0x111827,
      backgroundColor: 0x030712,
      size: 1.1,
      yOffset: 0.16,

      // minHeight: 200.0,
      // minWidth: 200.0,
    },
    ...animationConfig,
  } as VantaEffectOptions;
  useEffect(() => {
    if (!vantaEffect) {
      if (typeOfCanva == "halo") {
        setVantaEffect(HALO({ ...{ el: myRef.current }, ...AnimationConfig }));
      } else if (typeOfCanva == "net") {
        setVantaEffect(NET({ ...{ el: myRef.current }, ...AnimationConfig }));
      } else if (typeOfCanva == "globe") {
        setVantaEffect(Globe({ ...{ el: myRef.current }, ...AnimationConfig }));
      }
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <>
      <div className="w-full h-full">
        <div
          ref={myRef}
          // className="rounded-lg min-w-full min-h-[35rem] md:min-h-[50rem]"
          className={classNames(
            `rounded-lg min-w-full min-h-[${height + 10}rem] md:min-h-[${
              height * 2
            }rem]`,
            className
          )}
        >
          <></>
        </div>
      </div>
    </>
  );
};

export default Anime;
