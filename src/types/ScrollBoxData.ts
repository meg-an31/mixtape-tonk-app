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
  paletteObject: PaletteObject
}

export type PaletteObject = linkObject | textObject

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

// TODO: implement the sticker object
export interface stickerObject {
}

// TODO: implement the image object
export interface imageObject {
}

export interface ContainerProps {
  paletteItems: PaletteObject[];
  mainBoxItems: {[key: string]: {tapeObj: TapeObject}};
  onAddToMainBox: (itemId: string, tapeObject: TapeObject) => void;
  onUpdateMainBoxPosition: (itemId: string, position: {top: number, left: number}) => void;
}

export interface ContainerState {
  boxes: { [key: string]: { top: number; left: number; title: string } }
}