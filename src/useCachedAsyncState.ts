import {
    useAsyncState,
    ReturnValue,
    UseAsyncStateOptions,
} from './useAsyncState'
import lf from 'localforage'
import { useEffect, useMemo } from 'react'
import { useState } from 'react'
export default function <A, S>(
    key: string,
    options: UseAsyncStateOptions<A, S>
): ReturnValue<A, S> {
    
    const _key = useMemo(() => {
        return `__${key}`
    }, [key])

    const { reloadOnMounted, ...rest } = options
    const asyncState = useAsyncState({ reloadOnMounted: false, ...rest })
    const [stage, setStage] = useState<"reading-cache" | "fetching-remote">("reading-cache")

    useEffect(() => {
        if (stage !== "reading-cache") {
            return
        }
        // eslint-disable-next-line no-extra-semi
        ; (async () => {
            const value = await lf.getItem<S>(_key)
            if (value === null) {
                asyncState.setter(options.initialState)
            } else {
                asyncState.setter(value)
            }
            setStage("fetching-remote")
        })()

    }, [_key, asyncState.setter, asyncState.loadingStatus, stage, options.initialState])

    useEffect(() => {
        setStage("reading-cache")
    }, [_key, setStage])

    useEffect(() => {
        if (stage === "fetching-remote" && reloadOnMounted) {
            asyncState.reload()
        }
    }, [stage, reloadOnMounted])

    useEffect(() => {
        if (stage === "fetching-remote") {
            lf.setItem<S>(_key, asyncState.state)
        }
    }, [stage, asyncState.state])

    return asyncState
}
