import React from 'react';
import { TapeObject, TapeReel } from '../types/ScrollBoxData';
import DraggableWrapper, { DraggableWrapperProps } from './ObjectComponent';
import MainBoxTapeItem from './MainBoxTapeItem';
import update from 'immutability-helper'
import type { CSSProperties, FC } from 'react'
import { useCallback, useState } from 'react'
import type { XYCoord } from 'react-dnd'
import { useDrop } from 'react-dnd'
import { SyncService } from '../services/syncService';
import { ContainerProps, ContainerState } from '../types/ScrollBoxData';


const styles: CSSProperties = {
  width: '40%',
  height: 1000,
  border: '1px solid black',
  position: 'relative',
  margin: "0 auto",
}

export const Tape: FC<ContainerProps> = ({ 
  paletteItems, 
  mainBoxItems, 
  onAddToMainBox, 
  onUpdateMainBoxPosition 
}) => {
  // Remove the local boxes state as we'll use mainBoxItems from props

  const moveBox = useCallback(
    (id: string, tapeObj: TapeObject) => {
      onUpdateMainBoxPosition(id, tapeObj);
    },
    [onUpdateMainBoxPosition],
  )

  const [, drop] = useDrop(
    () => ({
      accept: ["draggable-item", ...paletteItems.map(item => `palette-object-${item.id}`)],
      drop(item: any, monitor) {
        const clientOffset = monitor.getClientOffset() as XYCoord
        const containerElement = document.querySelector('[data-container="true"]')
        
        if (clientOffset && containerElement) {
          const containerRect = containerElement.getBoundingClientRect()
          const dragOffset = item.dragOffset || { x: 0, y: 0 }
          const relativeLeft = clientOffset.x - containerRect.left - dragOffset.x
          const relativeTop = clientOffset.y - containerRect.top - dragOffset.y
          
          console.log('Item dropped:', {
            itemId: item.id,
            itemType: monitor.getItemType(),
            absolutePosition: { x: clientOffset.x, y: clientOffset.y },
            relativePosition: { x: relativeLeft, y: relativeTop },
            containerRect: {
              left: containerRect.left,
              top: containerRect.top,
              width: containerRect.width,
              height: containerRect.height
            }
          })

          if (monitor.getItemType()?.toString().startsWith('palette-object')) {
            const draggedItem = paletteItems.find(pItem => pItem.id === item.id);
            if (draggedItem) {
              // creating a new unique id for the tape instance
              const newId = `${draggedItem.id}-copy-${Date.now()}`;
              const new_tape_obj = {
                id: newId,
                top: relativeTop,
                left: relativeLeft,
                paletteObject: draggedItem
              }
              onAddToMainBox(newId, new_tape_obj);
            }
          }
          else if (item.id && mainBoxItems[item.id]) {
            const newObj: TapeObject = {
              id: item.id,
              paletteObject: mainBoxItems[item.id].tapeObj.paletteObject,
              top: relativeTop, 
              left: relativeLeft
            };
            // this object already exists on the board! so we move it to the new position
            moveBox(item.id, newObj);
          }
        }
        
        return undefined
      },
    }),
    [moveBox, paletteItems, mainBoxItems, onAddToMainBox],
  )

  return (
    <div ref={drop as any} style={styles} data-container="true">
      {Object.keys(mainBoxItems).map((key) => {
        const { tapeObj } = mainBoxItems[key];
        return (
          <MainBoxTapeItem
            key={key}
            item={tapeObj.paletteObject}
            itemId={key}
            position={{ left: tapeObj.left, top: tapeObj.top }}
            onPositionChange={onUpdateMainBoxPosition}
          />
        );
      })}
    </div>
  )
}
