import { PaletteObject, TapeObject } from "../types/ScrollBoxData";
import { SyncService } from './syncService';

export async function getCoreData() : Promise<{dataList: TapeObject[]}> {
    const vfs = await SyncService.getVfs();
    const content = JSON.parse(JSON.parse(await vfs.readFile('/data.json')).content);

    console.log(`data: ${content}`);

    return content;
}

// Load all objects available on the tape 
export async function loadTapeObjects(): Promise<{[key: string]: {tapeObj: TapeObject}}> {
    await SyncService.init(); 
    const vfs = await SyncService.getVfs(); 
    var objects_raw = JSON.parse(JSON.parse(await vfs.readFile(SyncService.PositionsPath)).content);
    try {
        const test = JSON.parse(objects_raw);
        objects_raw = test;
    }
    finally {
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
    const vfs = await SyncService.getVfs();
    vfs.deleteFile(SyncService.PositionsPath);
    await vfs.createFile(SyncService.PositionsPath, JSON.stringify(new_tape_objs, null, 2));
}

// Remove by id
export async function removeTapeObject(key: string) {
    var old_tape_objs = await loadTapeObjects();
    const { [key]: removed, ...new_tape_objs } = old_tape_objs;
    const vfs = await SyncService.getVfs();
    vfs.deleteFile(SyncService.PositionsPath);
    await vfs.createFile(SyncService.PositionsPath, JSON.stringify(new_tape_objs, null, 2));
}

// Load all objects available on the palette
export async function loadPaletteObjects(): Promise<PaletteObject[]> {
    await SyncService.init();
    const vfs = await SyncService.getVfs();
    var objects_raw: PaletteObject[]= JSON.parse(JSON.parse(JSON.parse(await vfs.readFile(SyncService.ObjectsPath)).content)).objects;
    return objects_raw;
}

// Store new palette object in the tonk core storage
export async function storePaletteObject(paletteObject: PaletteObject) {
    const old_palette_objs = await loadPaletteObjects();
    old_palette_objs.push(paletteObject);
    const vfs = await SyncService.getVfs();
    vfs.deleteFile(SyncService.ObjectsPath);
    await vfs.createFile(SyncService.ObjectsPath, JSON.stringify(old_palette_objs, null, 2));
}

// Remove using an id
export async function removePaletteObject(id: string) {
    const old_palette_objs = await loadPaletteObjects();
    const new_palette_objs = old_palette_objs.filter(item => item.id !== id);
    const vfs = await SyncService.getVfs();
    vfs.deleteFile(SyncService.ObjectsPath);
    await vfs.createFile(SyncService.ObjectsPath, JSON.stringify(new_palette_objs, null, 2));
}