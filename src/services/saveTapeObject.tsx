import React from 'react';
import { TapeObject, textObject, imageObject, linkObject } from "../types/ScrollBoxData";
import { TapeObjectEditorData } from '../components/TapeObjectEditor';
import { initializeTonk, createSyncEngine } from '@tonk/core';
import { SyncService } from './syncService';
import { loadPaletteObjects, loadTapeObjects, storePaletteObject, storeTapeObject } from './getDataService';

// TODO: change this
// right now this IS being used by the add object to palette view
// BUT needs to be changed
// have not tested in any capacity 

export async function saveTapeObject(data: TapeObjectEditorData) {

  if (data.objectType == "link") {
    if (data.linkObject.text == undefined) {data.linkObject.text = "";}
    const new_id = "link-" + Date.now().toString();
    const newItem: linkObject = {
      id: new_id,
      url: data.linkObject.url,
      text: data.linkObject.text,
      textColour: data.linkObject.textColour
    };
    await storePaletteObject(newItem);
  } else {
    const new_id = "text-" + Date.now().toString();
    const newItem: textObject = {
      id: new_id,
      text: data.textObject.text,
      textColour: data.textObject.textColour
    };
    await storePaletteObject(newItem);
    console.log(await loadPaletteObjects());
  }
}