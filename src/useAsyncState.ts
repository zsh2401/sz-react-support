import { useState, useEffect, useCallback, DependencyList } from "react"
export enum Status {
    "pending",
    "fulfilled",
    "rejected"
}
export interface AsyncStateLoader<A, S> {
    (args?: Partial<A>): Promise<S> | S;
}
export interface Reloader<A, S> {
    (args?: Partial<A>): Promise<S>;
}
export interface StateSetter<S> {
    (newState: S): void;
}
export interface UseAsyncStateOptions<A, S> {
    initialState: S;
    loader: AsyncStateLoader<A, S>;
    /**
     * @default false
     */
    reloadOnMounted?: boolean
    deps?: DependencyList
    onError?: (reason: any) => void;
}
export interface ReturnValue<A, S> {
    state: S;
    loadingStatus: Status;
    reload: Reloader<A, S>;
    setter: StateSetter<S>;
}
export function useAsyncState<A, S>(options: UseAsyncStateOptions<A, S>):
    ReturnValue<A, S> {

    const [state, stateSetter] = useState<S>(options.initialState);

    const [status, statusSetter] = useState<Status>(Status.pending);

    const fn = useCallback(async (args?: Partial<A>) => {
        try {
            const data = await options.loader(args);
            stateSetter(data);
            statusSetter(Status.fulfilled);
            return data
        } catch (err) {
            options.onError && options.onError(err);
            statusSetter(Status.rejected);
            throw err
        }
    }, options.deps ?? []);

    const [firstTime, setFirstTime] = useState(true)

    useEffect(() => {
        if (options.reloadOnMounted && firstTime) {
            fn()
            setFirstTime(false)
        } else if (!firstTime) {
            fn()
            setFirstTime(false)
        }
    }, [fn, firstTime])

    useEffect(() => {
        fn()
    }, []);

    return {
        state,
        loadingStatus: status,
        reload: fn,
        setter: stateSetter
    };
}