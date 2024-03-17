import { useCallback, useEffect, useState } from "react";
import { useEvent } from "./useEvent"
import lf from "localforage"
/**
 * The state will be saved to disk and reload
 * next time. All components that use same key with
 * this hook will affect each other. Any one of them 
 * changed the value will trigger update all related 
 * components.
 * @author zsh2401
 * @param key 
 * @param defaultValue 
 * @returns 
 */
export function useSavedState<S>(key: string, defaultValue: S): [S,
    (newState: S) => void] {

    const [value, setValue] = useState(defaultValue)

    const valueUpdate = useCallback((value: S) => {
        setValue(value)
    }, [setValue])

    const trigger = useEvent<S>(`__px_state_update_value:${key}`, valueUpdate)


    useEffect(() => {
        (async () => {
            const value = await lf.getItem<S>(key)
            if (value) {
                setValue(value)
            }
        })()
    }, [key, defaultValue])

    return [value, (state: S) => {
        setValue(state);
        (async () => {
            await lf.setItem(key, state)
            trigger(state)
        })()
    }]
}