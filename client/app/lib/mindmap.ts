
import domtoimage from 'dom-to-image-more';
import { saveAs } from 'file-saver';

interface ToastOptions {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'loading';
}

const showToast = ({ message, duration = 3000, type = 'success' }: ToastOptions) => {
  // Remove any existing toasts
  const existingToasts = document.querySelectorAll('.mindmap-toast');
  existingToasts.forEach(toast => toast.remove());

  const toast = document.createElement('div');
  toast.className = `mindmap-toast fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300 ${
    type === 'success' ? 'bg-[#28a745] text-white' :
    type === 'error' ? 'bg-red-600 text-white' :
    'bg-[#28a745] text-white'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Only auto-remove for non-loading toasts
  if (type !== 'loading') {
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  return toast;
};

export const exportMindmapAsPng = async (element: HTMLElement, fileName: string) => {
  if (!element) throw new Error('No element provided for export');

  const loadingToast = showToast({
    message: 'Exporting mindmap...',
    type: 'loading'
  });

  try {
    // Apply a fixed background to ensure it's captured correctly
    const originalBackgroundColor = element.style.backgroundColor;
    element.style.backgroundColor = '#0f0f0f';

    // Use dom-to-image-more for better compatibility
    const blob = await domtoimage.toBlob(element, {
      width: element.offsetWidth * 2,
      height: element.offsetHeight * 2,
      style: {
        transform: 'scale(2)',
        transformOrigin: 'top left',
        width: `${element.offsetWidth}px`,
        height: `${element.offsetHeight}px`,
      },
      quality: 1,
      cacheBust: true,
    });

    // Restore the original background
    element.style.backgroundColor = originalBackgroundColor;

    // Save the blob as a file
    if (blob instanceof Blob) {
      saveAs(blob, `${fileName.replace(/\s+/g, '-').toLowerCase()}-mindmap.png`);
    }

    // Remove loading toast and show success
    document.body.removeChild(loadingToast);
    showToast({
      message: 'Mindmap exported successfully!',
      type: 'success',
      duration: 2000
    });
  } catch (error) {
    console.error('Error with dom-to-image export:', error);
    document.body.removeChild(loadingToast);
    
    // Try fallback method
    tryFallbackMethod(element, fileName, loadingToast);
  }
};

// Fallback method using canvas API directly
const tryFallbackMethod = async (element: HTMLElement, fileName: string, loadingToast: HTMLElement) => {
  showToast({
    message: 'Trying alternative export method...',
    type: 'loading'
  });
  
  try {
    // Create a canvas with the same dimensions as the element
    const canvas = document.createElement('canvas');
    const scale = 2; // Scale for higher resolution
    canvas.width = element.offsetWidth * scale;
    canvas.height = element.offsetHeight * scale;
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    // Set background color
    context.fillStyle = '#0f0f0f';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Convert the element to an SVG string
    const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.offsetWidth}" height="${element.offsetHeight}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${element.outerHTML}
        </div>
      </foreignObject>
    </svg>`;
    
    // Create a blob URL from the SVG data
    const svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svg);
    
    // Create an image from the SVG
    const img = new Image();
    
    // Set up the image onload handler
    img.onload = () => {
      // Scale and draw the image onto the canvas
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert the canvas to a blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${fileName.replace(/\s+/g, '-').toLowerCase()}-mindmap.png`);
          showToast({
            message: 'Mindmap exported with fallback method!',
            type: 'success',
            duration: 2000
          });
        } else {
          throw new Error('Canvas toBlob returned null');
        }
      });
      
      // Clean up
      URL.revokeObjectURL(url);
    };
    
    img.onerror = (error) => {
      console.error('Image creation error:', error);
      throw new Error('Failed to create image from SVG');
    };
    
    // Set the image source to the SVG blob URL
    img.src = url;
  } catch (finalError) {
    console.error('All export methods failed:', finalError);
    showToast({
      message: 'Export failed. Try using a browser screenshot instead.',
      type: 'error',
      duration: 4000
    });
  }
};