import React from 'react';
import { TapeObject, textObject, linkObject } from "../types/ScrollBoxData";
import { TapeObjectEditorData } from '../components/TapeObjectEditor';
//import oldData from '../stores/data.json';
import { initializeTonk, createSyncEngine } from '@tonk/core';
import { SyncService } from './syncService';

// TODO: change this
// right now this IS being used by the add object to palette view
// BUT needs to be changed
// have not tested in any capacity 

export async function saveTapeObject(data: TapeObjectEditorData) {
  const vfs = await SyncService.getVfs();
  const fileResult = await vfs.readFile('/data.json');
  console.log('Raw file result:', fileResult);
  
  // Extract the content string from the VFS result
  const vfsObject = JSON.parse(fileResult);
  const jsonString = vfsObject.content;
  console.log('content:', jsonString);
  
  // Parse the JSON content properly (need to parse TWICE due to double encoding)
  var oldData = JSON.parse(JSON.parse(jsonString));
  console.log('Parsed oldData:', oldData);
  console.log('oldData.dataList:', oldData.dataList);
  if (data.objectType == "link") {
    if (data.linkObject.text == undefined) {data.linkObject.text = "";}
    const newItem = {
      id: "4",
      object: {
        url: data.linkObject.url,
        text: data.linkObject.text,
        textColour: data.linkObject.textColour
      },
      position: {x: data.position.x, y: data.position.y}, 
      zIndex: data.position.z
    };
    oldData.dataList.push(newItem);
  } else {
    const newItem = {
      id: "4",
      object: {
        text: data.textObject.text,
        textColour: data.textObject.textColour
      },
      position: {x: data.position.x, y: data.position.y}, 
      zIndex: data.position.z
    };
    oldData.dataList.push(newItem);
  }
  console.log(oldData);
  await vfs.deleteFile('/data.json');
  await vfs.createFile('/data.json', JSON.stringify(oldData, null, 2));

  const updated = await vfs.readFile('/data.json');
  console.log('NEW UPDATED WOW:', fileResult);
}