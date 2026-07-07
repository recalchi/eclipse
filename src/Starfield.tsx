import { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const surface = canvas;
    const context = ctx;

    let width = 0;
    let height = 0;
    let frame = 0;
    let animationId = 0;
    const stars = Array.from({ length: 170 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      r: index % 13 === 0 ? 1.8 : Math.random() * 1.1 + 0.35,
      s: Math.random() * 0.45 + 0.08,
    }));

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      surface.width = Math.floor(width * window.devicePixelRatio);
      surface.height = Math.floor(height * window.devicePixelRatio);
      surface.style.width = `${width}px`;
      surface.style.height = `${height}px`;
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    }

    function animate() {
      frame += 0.008;
      context.clearRect(0, 0, width, height);
      const gradient = context.createRadialGradient(width * 0.5, height * 0.42, 20, width * 0.5, height * 0.42, width * 0.8);
      gradient.addColorStop(0, "rgba(99, 83, 255, .22)");
      gradient.addColorStop(0.45, "rgba(12, 20, 46, .62)");
      gradient.addColorStop(1, "rgba(2, 5, 15, .96)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      stars.forEach((star, index) => {
        const x = (star.x * width + Math.sin(frame + index) * 10) % width;
        const y = (star.y * height + frame * star.s * 40) % height;
        const pulse = 0.45 + Math.sin(frame * 3 + index) * 0.35;
        context.beginPath();
        context.fillStyle = `rgba(238, 231, 255, ${Math.max(0.18, pulse)})`;
        context.arc(x, y, star.r, 0, Math.PI * 2);
        context.fill();
      });

      context.strokeStyle = "rgba(236, 211, 142, .24)";
      context.lineWidth = 1;
      context.beginPath();
      context.arc(width * 0.5, height * 0.48, Math.min(width, height) * 0.32, frame, frame + Math.PI * 1.65);
      context.stroke();

      animationId = requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="starfield" ref={canvasRef} aria-hidden="true" />;
}
