export const renderCanvas = (
  canvas: HTMLCanvasElement | null,
  text: string,
  image: string,
  fontFamily: string,
  fontSize: number,
  showWatermark: boolean // 添加这个新参数来控制水印的显示
) => {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.onload = () => {
    const canvasWidth = 512;
    const scaleFactor = canvasWidth / img.width;
    const scaledHeight = img.height * scaleFactor;
    const lineHeight = 50;
    const imageLineHeight = lineHeight / scaleFactor;
    const lines = text.split('\n');
    canvas.width = canvasWidth;
    canvas.height = scaledHeight + (lines.length - 1) * lineHeight;

    ctx.drawImage(img, 0, 0, canvas.width, scaledHeight);
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    for (let i = 0; i < lines.length; i++) {
      if (i > 0) {
        const sx = 0;
        const sy = img.height - imageLineHeight;
        const sw = img.width;
        const sh = imageLineHeight;
        const dx = 0;
        const dy = scaledHeight + (i - 1) * lineHeight;
        const dw = canvas.width;
        const dh = lineHeight;
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      }
      const y = scaledHeight + i * lineHeight - (lineHeight - fontSize) / 2;
      ctx.fillText(lines[i], canvas.width / 2, y);
    }

    // 根据showWatermark决定是否绘制水印
    if (showWatermark) {
      const watermarkText = '由字幕生成器生成';
      const watermarkFontSize = 12;
      const watermarkOpacity = 0.5;
      const watermarkMargin = 10;
      ctx.font = `${watermarkFontSize}px Arial`;
      ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity})`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText(watermarkText, canvas.width - watermarkMargin, watermarkMargin);
    }
  };

  img.onerror = (err) => {
    console.error('Error loading image:', err);
  };
  img.src = image;
};