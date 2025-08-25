import { LatLngTuple } from "leaflet";

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const textRefactor = (text: string, size: number) => {
  if (text && text.length > size) return text.substr(0, size) + "...";
  return text;
};

export function convertCoordinatesFromMongoToGoogle(coordinates?: [number, number]): LatLngTuple | undefined {
  if(!coordinates) return undefined

  return [coordinates[1], coordinates[0]]
}