import {useKeyboardControls} from "@react-three/drei";
import useGame from "../stores/useGame.ts";
import {useEffect, useRef} from "react";
import {addEffect} from "@react-three/fiber";

const Interface = () => {
    const time = useRef<HTMLDivElement>(null)

    const restart = useGame(state => state.restart)
    const phase = useGame(state => state.phase)

    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)

    const forwardTouch = useGame(state => state.forwardTouch)
    const backwardTouch = useGame(state => state.backwardTouch)
    const leftwardTouch = useGame(state => state.leftwardTouch)
    const rightwardTouch = useGame(state => state.rightwardTouch)
    const jumpTouch = useGame(state => state.jumpTouch)

    const setForwardTouch = useGame(state => state.setForwardTouch)
    const setBackwardTouch = useGame(state => state.setBackwardTouch)
    const setLeftwardTouch = useGame(state => state.setLeftwardTouch)
    const setRightwardTouch = useGame(state => state.setRightwardTouch)
    const setJumpTouch = useGame(state => state.setJumpTouch)

    useEffect(() => {
        const unsubscribeEffect = addEffect(() => {
            const state = useGame.getState()
            let elapsedTime = 0
            if(state.phase === 'playing')
                elapsedTime = Date.now() - state.startTime
            else if(state.phase === 'ended')
                elapsedTime = state.endTime - state.startTime

            elapsedTime /= 1000
            const elapsedTimeString = elapsedTime.toFixed(2)

            if(time.current)
                time.current.textContent = elapsedTimeString
        })

        return () => {
            unsubscribeEffect()
        }
    }, []);

    return (
        <div className="interface">
            <div ref={time} className="time">
                0.00
            </div>
            {phase === 'ended' &&
                <div className="restart" onClick={restart}>
                    Restart
                </div>
            }
            <div className="controls">
                <div className="raw">
                    <div
                        onTouchStart={() => setForwardTouch(true)}
                        onTouchEnd={() => setForwardTouch(false)}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`key ${forward || forwardTouch ? 'active' : ''}`}
                    ></div>
                </div>
                <div className="raw">
                    <div
                        onTouchStart={() => setLeftwardTouch(true)}
                        onTouchEnd={() => setLeftwardTouch(false)}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`key ${leftward || leftwardTouch ? 'active' : ''}`}
                    ></div>
                    <div
                        onTouchStart={() => setBackwardTouch(true)}
                        onTouchEnd={() => setBackwardTouch(false)}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`key ${backward || backwardTouch ? 'active' : ''}`}
                    ></div>
                    <div
                        onTouchStart={() => setRightwardTouch(true)}
                        onTouchEnd={() => setRightwardTouch(false)}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`key ${rightward || rightwardTouch ? 'active' : ''}`}
                    ></div>
                </div>
                <div className="raw">
                    <div
                        onTouchStart={() => setJumpTouch(true)}
                        onTouchEnd={() => setJumpTouch(false)}
                        onContextMenu={(e) => e.preventDefault()}
                        className={`key ${jump || jumpTouch ? 'active' : ''} large`}
                    ></div>
                </div>
            </div>

        </div>
    )
}

export default Interface