import {RapierRigidBody, RigidBody, useRapier} from "@react-three/rapier";
import {useFrame} from "@react-three/fiber";
import {useKeyboardControls} from "@react-three/drei";
import {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from "three"
import useGame from "../stores/useGame.ts";

const Player = () => {

    const body = useRef<RapierRigidBody>(null)
    const [subscribeKeys, getKeys] = useKeyboardControls()
    const {rapier, world} = useRapier()

    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())

    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)

    const jump = useCallback( () => {
        if (!body.current) return
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = {x: 0, y: -1, z: 0}
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if((hit?.timeOfImpact ?? 0) < 0.15)
            body.current.applyImpulse({x: 0, y: 0.5, z: 0}, false)
    }, [rapier.Ray, world])

    const reset = useCallback(() => {
        if (!body.current) return
        body.current.setTranslation({x: 0, y: 1, z: 0}, false)
        body.current.setLinvel({x: 0, y: 1, z: 0}, false)
        body.current.setAngvel({x: 0, y: 1, z: 0}, false)
    }, [])

    useEffect(() => {

        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (value) => {
                if(value === 'ready') reset()
            }
        )

        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) => {
                if (value) jump()
            },
        )

        const unsubscribeJumpTouch = useGame.subscribe(
            (state) => state.jumpTouch,
            (value) => {
                if(value) jump()
            }
        )

        const unsubscribeAny = subscribeKeys(
            () => {
                start()
            },
        )

        return () => {
            unsubscribeJump()
            unsubscribeAny()
            unsubscribeReset()
            unsubscribeJumpTouch()
        }

    }, [jump, reset, start, subscribeKeys]);

    useFrame((state, delta) => {
        //controls
        const {forward, backward, leftward, rightward} = getKeys()
        const {forwardTouch, backwardTouch, leftwardTouch, rightwardTouch} = useGame.getState()
        const impulse = {x: 0, y: 0, z: 0}
        const torque = {x: 0, y: 0, z: 0}

        const impulseStrength = 0.6 * delta
        const torqueStrength = 0.2 * delta

        if (forward || forwardTouch) {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }

        if (rightward || rightwardTouch) {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        if (backward || backwardTouch) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }

        if (leftward || leftwardTouch) {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }

        body.current?.applyImpulse(impulse, false)
        body.current?.applyTorqueImpulse(torque, false)

        //camera
        if(!body.current) return
        const bodyPosition = body.current.translation()

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        //phases
        if(bodyPosition.z < - (blocksCount * 4 + 2)) end()

        if(bodyPosition.y < -4) restart()
    })

    return (
        <RigidBody
            ref={body}
            canSleep={false}
            colliders='ball'
            restitution={0.2}
            friction={1}
            linearDamping={0.5}
            angularDamping={0.5}
            position={[0, 1, 0]}
        >
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]}/>
                <meshStandardMaterial flatShading color='mediumpurple'/>
            </mesh>
        </RigidBody>
    )
}

export default Player