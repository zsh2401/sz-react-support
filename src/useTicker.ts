import { useEffect } from "react";
export type ShouldContinueTick = boolean;
export function useTicker(tickCallback: () => ShouldContinueTick, intervalMs: number = 1000, deps: readonly [] = []) {
    useEffect(() => {
        let destoryed = false;
        let interval = setInterval(() => {
            if (destoryed) {
                clearInterval(interval);
                return;
            }
            let should = tickCallback();
            if (!should) {
                clearInterval(interval);
            }
        }, intervalMs);
        return () => {
            destoryed = true;
        }
    }, deps);
}