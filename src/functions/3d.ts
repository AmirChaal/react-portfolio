import { Vector3 } from "three";

/**
   * Returns a random position inside a 3D box defined by the passed limits.
   * @param {Object} limits - The boundaries for the position.
   * @param {number} limits.top - Maximum y value.
   * @param {number} limits.bottom - Minimum y value.
   * @param {number} limits.right - Maximum x value.
   * @param {number} limits.left - Minimum x value.
   * @param {number} limits.front - Maximum z value (towards viewer).
   * @param {number} limits.back - Minimum z value (away from viewer).
   * @returns {THREE.Vector3} Random position within the box.
*/
export function getRandomPosition({ top, bottom, right, left, front, back }) {
   const x = Math.random() * (right - left) + left
   const y = Math.random() * (top - bottom) + bottom
   const z = Math.random() * (front - back) + back

   return new Vector3(x, y, z)
}
