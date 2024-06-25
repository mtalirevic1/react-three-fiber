import {useFrame} from "@react-three/fiber";
import {useRef} from "react";
import {Mesh} from "three"

const Experience = () => {
    const boxMeshRef = useRef<Mesh>(null);
    useFrame((_state, delta) => {
            boxMeshRef.current!.rotation.y += delta
    })
    return (
        <>
            <mesh
                ref={boxMeshRef}
                scale={1.5}
                rotation={[0, 1, 0]}
            >
                <boxGeometry/>
                <meshBasicMaterial
                    color='mediumpurple'
                    wireframe={false}
                />
            </mesh>
        </>
    )
}

export default Experience