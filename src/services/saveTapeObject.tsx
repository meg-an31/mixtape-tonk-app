import React from 'react';
import { TapeObject, textObject, imageObject, linkObject } from "../types/ScrollBoxData";
import { TapeObjectEditorData } from '../components/TapeObjectEditor';
//import { initializeTonk, createSyncEngine } from '@tonk/core';
import { SyncService } from './syncService';
import { loadPaletteObjects, loadTapeObjects, storePaletteObject, storeTapeObject } from './getDataService';


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

const fileToUint8Arr = async (file: File): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

/**
 * Svae images in correct format
 */

export async function saveImageObject(image: File) {
  const new_id = "image-" + Date.now().toString();
  const newItem: imageObject = {
    id: new_id,
    name: image.name,
    mime: image.type,
    blob: await fileToUint8Arr(image),
  };
  await storePaletteObject(newItem);
}
