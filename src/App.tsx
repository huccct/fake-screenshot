import { useEffect, useRef, useState } from 'react';

const quotes = ['人生就像一杯茶\n不会苦一辈子\n但总会苦一阵子'];

function App() {
  const [text, setText] = useState('');
  const [image, setImage] = useState('/assets/郭德纲.jpg');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const canvasWidth = 512;
      const scaleFactor = canvasWidth / img.width;
      const scaledHeight = img.height * scaleFactor;
      const lineHeight = 50;
      const fontSize = 20;
      const imageLineHeight = lineHeight / scaleFactor;
      const lines = text.split('\n');
      canvas.width = canvasWidth;
      canvas.height = scaledHeight + (lines.length - 1) * lineHeight;

      ctx.drawImage(img, 0, 0, canvas.width, scaledHeight);
      ctx.font = `${fontSize}px Arial`;
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
    };
    img.src = image;
  };

  useEffect(() => {
    renderCanvas(text || quotes[Math.floor(Math.random() * quotes.length)]);
  }, [text, image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImage(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="container mx-auto max-w-5xl min-w-fit">
      <header className="bg-blue-500 text-white p-10 text-center">
        <h1 className="text-4xl font-bold mb-10">字幕截图生成器</h1>
        <p className="text-xl">"都有截图了一定是真的"</p>
      </header>

      <main className="flex flex-wrap justify-center">
        <div className="column bg-white p-6 rounded shadow" style={{ width: 512 }}>
          <label htmlFor="image-select" className="block text-lg font-medium mb-2">
            选择英雄
          </label>
          <select
            id="image-select"
            className="w-full p-2 border rounded mb-4"
            value={image}
            onChange={handleImageChange}
          >
            <option value="/assets/郭德纲.jpg">郭德纲</option>
            <option value="/assets/刘能.jpg">刘能</option>
            <option value="/assets/鲁迅.jpg">鲁迅</option>
            <option value="/assets/罗永浩.jpg">罗永浩</option>
            <option value="/assets/马斯克.jpg">马斯克</option>
            <option value="/assets/马云.jpg">马云</option>
            <option value="/assets/莫言.jpg">莫言</option>
            <option value="/assets/乔布斯.jpg">乔布斯</option>
            <option value="/assets/杨澜.jpg">杨澜</option>
            <option value="/assets/于丹.jpg">于丹</option>
          </select>

          <label
            htmlFor="image-upload"
            className="block text-lg font-medium mb-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded cursor-pointer transition-colors duration-300 ease-in-out hover:bg-blue-600"
          >
            上传本机英雄
          </label>
          <input type="file" id="image-upload" className="hidden" onChange={handleImageUpload} />

          <label htmlFor="text-input" className="block text-lg font-medium mb-2">
            台词（一排不要太长了）
          </label>
          <textarea
            id="text-input"
            rows={8}
            className="w-full p-2 border rounded mb-4"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={quotes[Math.floor(Math.random() * quotes.length)]}
          ></textarea>

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleSaveClick}
          >
            保存图片
          </button>
        </div>

        <div className="column bg-white rounded shadow" style={{ width: 512 }}>
          <canvas ref={canvasRef} className="w-full h-auto border rounded"></canvas>
        </div>
      </main>
    </div>
  );
}

export default App;
