import { useGLTF } from "@react-three/drei"

export default function AvyHeadModel(props: Record<string, unknown>) {
   const robavyModel = useGLTF('robavy.glb')

   return (
      <>
         <primitive {...props} object={robavyModel.scene} />;
         {/* <mesh ref={head} position={[0, 0, 2]}>
            <boxGeometry />
            <meshStandardMaterial color="red" />
         </mesh> */}
      </>
   )
}