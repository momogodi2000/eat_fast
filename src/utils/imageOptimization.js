// Image optimization utilities for better performance

/**
 * Lazy load images with intersection observer
 */
<<<<<<< HEAD
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
=======
export const useLazyImage = (src, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: options.rootMargin || '50px 0px',
        threshold: options.threshold || 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [options.rootMargin, options.threshold]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = src;
  }, [isInView, src]);

  return { imgRef, isLoaded, isInView };
>>>>>>> Divinson-NewIUX
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
<<<<<<< HEAD
};
=======
};

// Image Optimization Utility
class ImageOptimizer {
  constructor() {
    this.supportedFormats = ['webp', 'avif', 'jpeg', 'jpg', 'png'];
    this.breakpoints = {
      xs: 480,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    };
  }

  // Check if WebP is supported
  isWebPSupported() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // Check if AVIF is supported
  isAVIFSupported() {
    return new Promise((resolve) => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 1);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }

  // Get optimal image format
  async getOptimalFormat() {
    if (await this.isAVIFSupported()) return 'avif';
    if (await this.isWebPSupported()) return 'webp';
    return 'jpeg';
  }

  // Generate responsive image URLs
  generateResponsiveUrls(imagePath, customBreakpoints = {}) {
    const breakpoints = { ...this.breakpoints, ...customBreakpoints };
    const urls = {};

    Object.entries(breakpoints).forEach(([size, width]) => {
      urls[size] = this.resizeImage(imagePath, width);
    });

    return urls;
  }

  // Resize image URL (placeholder for actual implementation)
  resizeImage(imagePath, width) {
    // In a real implementation, this would use a CDN or image service
    // For now, we'll return the original path
    return imagePath;
  }

  // Lazy load image with intersection observer
  lazyLoadImage(imgElement, src, srcset = null, sizes = null) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (srcset) {
            img.srcset = srcset;
          }
          if (sizes) {
            img.sizes = sizes;
          }
          img.src = src;
          
          img.classList.remove('lazy');
          img.classList.add('loaded');
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    observer.observe(imgElement);
  }

  // Create optimized image element
  createOptimizedImage({
    src,
    alt = '',
    className = '',
    width = null,
    height = null,
    lazy = true,
    responsive = false,
    customBreakpoints = {},
    sizes = null
  }) {
    const img = document.createElement('img');
    
    if (alt) img.alt = alt;
    if (className) img.className = className;
    if (width) img.width = width;
    if (height) img.height = height;
    
    if (lazy) {
      img.classList.add('lazy');
      img.dataset.src = src;
      
      if (responsive) {
        const responsiveUrls = this.generateResponsiveUrls(src, customBreakpoints);
        const srcset = Object.entries(responsiveUrls)
          .map(([size, url]) => `${url} ${this.breakpoints[size]}w`)
          .join(', ');
        
        img.dataset.srcset = srcset;
        img.sizes = sizes || '(max-width: 768px) 100vw, 50vw';
      }
      
      // Add loading animation
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease-in-out';
      
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
      
      this.lazyLoadImage(img, src, img.dataset.srcset, img.sizes);
    } else {
      img.src = src;
      if (responsive) {
        const responsiveUrls = this.generateResponsiveUrls(src, customBreakpoints);
        const srcset = Object.entries(responsiveUrls)
          .map(([size, url]) => `${url} ${this.breakpoints[size]}w`)
          .join(', ');
        
        img.srcset = srcset;
        img.sizes = sizes || '(max-width: 768px) 100vw, 50vw';
      }
    }
    
    return img;
  }

  // Compress image using Canvas API
  async compressImage(file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Convert image to different format
  async convertImageFormat(file, format = 'webp', quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, `image/${format}`, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Generate placeholder image
  generatePlaceholder(width, height, color = '#f3f4f6', text = '') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    
    // Add text if provided
    if (text) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);
    }
    
    return canvas.toDataURL();
  }

  // Preload critical images
  preloadImages(imageUrls) {
    imageUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // Get image dimensions
  getImageDimensions(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight
        });
      };
      img.src = src;
    });
  }

  // Create blur-up effect
  createBlurUpEffect(originalSrc, placeholderSrc, container) {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.overflow = 'hidden';
    
    const placeholder = document.createElement('img');
    placeholder.src = placeholderSrc;
    placeholder.style.position = 'absolute';
    placeholder.style.top = '0';
    placeholder.style.left = '0';
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    placeholder.style.filter = 'blur(10px)';
    placeholder.style.transform = 'scale(1.1)';
    
    const mainImage = document.createElement('img');
    mainImage.src = originalSrc;
    mainImage.style.position = 'relative';
    mainImage.style.zIndex = '1';
    mainImage.style.opacity = '0';
    mainImage.style.transition = 'opacity 0.3s ease-in-out';
    
    mainImage.onload = () => {
      mainImage.style.opacity = '1';
    };
    
    wrapper.appendChild(placeholder);
    wrapper.appendChild(mainImage);
    
    if (container) {
      container.appendChild(wrapper);
    }
    
    return wrapper;
  }
}

// Create singleton instance
const imageOptimizer = new ImageOptimizer();

export default imageOptimizer;
>>>>>>> Divinson-NewIUX
