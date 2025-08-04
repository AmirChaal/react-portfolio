import { Vector3 } from "three";

export function getRandomPosition(top: number, right: number, bottom: number, left: number, front: number, back: number) {
   const x = Math.random() * (right - left) + left
   const y = Math.random() * (top - bottom) + bottom
   const z = Math.random() * (front - back) + back

   return new Vector3(x, y, z)
}
