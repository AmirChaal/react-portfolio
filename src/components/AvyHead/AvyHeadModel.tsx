import { useGLTF } from "@react-three/drei"

export default function AvyHeadModel(props: Record<string, unknown>) {
   const robavyModel = useGLTF('robavy.glb')

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