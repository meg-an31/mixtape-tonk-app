import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { createSyncEngine, SyncEngine, VirtualFileSystem, initializeTonk } from '@tonk/core';
import { testingObjects } from "../stores/temp_data";

/*
    FOR TESTING PURPOSES:
    - testiongObjects contains a list of standard objects you can decorate the tape with
*/

export class SyncService {
    private static wsProtocol: "wss:" | "ws:";
    private static wsUrl: string;
    private static wsAdapter: BrowserWebSocketClientAdapter;
    private static storage: IndexedDBStorageAdapter;
    private static engine?: SyncEngine;
    private static vfs?: VirtualFileSystem;
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
        
        await initializeTonk();
        
        // Create a sync engine
        // TODO: replace this with getting the root doc
        this.engine = await createSyncEngine();
        await this.engine.connectWebsocket(this.wsUrl); 
        
        // Get the virtual file system
        this.vfs = await this.engine.getVfs();
        
        if (this.vfs && !(await this.vfs.exists(this.PositionsPath))) {
            console.log("positions file does not exist, creating......");
            await this.vfs.createFile(this.PositionsPath, '');
        }
    
        if (this.vfs && !(await this.vfs.exists(this.ObjectsPath))) {
            await this.getPeerId();
            console.log("objects file does not exist, creating......");
            const b = await this.vfs.exists(this.ObjectsPath); 
            if (!b) {
                await this.vfs.createFile(this.ObjectsPath, JSON.stringify(testingObjects, null, 2));
            }
            const t = await this.vfs.readFile(this.ObjectsPath);
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
        if (!this.engine) {
            throw new Error('Engine not initialized. Call SyncService.init() first.');
        }
        // Get the peer ID
        const peerId = await this.engine.getPeerId();
        console.log('Peer ID:', peerId);
        return peerId;
    }

    static async getEngine(): Promise<SyncEngine> {
        if (!this.isInitialized()) { await this.init();}
        return this.engine;
    }

    static async getVfs(): Promise<VirtualFileSystem> {
        if (!this.isInitialized()) { await this.init();}
        return this.vfs;
    }

    static isInitialized(): boolean {
        return this.initialized;
    }
}
