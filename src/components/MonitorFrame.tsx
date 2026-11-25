import { ReactNode, useEffect, useRef, useState } from 'react';

interface MonitorFrameProps {
  children: ReactNode;
}

const BASE_WIDTH = 1360;

export function MonitorFrame({ children }: MonitorFrameProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const unitRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [stageHeight, setStageHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const update = () => {
      if (!stageRef.current || !unitRef.current) return;
      const vw = window.innerWidth;
      if (vw <= 1024) {
        const available = Math.max(280, stageRef.current.clientWidth);
        const nextScale = Math.min(1, available / BASE_WIDTH);
        setScale(nextScale);
        requestAnimationFrame(() => {
          if (unitRef.current) {
            setStageHeight(Math.ceil(unitRef.current.getBoundingClientRect().height));
          }
        });
      } else {
        setScale(1);
        setStageHeight(undefined);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener('resize', update, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [children]);

  const isScaled = scale < 0.999;

  return (
    <div
      ref={stageRef}
      className="relative mx-auto mb-7 w-full max-w-[1440px] overflow-hidden"
      style={stageHeight ? { height: `${stageHeight}px` } : undefined}
    >
      <div
        ref={unitRef}
        className="flex flex-col items-center"
        style={
          isScaled
            ? {
                position: 'absolute',
                top: 0,
                left: '50%',
                width: `${BASE_WIDTH}px`,
                transform: `translateX(-50%) scale(${scale})`,
                transformOrigin: 'top center',
              }
            : { width: '100%' }
        }
      >
        <div className="monitor-bezel relative w-full rounded-[23px] border border-[#526171] p-[13px_13px_16px]">
          <span
            aria-hidden="true"
            className="absolute top-[5px] left-1/2 z-10 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#8fa0ad] ring-2 ring-[#1b2731]"
          />
          <section className="w-full overflow-hidden rounded-[11px] bg-white">{children}</section>
        </div>
        <div className="monitor-stand-neck relative -mt-px h-[58px] w-[18%] min-w-[130px] max-w-[260px]">
          <span className="monitor-stand-base absolute bottom-0 -left-[35%] block h-[9px] w-[170%] rounded-[50%_50%_8px_8px]" />
        </div>
      </div>
    </div>
  );
}
