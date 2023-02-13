import { useState, useEffect, useCallback, DependencyList } from "react"
export enum Status {
    "pending",
    "fulfilled",
    "rejected"
}
export interface AsyncStateLoader<S> {
    (): Promise<S> | S;
}
export interface Reloader {
    (): void;
}
export interface StateSetter<S> {
    (newState: S): void;
}
export interface UseAsyncStateOptions<S> {
    initialState: S;
    loader: AsyncStateLoader<S>;
    reloadOnMounted?: boolean
    deps?: DependencyList
    onError?: (reason: any) => void;
}
export interface ReturnValue<S> {
    state: S;
    loadingStatus: Status;
    reload: Reloader;
    setter: StateSetter<S>;
}
export default function useAsyncState<S>(options: UseAsyncStateOptions<S>):
    ReturnValue<S> {

    const [state, stateSetter] = useState<S>(options.initialState);

    const [status, statusSetter] = useState<Status>(Status.pending);

    const fn = useCallback(async () => {
        try {
            const data = await options.loader();
            stateSetter(data);
            statusSetter(Status.fulfilled);
        } catch (err) {
            options.onError && options.onError(err);
            statusSetter(Status.rejected);
        }
    }, [stateSetter, statusSetter, options.onError,...(options.deps ?? [])]);

    useEffect(() => {
        if (options.reloadOnMounted === false) {
            return
        }
        fn();
    }, [options.reloadOnMounted, fn,...(options.deps ?? [])]);

    return {
        state,
        loadingStatus: status,
        reload: fn,
        setter: stateSetter
    };
}