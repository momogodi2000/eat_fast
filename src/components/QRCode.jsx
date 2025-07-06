import React, { useEffect, useRef } from 'react';

const QRCode = ({ value, size = 128, className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const generateQRCode = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const qrSize = size;
      
      // Clear canvas
      ctx.clearRect(0, 0, qrSize, qrSize);
      
      // Simple QR code pattern (for demo purposes)
      // In production, you'd use a proper QR code library like qrcode.js
      const cellSize = qrSize / 25;
      
      // Generate a simple pattern based on the value
      const hash = value.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      ctx.fillStyle = '#000000';
      
      // Create a simple QR-like pattern
      for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
          // Create a deterministic pattern based on hash
          const shouldFill = (hash + i * 25 + j) % 3 === 0;
          if (shouldFill) {
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
          }
        }
      }
      
      // Add corner squares (QR code positioning patterns)
      ctx.fillStyle = '#000000';
      // Top-left corner
      ctx.fillRect(0, 0, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cellSize, cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(2 * cellSize, 2 * cellSize, 3 * cellSize, 3 * cellSize);
      
      // Top-right corner
      ctx.fillStyle = '#000000';
      ctx.fillRect(18 * cellSize, 0, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(19 * cellSize, cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(20 * cellSize, 2 * cellSize, 3 * cellSize, 3 * cellSize);
      
      // Bottom-left corner
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 18 * cellSize, 7 * cellSize, 7 * cellSize);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cellSize, 19 * cellSize, 5 * cellSize, 5 * cellSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(2 * cellSize, 20 * cellSize, 3 * cellSize, 3 * cellSize);
    };

    generateQRCode();
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={`border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
    />
  );
};

export default QRCode; 