import { useState, useEffect, useCallback, DependencyList } from "react"
import lf from "localforage"
/**
 * Async state status
 */
export enum Status {
    "pending",
    "fulfilled",
    "rejected"
}
/**
 * Remote data loader.
 */
export interface AsyncStateLoader<A, S> {
    (args?: Partial<A>): Promise<S> | S;
}
/**
 * Trigger reload without dependencies' update
 */
export interface Reloader<A, S> {
    (args?: Partial<A>): Promise<S>;
}
/**
 * Set the state manually
 */
export interface StateSetter<S> {
    (newState: S): void;
}
export interface UseAsyncStateOptions<A, S> {

    /**
     * Local cache key.
     */
    localCacheKey?: string

    /**
     * Initial state when loader's promise is not resolved.
     */
    initialState: S;

    /**
     * Async data loader such as fetch operation, ajax and etc.
     */
    loader: AsyncStateLoader<A, S>;

    /**
     * @default false
     */
    reloadOnMounted?: boolean

    /**
     * Dependencies
     */
    deps?: DependencyList

    /**
     * 
     * @deprecated Unsure update behaviour.
     * @param reason 
     * @returns 
     */
    onError?: (reason: any) => void;
}
export interface ReturnValue<A, S> {
    state: S;
    loadingStatus: Status;
    reload: Reloader<A, S>;
    setter: StateSetter<S>;
}
/**
 * Better way to manage your asynchronous state.
 * @author zsh2401
 * @param options 
 * @returns 
 */
export function useAsyncState<A, S>(options: UseAsyncStateOptions<A, S>):
    ReturnValue<A, S> {

    const [state, stateSetter] = useState<S>(options.initialState);
    const [status, statusSetter] = useState<Status>(Status.pending);

    const rawCachedFn = useCallback(options.loader,options.deps ?? [])
    const asyncStateOperator = useCallback(async (args?: Partial<A>) => {
        try {
            const data = await rawCachedFn(args);
            stateSetter(data);
            statusSetter(Status.fulfilled);
            return data
        } catch (err) {
            options.onError && options.onError(err);
            statusSetter(Status.rejected);
            throw err
        }
    }, [rawCachedFn, options.onError, statusSetter, stateSetter]);

    const [firstTime, setFirstTime] = useState(true)

    useEffect(() => {
        (async () => {

            if (firstTime && options.localCacheKey) {
                // Local cache key has been set, try load it first
                const cachedValue = await lf.getItem<S>(options.localCacheKey)
                if (cachedValue !== null) {
                    // Fulfilled
                    statusSetter(Status.fulfilled)
                    stateSetter(cachedValue)
                }
            }

            const shouldLoadWhenMounted = firstTime && options.reloadOnMounted;
            const isDepUpdated = !firstTime

            if (shouldLoadWhenMounted || isDepUpdated) {
                const newState = await asyncStateOperator()
                if (options.localCacheKey) {
                    await lf.setItem(options.localCacheKey, newState)
                }
            }
            setFirstTime(false)
        })()
    }, [asyncStateOperator, options.reloadOnMounted, options.localCacheKey, firstTime])

    return {
        state,
        loadingStatus: status,
        reload: asyncStateOperator,
        setter: stateSetter
    };
}