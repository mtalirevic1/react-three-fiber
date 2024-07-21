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
    endTime: number,
    forwardTouch: boolean,
    rightwardTouch: boolean,
    leftwardTouch: boolean,
    backwardTouch: boolean,
    jumpTouch: boolean,
    setForwardTouch: (a: boolean) => void
    setBackwardTouch: (a: boolean) => void
    setLeftwardTouch: (a: boolean) => void
    setRightwardTouch: (a: boolean) => void
    setJumpTouch: (a: boolean) => void
}

export default create<GameState>()(subscribeWithSelector((set) => {
    return {
        blocksCount: 10,
        blocksSeed: 0,
        phase: 'ready',
        startTime: 0,
        endTime: 0,
        forwardTouch: false,
        rightwardTouch: false,
        leftwardTouch: false,
        backwardTouch: false,
        jumpTouch: false,
        start: () => set((state) =>
            (state.phase === 'ready' ? {phase: 'playing', startTime: Date.now()} : {})),
        restart: () => set((state) =>
            (['playing', 'ended'].includes(state.phase) ? {phase: 'ready', blocksSeed: Math.random()} : {})),
        end: () => set((state) =>
            (state.phase === 'playing' ? {phase: 'ended', endTime: Date.now()} : {})),
        setForwardTouch: (forwardTouch: boolean) => set(() => ({forwardTouch})),
        setBackwardTouch: (backwardTouch: boolean) => set(() => ({backwardTouch})),
        setLeftwardTouch: (leftwardTouch: boolean) => set(() => ({leftwardTouch})),
        setRightwardTouch: (rightwardTouch: boolean) => set(() => ({rightwardTouch})),
        setJumpTouch: (jumpTouch: boolean) => set(() => ({jumpTouch})),
    }
}))