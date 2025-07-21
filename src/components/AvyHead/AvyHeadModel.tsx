import { useGLTF } from "@react-three/drei"

export default function AvyHeadModel(props: Record<string, unknown>) {
   const robavyModel = useGLTF('robavy.glb')

   return (
      <>
         <primitive {...props} object={robavyModel.scene} />;
      </>
   )
}