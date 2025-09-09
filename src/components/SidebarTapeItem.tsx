import React, {useMemo} from 'react';
import { TapeObject, textObject, linkObject, imageObject, PaletteObject } from '../types/ScrollBoxData';
import DraggableWrapper from './ObjectComponent';

interface SidebarTapeItemProps {
  item: PaletteObject;
}

const SidebarTapeItem: React.FC<SidebarTapeItemProps> = ({ item }) => {
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


      return (<img src={imageUrl} alt="Image" style={{minWidth: '20px', minHeight: '20px', imageRendering: 'pixelated'}} />);
    }
    return null;
  };

  return (
    <DraggableWrapper 
      type={`palette-object-${item.id}`} 
      id={item.id}
      opacity={0.3}
    >
      {renderObjectContent()}
    </DraggableWrapper>
  );
};

export default SidebarTapeItem;