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
  console.log("MixTape component rendering...");
  // init with the state stored in the vfs!!
  var [paletteItems, setPaletteItems] = useState<PaletteObject[]>(new Array<PaletteObject>());
  var [mainBoxItems, setMainBoxItems] = useState<{[key: string]: {tapeObj: TapeObject}}>({});
  const [loading, setLoading] = useState(true);

  const init_data = async () => {
      try {
        console.log("Loading palette objects...");
        const objects_raw: PaletteObject[]= await loadPaletteObjects();
        console.log("Loaded palette objects:", objects_raw);
        setPaletteItems(objects_raw);
        
        console.log("Loading tape objects...");
        const tape_objs_raw: {[key: string]: {tapeObj: TapeObject}} = await loadTapeObjects();
        console.log("Loaded tape objects:", tape_objs_raw);
        setMainBoxItems(tape_objs_raw);
        setLoading(false);
        console.log("Data loading complete");
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    }

  // use effect runs when any item in the second param (array) changes. 
  // empty array means it only runs on load. 
  // no value supplied means it runs every render :o
  useEffect(() => {
    console.log("useEffect running, calling init_data...");
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

  const updateMainBoxPosition = (itemId: string, position: { top: number; left: number }) => {
    setMainBoxItems(prev => {
      const currentItem = prev[itemId];
      if (currentItem) {
        const updatedTapeObject = {
          ...currentItem.tapeObj,
          top: position.top,
          left: position.left
        };
        console.log(`updated tape object position: ${updatedTapeObject.id}`);
        storeTapeObject(itemId, updatedTapeObject);
        return {
          ...prev,
          [itemId]: {
            tapeObj: updatedTapeObject
          }
        };
      }
      return prev;
    });
  }

  const updateScale = (itemId: string, scale: number) => {
    setMainBoxItems(prev => {
      const currentItem = prev[itemId];
      if (currentItem) {
        const updatedTapeObject = {
          ...currentItem.tapeObj,
          scale: scale
        };
        storeTapeObject(itemId, updatedTapeObject);
        return {
          ...prev,
          [itemId]: {
            tapeObj: updatedTapeObject
          }
        };
      }
      return prev;
    });
  }

  const updateDimensions = (itemId: string, dimensions: { width?: number; height?: number }) => {
    setMainBoxItems(prev => {
      const currentItem = prev[itemId];
      if (currentItem) {
        const updatedTapeObject = {
          ...currentItem.tapeObj,
          ...dimensions
        };
        storeTapeObject(itemId, updatedTapeObject);
        return {
          ...prev,
          [itemId]: {
            tapeObj: updatedTapeObject
          }
        };
      }
      return prev;
    });
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
      <div className="h-screen flex overflow-hidden" style={{
        background: 'linear-gradient(135deg, #344077 0%, #9f75caff 100%)'
      }}>
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <section className="max-w-5xl">
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">design your mixtape!</h2>
              <button
                onClick={getData}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-200 backdrop-blur-sm border border-white border-opacity-30"
              >
                Sync
              </button>
            </div>
            <Tape 
              paletteItems={paletteItems}
              mainBoxItems={mainBoxItems}
              onAddToMainBox={addToMainBox}
              onUpdateMainBoxPosition={updateMainBoxPosition}
              onUpdateScale={updateScale}
              onUpdateDimensions={updateDimensions}
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
              <h3 className="text-sm font-medium text-gray-300 mb-3">Current Objects</h3>
              <div className="space-y-2 min-h-[100px] p-3 border-2 border-dashed border-gray-500 rounded-lg bg-gray-800 bg-opacity-50">
                {paletteItems.length > 0 ? (
                  paletteItems.map(item => (
                    <SidebarTapeItem key={item.id} item={item} />
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">
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
