import { PaletteObject, TapeObject } from "../types/ScrollBoxData";
import { SyncService } from './syncService';

export async function getCoreData() : Promise<{dataList: TapeObject[]}> {
    const vfs = await SyncService.gettonk();
    const content = JSON.parse(JSON.parse(await vfs.readFile('/data.json')).content);

    console.log(`data: ${content}`);

    return content;
}

// Load all objects available on the tape 
export async function loadTapeObjects(): Promise<{[key: string]: {tapeObj: TapeObject}}> {
    await SyncService.init(); 
    const vfs = await SyncService.gettonk(); 
    const content_only = ((await vfs.readFile(SyncService.PositionsPath) as JsonObj).content);
    //console.log(content_only);
    var objects_raw = JSON.parse(content_only);
    console.log(objects_raw);
    // var objects_raw = JSON.parse(JSON.parse(await vfs.readFile(SyncService.PositionsPath)).content);
    try {
        const test = JSON.parse(objects_raw);
        objects_raw = test;
    }
    finally {
        // Fix corrupted Uint8Array data in tape objects
        Object.keys(objects_raw).forEach(key => {
            const tapeObj = objects_raw[key].tapeObj;
            if (tapeObj?.paletteObject && 'blob' in tapeObj.paletteObject && 
                tapeObj.paletteObject.blob && typeof tapeObj.paletteObject.blob === 'object') {
                const blobArray = Object.values(tapeObj.paletteObject.blob as unknown as Record<string, number>);
                tapeObj.paletteObject.blob = new Uint8Array(blobArray);
            }
        });
        
        return objects_raw;
    }
}

// store new tape obj
export async function storeTapeObject( key: string, tapeObject: TapeObject) {
    const old_tape_objs = await loadTapeObjects();
    const new_tape_objs = ({
      ...old_tape_objs,
      [key]: {
        tapeObj: tapeObject
      }
    })
    const vfs = await SyncService.gettonk();
    vfs.deleteFile(SyncService.PositionsPath);
    await vfs.createFile(SyncService.PositionsPath, JSON.stringify(new_tape_objs, null, 2));
}

// Remove by id
export async function removeTapeObject(key: string) {
    var old_tape_objs = await loadTapeObjects();
    const { [key]: removed, ...new_tape_objs } = old_tape_objs;
    const vfs = await SyncService.gettonk();
    vfs.deleteFile(SyncService.PositionsPath);
    await vfs.createFile(SyncService.PositionsPath, JSON.stringify(new_tape_objs, null, 2));
}

interface JsonObj {
    content: string;
}

// Load all objects available on the palette
export async function loadPaletteObjects(): Promise<PaletteObject[]> {
    await SyncService.init();
    const vfs = await SyncService.gettonk();
    const content_only = ((await vfs.readFile(SyncService.ObjectsPath) as JsonObj).content);
    console.log(JSON.parse(JSON.parse(content_only)));
    var objects_raw = JSON.parse(JSON.parse(content_only)).objects as PaletteObject[];
    console.log(objects_raw);
    
    // Fix corrupted Uint8Array data from JSON serialization
    objects_raw = objects_raw.map(obj => {
        if ('blob' in obj && obj.blob && typeof obj.blob === 'object') {
            // Convert the JSON object back to Uint8Array
            const blobArray = Object.values(obj.blob as unknown as Record<string, number>);
            return {
                ...obj,
                blob: new Uint8Array(blobArray)
            };
        }
        return obj;
    });
    
    return objects_raw;
}

// Store new palette object in the tonk core storage
export async function storePaletteObject(paletteObject: PaletteObject) {
    const old_palette_objs = await loadPaletteObjects();
    old_palette_objs.push(paletteObject);
    const vfs = await SyncService.gettonk();
    vfs.deleteFile(SyncService.ObjectsPath);
    await vfs.createFile(SyncService.ObjectsPath, JSON.stringify({objects: old_palette_objs}, null, 2));
    console.log(old_palette_objs);
}

// Remove using an id
export async function removePaletteObject(id: string) {
    const old_palette_objs = await loadPaletteObjects();
    const new_palette_objs = old_palette_objs.filter(item => item.id !== id);
    const vfs = await SyncService.gettonk();
    vfs.deleteFile(SyncService.ObjectsPath);
    await vfs.createFile(SyncService.ObjectsPath, JSON.stringify(new_palette_objs, null, 2));
}