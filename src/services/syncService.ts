import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { testingObjects } from "../data/temp_data";
import { TonkCore } from "/Users/meganwalker/tonk-blob-pr/three/tonk/packages/core-js/dist/index.js";


/*
    FOR TESTING PURPOSES:
    - testiongObjects contains a list of standard objects you can decorate the tape with
*/

export class SyncService {
    private static wsProtocol: "wss:" | "ws:";
    private static wsUrl: string;
    private static wsAdapter: BrowserWebSocketClientAdapter;
    private static storage: IndexedDBStorageAdapter;
    private static tonk?: any;
    private static initialized = false;
    private static initializing = false;
    public static readonly ObjectsPath = "/objects.json";
    public static readonly PositionsPath = "/positions.json";
    private static initPromise?: Promise<void>;

    private static async do_init(): Promise<void> {
        this.initializing = true;

        this.wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        this.wsUrl = `${this.wsProtocol}//${window.location.host}/sync`;
        this.wsAdapter = new BrowserWebSocketClientAdapter(this.wsUrl);
        this.storage = new IndexedDBStorageAdapter();
        const TonkCore = await import('/Users/meganwalker/tonk-blob-pr/three/tonk/packages/core-js/dist/index.js');

        const response = await fetch('http://localhost:6080/.manifest.tonk');

        if (!response.ok) {
            throw new Error(`Failed to fetch bundle: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        console.log(bytes);
        
        this.tonk = await TonkCore.TonkCore.fromBytes(bytes, {
            storage: { type: 'indexeddb' },
        });

        console.log(this.wsUrl);
        // Create a sync engine
        await this.tonk.connectWebsocket('ws://localhost:6080'); 
        
        try {
            await this.tonk.exists(this.PositionsPath);
        }
        catch (error) {
            console.log("No root doc found, initialising new tonk");
            this.tonk = await TonkCore.TonkCore.create();
            console.log(await this.tonk.toBytes());
        }

        if (this.tonk && !(await this.tonk.exists(this.PositionsPath))) {
            console.log("positions file does not exist, creating......");
            await this.tonk.createFile(this.PositionsPath, '');
        }
        
        // TODO: remove dependency upon testingObjects
        if (this.tonk && !(await this.tonk.exists(this.ObjectsPath))) {
            await this.getPeerId();
            console.log("objects file does not exist, creating......");
            const b = await this.tonk.exists(this.ObjectsPath); 
            if (!b) {
                const objects = testingObjects;
                await this.tonk.createFile(this.ObjectsPath, JSON.stringify(objects, null, 2));
            }
            const t = await this.tonk.readFile(this.ObjectsPath);
            console.log(t);
        }
        this.initializing = false;
        this.initialized = true;
        console.log('SyncService initialized successfully');
    } 

    static async init(): Promise<void> {
        if (this.initialized) {
            console.log('SyncService already initialized');
            return;
        }
        if (this.initPromise && this.initializing) {
            console.log("initialising sync service...");
            return this.initPromise;
        }
        this.initPromise = this.do_init();
        try {
            await this.initPromise;
        }
        finally {
            this.initPromise = undefined;
        }
    }

    static async getPeerId(): Promise<string> {
        if (!this.tonk) {
            throw new Error('Tonk not initialized. Call SyncService.init() first.');
        }
        // Get the peer ID
        const peerId = await this.tonk.getPeerId();
        console.log('Peer ID:', peerId);
        return peerId;
    }

    static async getEngine(): Promise<TonkCore> {
        if (!this.isInitialized()) { await this.init();}
        return this.tonk;
    }

    static async gettonk(): Promise<TonkCore> {
        if (!this.isInitialized()) { await this.init();}
        return this.tonk;
    }

    static isInitialized(): boolean {
        return this.initialized;
    }
}
