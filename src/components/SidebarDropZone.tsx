import React from 'react';
import { useDrop } from 'react-dnd';
import { PaletteObject, TapeObject } from '../types/ScrollBoxData';

interface SidebarDropZoneProps {
  children: React.ReactNode;
  onAddToSidebar: (itemId: string, paletteObject: PaletteObject) => void;
  onRemoveFromMainBox: (itemId: string) => void;
  mainBoxItems: {[key: string]: {tapeObj: TapeObject}};
}

const SidebarDropZone: React.FC<SidebarDropZoneProps> = ({
  children,
  onAddToSidebar,
  onRemoveFromMainBox,
  mainBoxItems
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'draggable-item',
    drop: (item: any) => {
      const draggedItem = mainBoxItems[item.id];
      if (draggedItem) {
        //onAddToSidebar(item.id, draggedItem.tapeObj.paletteObject);
        onRemoveFromMainBox(item.id);
        console.log(`Item ${item.id} moved from main box back to sidebar`);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as any}
      className={`relative transition-colors ${isOver ? 'bg-blue-50 border-blue-200' : ''}`}
      style={{ minHeight: '100%' }}
    >
      {children}
      {isOver && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center border-2 border-dashed border-blue-300 rounded z-10">
          <span className="text-blue-600 font-medium">Drop to return to sidebar</span>
        </div>
      )}
    </div>
  );
};

export default SidebarDropZone;