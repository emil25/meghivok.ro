import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = '',
  fallbackTitle,
  className = '',
  ...props
}) => {
  const [errorCount, setErrorCount] = useState(0);

  // If error happened twice, render styled CSS fallback container (Zero-Broken-Image Policy)
  if (errorCount >= 2 || !src) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#FAF8F5] via-[#F4EFEA] to-[#EBE3D9] border border-amber-900/10 text-stone-700 ${className}`}
      >
        <Sparkles className="w-6 h-6 text-amber-800/60 mb-1.5 shrink-0" />
        <span className="text-xs font-serif font-semibold text-stone-800 line-clamp-1">
          {fallbackTitle || alt || 'Meghívók.ro'}
        </span>
        <span className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">
          Prémium Kollekció
        </span>
      </div>
    );
  }

  const handleError = () => {
    // If the path was /images/..., try fallback to /src/assets/images/... or vice-versa
    setErrorCount(prev => prev + 1);
  };

  // Determine current try src
  let currentSrc = src;
  if (errorCount === 1) {
    if (src.startsWith('/images/')) {
      currentSrc = src.replace('/images/', '/src/assets/images/');
    } else if (src.startsWith('/src/assets/images/')) {
      currentSrc = src.replace('/src/assets/images/', '/images/');
    }
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
      {...props}
    />
  );
};
