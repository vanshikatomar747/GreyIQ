import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const cursorPositionRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Disallow custom cursor completely on mobile/tablet touch viewports
    if (!window.matchMedia('(min-width: 768px)').matches) {
      cursor.style.display = 'none';
      return;
    }

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseEnter = () => {
      cursor.style.display = 'block';
    };

    const handleMouseLeave = () => {
      cursor.style.display = 'none';
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId;

    const render = () => {
      // Smooth linear interpolation (lerp) to follow mouse with lag
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;
      
      const currentX = cursorPositionRef.current.x;
      const currentY = cursorPositionRef.current.y;

      // Update positions with 0.15 smoothing factor
      const newX = currentX + (targetX - currentX) * 0.15;
      const newY = currentY + (targetY - currentY) * 0.15;

      cursorPositionRef.current.x = newX;
      cursorPositionRef.current.y = newY;

      // Apply transform with hardware acceleration
      cursor.style.transform = `translate3d(${newX}px, ${newY}px, 0) translate3d(-50%, -50%, 0)`;

      animationFrameId = requestAnimationFrame(render);
    };

    // Start render loop
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed w-3.5 h-3.5 bg-secondary/20 border border-secondary/50 rounded-full pointer-events-none z-[9999] hidden md:block"
      style={{
        left: 0,
        top: 0,
        pointerEvents: 'none',
        transform: 'translate3d(-100px, -100px, 0) translate3d(-50%, -50%, 0)',
        willChange: 'transform',
      }}
    />
  );
}
