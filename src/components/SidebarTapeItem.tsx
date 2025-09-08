import React from 'react';
import { TapeObject, textObject, linkObject, PaletteObject } from '../types/ScrollBoxData';
import DraggableWrapper from './ObjectComponent';

interface SidebarTapeItemProps {
  item: PaletteObject;
}

const SidebarTapeItem: React.FC<SidebarTapeItemProps> = ({ item }) => {
  const renderObjectContent = () => {
    if (!("url" in item)) {
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