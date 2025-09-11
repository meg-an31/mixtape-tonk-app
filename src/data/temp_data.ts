import { TapeObject } from "../types/ScrollBoxData"

const link_one = {
    url: "https://www.tonk.xyz",
    textColour: "#912778ff", 
    id: "1"
}

const link_two = {
    url: "https://www.pastagang.cc/london/",
    text: "pastagang",
    textColour: "#cf9bffff", 
    id: "2"
}

const text_one = {
    text: "live coding is so cool",
    textColour: "#a3bbd2ff", 
    id: "3"
}

const text_star = {
    text: "★",
    textColour: "#ffa600ff", 
    id: "4"
}

const text_heart = {
    text: "♥",
    textColour: "#da006aff", 
    id: "5"
}

const text_music = {
    text: "♫",
    textColour: "#00e0c2ff", 
    id: "6"
}

const circle_compressed = {
    blob: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 5, 0, 0, 0, 5, 8, 6, 0, 0, 0, 141, 111, 38, 229, 0, 0, 0, 28, 73, 68, 65, 84, 8, 215, 99, 248, 255, 255, 63, 195, 127, 6, 32, 5, 195, 32, 18, 132, 208, 49, 241, 130, 88, 205, 4, 0, 14, 245, 53, 203, 209, 142, 14, 31, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]),
}

const img_one = {
    id: "7", 
    name: "large_image", 
    versions: {
        compressed_path: "/media/compressed.json",
        bigger_path: "/media/bigger.json",
    },
}

const img_temp = {
    id: "8", 
    name: "crcle", 
    blob: circle_compressed.blob, 
    mime: "image/png"
}

export const testingObjects = {
    objects: [
        link_one,
        link_two, 
        text_one, 
        text_heart, 
        text_star, 
        text_music, 
        img_temp
    ]
}