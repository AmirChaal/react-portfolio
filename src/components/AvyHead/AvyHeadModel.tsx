import { useGLTF } from "@react-three/drei"
import { useGlobal } from "../../stores/global"

export default function AvyHeadModel(props: Record<string, unknown>) {
   const { loadingManager } = useGlobal()
   const robavyModel = useGLTF("/robavy.glb", false, false, (loader) => loader.manager = loadingManager)

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