import {create} from "zustand"
import {subscribeWithSelector} from "zustand/middleware";

interface GameState {
    blocksCount: number,
    blocksSeed: number,
    phase: 'ready' | 'playing' | 'ended'
    start: () => void
    restart: () => void
    end: () => void
    startTime: number,
    endTime: number
}

export default create<GameState>()(subscribeWithSelector((set) => {
    return {
        blocksCount: 10,
        blocksSeed: 0,
        phase: 'ready',
        startTime: 0,
        endTime: 0,
        start: () => set((state) =>
            (state.phase === 'ready' ? {phase: 'playing', startTime: Date.now()} : {})),
        restart: () => set((state) =>
            (['playing', 'ended'].includes(state.phase) ? {phase: 'ready', blocksSeed: Math.random()} : {})),
        end: () => set((state) =>
            (state.phase === 'playing' ? {phase: 'ended', endTime: Date.now()} : {}))
    }
}))