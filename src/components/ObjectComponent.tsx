import React from 'react';
import { useDrag } from 'react-dnd';

export interface DraggableWrapperProps {
  children: React.ReactNode;
  id?: string,
  left?: number, 
  top?: number,
  type?: string;
  opacity?: number;
  useAbsolutePositioning?: boolean;
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({
  children,
  id,
  left = 0,
  top = 0,
  type = 'draggable-item',
  opacity = 0,
  useAbsolutePositioning = false
}) => {
  const [{isDragging}, drag] = useDrag(() => ({
    type,
    item: (monitor) => {
      const clientOffset = monitor.getInitialClientOffset();
      const sourceClientOffset = monitor.getInitialSourceClientOffset();
      
      if (clientOffset && sourceClientOffset) {
        const offsetX = clientOffset.x - sourceClientOffset.x;
        const offsetY = clientOffset.y - sourceClientOffset.y;
        
        return { 
          id, 
          left, 
          top, 
          type, 
          dragOffset: { x: offsetX, y: offsetY } 
        };
      }
      
      return { id, left, top, type, dragOffset: { x: 0, y: 0 } };
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }),
  [id, left, top, type],
);

    if (isDragging) {
    return (<div ref={drag as any} />)
  }

  const baseStyle = {
    opacity: isDragging ? opacity : 1,
    cursor: 'move',
  };

  const positionStyle = useAbsolutePositioning ? {
    position: 'absolute' as const,
    left, 
    top,
  } : {};

  return (
    <div
      ref={drag as any}
      style={{
        ...baseStyle,
        ...positionStyle,
      }}
    >
      {children}
    </div>
  );
};

export default DraggableWrapper;