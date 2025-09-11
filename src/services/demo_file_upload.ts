import { SyncService } from "./syncService";
import { testingObjects } from "../data/temp_data";
import { PaletteObject } from "../types/ScrollBoxData";
import { storePaletteObject } from "./getDataService";

export class SimulateFileUpload {
    static async init() {
        const objs = testingObjects.objects as PaletteObject[];
        objs.map(async obj => {
            await storePaletteObject(obj);
        });
    }

    static async fileToByteArray(path: string): Promise<Uint8Array> {
        try{
            const file = Bun.file(path);
            const byteArray = await file.bytes();
            console.log(byteArray);
            return new Uint8Array(byteArray);
        }
        catch (error) {
            console.log(`error reading file ${path}`, error);
            return new Uint8Array();
        }
    }
}