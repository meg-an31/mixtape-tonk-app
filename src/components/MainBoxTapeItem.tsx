import React, { useMemo, useState } from 'react';
import { TapeObject, textObject, imageObject, linkObject, PaletteObject } from '../types/ScrollBoxData';
import DraggableWrapper from './ObjectComponent';

interface MainBoxTapeItemProps {
  item: PaletteObject;
  itemId: string; // The actual ID used in mainBoxItems
  position: { top: number; left: number };
  scale?: number; // Scale factor for the object
  width?: number; // Container width
  height?: number; // Container height
  onPositionChange: (id: string, position: { top: number; left: number }) => void;
  onScaleChange?: (id: string, scale: number) => void;
  onDimensionChange?: (id: string, dimensions: { width?: number; height?: number }) => void;
}

const MainBoxTapeItem: React.FC<MainBoxTapeItemProps> = ({ 
  item, 
  itemId, 
  position, 
  scale = 1.0, 
  width, 
  height, 
  onScaleChange, 
  onDimensionChange 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingResize, setIsDraggingResize] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const renderObjectContent = () => {
    if (!("url" in item) && !("blob" in item)) {
      const textObj = item as textObject;
      return (
        <span 
          className="text-sm font-medium"
          style={{ color: textObj.textColour }}
        >
          {textObj.text}
        </span>
      );
    } else if ('url' in item) {
      const linkObj = item as linkObject;
      return (
        <a 
          href={linkObj.url}
          className="text-sm font-medium underline hover:no-underline"
          style={{ color: linkObj.textColour }}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {linkObj.text ? linkObj.text : linkObj.url}
        </a>
      );
    } else if ('blob' in item) {
      const imageObj = item as imageObject;
      
      const imageUrl = useMemo(() => {
        const uint8Array = new Uint8Array(imageObj.blob);
        if (uint8Array.length === 0) {
          console.error('Empty image data for:', imageObj.name);
          return '';
        }
        const blob = new Blob([uint8Array], { type: 'image/png' });
        return URL.createObjectURL(blob);
      }, [imageObj.blob]);

/*       React.useEffect(() => {
        return () => URL.revokeObjectURL(imageUrl);
      }, [imageUrl]);
 */
      return (<img src={imageUrl} alt="Image" style={{minWidth: '20px', minHeight: '20px', imageRendering: 'pixelated'}} />);
    }
    return null;
  };

  const handleScaleChange = (newScale: number) => {
    if (onScaleChange) {
      onScaleChange(itemId, Math.max(0.1, Math.min(3.0, newScale))); // Clamp between 0.1 and 3.0
    }
  };

  const forceTransformRecalculation = () => {
    setIsRecalculating(true);
    // Force a layout recalculation by temporarily removing transform
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsRecalculating(false);
      });
    });
  };

  const handleResizeMouseDown = (direction: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingResize(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width || 100;
    const startHeight = height || 50;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (direction.includes('right')) {
        newWidth = Math.max(50, startWidth + deltaX);
      }
      if (direction.includes('left')) {
        newWidth = Math.max(50, startWidth - deltaX);
      }
      // Disable vertical resizing - keep height unchanged
      // if (direction.includes('bottom')) {
      //   newHeight = Math.max(30, startHeight + deltaY);
      // }
      // if (direction.includes('top')) {
      //   newHeight = Math.max(30, startHeight - deltaY);
      // }
      
      if (onDimensionChange) {
        onDimensionChange(itemId, { width: newWidth });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingResize(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Force recalculation after resize operation
      forceTransformRecalculation();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      style={{ position: 'absolute', left: position.left, top: position.top }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        style={{ 
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
          minWidth: '50px',
          minHeight: '30px',
          position: 'relative',
          overflow: 'visible',
          border: isHovered ? '1px dashed rgba(255,255,255,0.3)' : 'none'
        }}
      >
        <div
          style={{ 
            transform: isRecalculating ? 'none' : `scale(${scale})`,
            transformOrigin: '50% 50%',
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >
          <DraggableWrapper 
            type="draggable-item"
            id={itemId}
            left={0}
            top={0}
            opacity={0.5}
            useAbsolutePositioning={false}
          >
            <div style={{ 
              width: '100%', 
              height: '100%', 
              wordWrap: 'break-word',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                maxWidth: '100%',
                maxHeight: '100%'
              }}>
                {renderObjectContent()}
              </div>
            </div>
          </DraggableWrapper>
        </div>

        {/* Resize handles - Only horizontal, and only for text/link objects */}
        {onDimensionChange && isHovered && !('blob' in item) && (
          <>
            {/* Only left and right edge handles */}
            <div
              className="absolute w-1 h-full cursor-w-resize"
              style={{ top: 0, left: -2 }}
              onMouseDown={(e) => handleResizeMouseDown('left', e)}
            />
            <div
              className="absolute w-1 h-full cursor-e-resize"
              style={{ top: 0, right: -2 }}
              onMouseDown={(e) => handleResizeMouseDown('right', e)}
            />
          </>
        )}
      </div>
      
      {onScaleChange && isHovered && (
        <div className="absolute -top-8 -right-8 flex gap-1 bg-black bg-opacity-50 rounded p-1">
          <button
            onClick={() => handleScaleChange(scale - 0.1)}
            className="w-6 h-6 text-white text-xs hover:bg-white hover:bg-opacity-20 rounded"
            title="Decrease size"
          >
            -
          </button>
          <span className="text-white text-xs px-1 min-w-8 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => handleScaleChange(scale + 0.1)}
            className="w-6 h-6 text-white text-xs hover:bg-white hover:bg-opacity-20 rounded"
            title="Increase size"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

export default MainBoxTapeItem;