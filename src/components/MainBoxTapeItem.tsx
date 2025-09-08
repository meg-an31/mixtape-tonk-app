import React from 'react';
import { TapeObject, textObject, linkObject, PaletteObject } from '../types/ScrollBoxData';
import DraggableWrapper from './ObjectComponent';

interface MainBoxTapeItemProps {
  item: PaletteObject;
  itemId: string; // The actual ID used in mainBoxItems
  position: { top: number; left: number };
  onPositionChange: (id: string, position: { top: number; left: number }) => void;
}

const MainBoxTapeItem: React.FC<MainBoxTapeItemProps> = ({ item, itemId, position }) => {
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
      type="draggable-item"
      id={itemId}
      left={position.left}
      top={position.top}
      opacity={0.5}
      useAbsolutePositioning={true}
    >
      {renderObjectContent()}
    </DraggableWrapper>
  );
};

export default MainBoxTapeItem;