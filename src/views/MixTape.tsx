import React, { useState } from "react";
import {Tape} from "../components/HorizontalScrollBox";
import { TapeReel, TapeObject, PaletteObject } from "../types/ScrollBoxData";
import SidePanel from "../components/SidePanel";
import SidebarTapeItem from "../components/SidebarTapeItem";
import SidebarDropZone from "../components/SidebarDropZone";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SyncService } from "../services/syncService";
import { useEffect } from "react";
import { loadTapeObjects, loadPaletteObjects, storeTapeObject, removePaletteObject, removeTapeObject } from "../services/getDataService";

/**
 * A simple Hello World view component that demonstrates basic layout and styling
 */


const MixTape = () => {
  // init with the state stored in the vfs!!
  var [paletteItems, setPaletteItems] = useState<PaletteObject[]>(new Array<PaletteObject>());
  var [mainBoxItems, setMainBoxItems] = useState<{[key: string]: {tapeObj: TapeObject}}>({});
  const [loading, setLoading] = useState(true);

  const init_data = async () => {
      const objects_raw: PaletteObject[]= await loadPaletteObjects();
      setPaletteItems(objects_raw);
      const tape_objs_raw: {[key: string]: {tapeObj: TapeObject}} = await loadTapeObjects();
      setMainBoxItems(tape_objs_raw);
      setLoading(false);
    }

  // use effect runs when any item in the second param (array) changes. 
  // empty array means it only runs on load. 
  // no value supplied means it runs every render :o
  useEffect(() => {
    init_data(); 
  }, []);

  if (loading) {
    return <div>loading...</div>
  }

  const getData = async () => {
    if (!loading){
      init_data();
    }
  }

  const removeFromSidebar = (itemId: string) => {
    setPaletteItems(prev => prev.filter(item => item.id !== itemId));
    removePaletteObject(itemId);
  }

  const addToMainBox = (itemId: string, tapeObject: TapeObject) =>
   {
    console.log(`added tape object: ${tapeObject.id}`);
    storeTapeObject(itemId, tapeObject);
    setMainBoxItems(prev => ({
      ...prev,
      [itemId]: {
        tapeObj: tapeObject
      }
    }));
  }

  const updateMainBoxPosition = (itemId: string, tapeObject: TapeObject) => {
    console.log(`updated tape object: ${tapeObject.id}`);
    storeTapeObject(itemId, tapeObject);
    setMainBoxItems(prev => ({
      ...prev,
      [itemId]: {
        tapeObj: tapeObject
      }
    }));
  }

  const addToSidebar = (itemId: string, palletObject: PaletteObject) => {
    setPaletteItems(prev => [...prev, palletObject]);
  }

  const removeFromMainBox = (itemId: string) => {
    setMainBoxItems(prev => {
      const { [itemId]: removed, ...rest } = prev;
      return rest;
    });
    removeTapeObject(itemId);
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-gray-50 flex overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <section className="max-w-5xl">
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">design your mixtape!</h2>
              <button
                onClick={getData}
                className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm"
              >
                Sync
              </button>
            </div>
            <Tape 
              paletteItems={paletteItems}
              mainBoxItems={mainBoxItems}
              onAddToMainBox={addToMainBox}
              onUpdateMainBoxPosition={updateMainBoxPosition}
            />
            
          </div>
        </section>
      </main>

      <SidePanel
        title="your palette"
        width="400px"
        position="right"
      >
        <SidebarDropZone
          onAddToSidebar={addToSidebar}
          onRemoveFromMainBox={removeFromMainBox}
          mainBoxItems={mainBoxItems}
        >
          <div className="space-y-6">
            <section>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Current Objects</h3>
              <div className="space-y-2 min-h-[100px] p-2 border-2 border-dashed border-gray-300 rounded-lg">
                {paletteItems.length > 0 ? (
                  paletteItems.map(item => (
                    <SidebarTapeItem key={item.id} item={item} />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    Drag items from the main box back here
                  </div>
                )}
              </div>
            </section>
            
            
            
            
          </div>
        </SidebarDropZone>
      </SidePanel>
      </div>
    </DndProvider>
  );
};

export default MixTape;
