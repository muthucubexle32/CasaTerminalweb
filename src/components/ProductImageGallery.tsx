// src/components/ProductImageGallery.tsx
import { useState } from 'react';
import { ZoomIn } from 'lucide-react';

interface Props {
  images: string[];
  activeIndex: number;
  onThumbClick: (index: number) => void;
}

const ProductImageGallery = ({ images, activeIndex, onThumbClick }: Props) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Image with zoom */}
      <div
        className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[activeIndex]}
          alt="Product"
          className="w-full h-full object-cover transition-transform duration-200"
          style={isZoomed ? { transform: 'scale(2)', transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
        />
        <div className="absolute top-2 right-2 bg-white/70 p-1 rounded-full">
          <ZoomIn className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onThumbClick(idx)}
            className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
              activeIndex === idx ? 'border-secondary-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;