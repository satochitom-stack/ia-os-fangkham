'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

type SpotlightProps = {
  className?: string;
  size?: number;
  fill?: string;
};

export function Spotlight({
  className,
  size = 280,
  fill = "white",
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        parent.style.position = 'relative';
        parent.style.overflow = 'hidden';
        setParentElement(parent);
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      setPos({
        x: event.clientX - left,
        y: event.clientY - top,
      });
    },
    [parentElement]
  );

  useEffect(() => {
    if (!parentElement) return;

    parentElement.addEventListener('mousemove', handleMouseMove);
    parentElement.addEventListener('mouseenter', () => setIsHovered(true));
    parentElement.addEventListener('mouseleave', () => setIsHovered(false));

    return () => {
      parentElement.removeEventListener('mousemove', handleMouseMove);
      parentElement.removeEventListener('mouseenter', () => setIsHovered(true));
      parentElement.removeEventListener('mouseleave', () =>
        setIsHovered(false)
      );
    };
  }, [parentElement, handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'pointer-events-none absolute rounded-full blur-xl mix-blend-screen transition-opacity duration-200 ease-out',
        isHovered ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        width: size,
        height: size,
        transform: `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2}px, 0)`,
        transition: 'transform 0.08s ease-out, opacity 0.2s ease',
        background: fill === "white"
          ? 'radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 15%, rgba(255, 255, 255, 0.45) 40%, rgba(255, 255, 255, 0.12) 65%, transparent 75%)'
          : `radial-gradient(circle at center, ${fill}, transparent 75%)`,
      }}
    />
  );
}

