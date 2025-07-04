// Image optimization utilities for better performance

/**
 * Lazy load images with intersection observer
 */
export const useLazyImage = (src, placeholder = '/assets/placeholder.jpg') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState(null);

  useEffect(() => {
    let observer;
    
    if (imageRef && imageSrc === placeholder) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, imageSrc, placeholder, src]);

  return [imageSrc, setImageRef];
};

/**
 * Generate responsive image srcSet
 */
export const generateImageSrcSet = (baseName, sizes = [400, 800, 1200]) => {
  return sizes
    .map(size => `/assets/images/${baseName}-${size}w.jpg ${size}w`)
    .join(', ');
};

/**
 * Optimized Image Component
 */
export const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = '/assets/placeholder.jpg',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
  const [imageSrc, imageRef] = useLazyImage(src, placeholder);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        sizes={sizes}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
};

/**
 * WebP Support Detection
 */
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

/**
 * Get optimized image URL based on device capabilities
 */
export const getOptimizedImageUrl = (imageName, format = 'jpg') => {
  const webpSupported = supportsWebP();
  const extension = webpSupported ? 'webp' : format;
  
  // Use CDN or optimized path
  return `/assets/images/optimized/${imageName}.${extension}`;
};