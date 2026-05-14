"use client";

import { useEffect, useState, useRef } from "react";
import { animate } from "framer-motion";

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

export function Counter({ 
  value, 
  prefix = "", 
  suffix = "", 
  decimals = 0,
  duration = 1.5 
}: CounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const controls = animate(prevValueRef.current, value, {
      duration,
      ease: "easeOut",
      onUpdate(v) {
        setDisplayValue(v);
      }
    });

    prevValueRef.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
