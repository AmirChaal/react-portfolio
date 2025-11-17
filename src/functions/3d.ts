import { Camera, Mesh, Object3D, Plane, Raycaster, Vector2, Vector3 } from "three";
import { useGlobal } from "../stores/global";

export function getRandomPosition(top: number, right: number, bottom: number, left: number, front: number, back: number) {
   const x = Math.random() * (right - left) + left
   const y = Math.random() * (top - bottom) + bottom
   const z = Math.random() * (front - back) + back

   return new Vector3(x, y, z)
}


export function getCursor3DPosition(getNDC: () => Vector2, receiverPlane: Mesh, raycaster: Raycaster, camera: Camera) {
   const ndc = getNDC()
   raycaster.setFromCamera(ndc, camera)
   const intersects = raycaster.intersectObject(receiverPlane, true);
   console.log(intersects.length)
   if (intersects.length > 0) return intersects[0].point
   else return null
}

export function getCursor3DPositionOnPlane(getNDC: () => Vector2, receiverPlane: Plane, raycaster: Raycaster, camera: Camera) {
   const ndc = getNDC()
   raycaster.setFromCamera(ndc, camera)
   const intersect = new Vector3()
   raycaster.ray.intersectPlane(receiverPlane, intersect);
   return intersect
}

export function getCursorAngle(cursorPosition: Vector3, receiverPlane: Mesh) {
   const localCursor = receiverPlane.worldToLocal(cursorPosition.clone());
   return Math.atan2(localCursor.y, localCursor.x);
}

export function getWorldPosition(object3D: Object3D) {
   const worldPosition = new Vector3()
   object3D.getWorldPosition(worldPosition)
   return worldPosition
}