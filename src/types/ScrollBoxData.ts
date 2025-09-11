export interface TapeReel {
  items: TapeObject[];
  totalHeight: number;
}

// tape object is _an instance of a palette object_  
// which exists on the tape ~~~
export interface TapeObject {
  id: string,
  top: number, 
  left: number, 
  scale?: number, // Scale factor for the object (default 1.0)
  width?: number, // Container width in pixels (default auto)
  height?: number, // Container height in pixels (default auto)
  paletteObject: PaletteObject
}

// just a way to group these items 
export type PaletteObject = linkObject | textObject | imageObject

export interface linkObject {
  url: string;
  text?: string;
  textColour: string;
  id?: string;
}

export interface textObject {
  text: string;
  textColour: string;
  id?: string;
}

export interface imageObject {
  name: string;
  blob: Uint8Array;
  id?: string;
  versions?: object;
  mime?: string
}

// TODO: implement the sticker object
export interface stickerObject {
}

export interface ContainerProps {
  paletteItems: PaletteObject[];
  mainBoxItems: {[key: string]: {tapeObj: TapeObject}};
  onAddToMainBox: (itemId: string, tapeObject: TapeObject) => void;
  onUpdateMainBoxPosition: (itemId: string, position: {top: number, left: number}) => void;
  onUpdateScale?: (itemId: string, scale: number) => void;
  onUpdateDimensions?: (itemId: string, dimensions: {width?: number, height?: number}) => void;
}

export interface ContainerState {
  boxes: { [key: string]: { top: number; left: number; title: string } }
}