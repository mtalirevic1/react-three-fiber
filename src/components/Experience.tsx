import {Physics} from "@react-three/rapier";
import Lights from './Lights.jsx'
import {Level} from "./Level.tsx";
import Player from "./Player.tsx";
import useGame from "../stores/useGame.ts";

export default function Experience() {
    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame((state) => state.blocksSeed)
    return <>
        <color args={['#bdedfc']} attach='background' />
        <Physics>
            <Lights/>
            <Level count={blocksCount} seed={blocksSeed} />
            <Player/>
        </Physics>
    </>
}