"use client";

import React, { useEffect, useRef, useState } from "react";
import useSticky from "@/hooks/use-sticky";

type IProps = {
  cls?: string;
  children: React.ReactNode;
};

export default function HeaderStickyWrapper({
  children,
  cls = "tp-header-mob-space tp-header-1",
}: IProps) {
  const { sticky } = useSticky();
  const innerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useEffect(() => {
    if (innerRef.current && !sticky) {
      setHeaderHeight(innerRef.current.offsetHeight);
    }
  }, [sticky]);

  return (
    <div
      className="tp-header-sticky-spacer"
      style={{ minHeight: sticky && headerHeight > 0 ? `${headerHeight}px` : undefined }}
    >
      <div
        ref={innerRef}
        id="header-sticky"
        className={`${cls} ${sticky ? "tp-header-sticky" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}
