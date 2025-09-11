import { useGLTF } from "@react-three/drei"
import { useGlobal } from "../../stores/global"
import { useLoader } from "@react-three/fiber"

export default function AvyHeadModel(props: Record<string, unknown>) {
   const { gltfLoader } = useGlobal()
   // const robavyModel = useGLTF("/robavy.glb", false, false, (loader) => loader.manager = loadingManager)
   const robavyModel = useLoader(gltfLoader, "/robavy.glb")

   robavyModel.scene.traverse((model) => {
      model.castShadow = true
      model.receiveShadow = true
   })

   return (
      <>
         <primitive {...props} object={robavyModel.scene} />;
      </>
   )
}