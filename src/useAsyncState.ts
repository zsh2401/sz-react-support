import { useState, useEffect, useCallback } from "react"
export enum Status {
    "pending",
    "fullfilled",
    "rejected"
}
export interface AsyncStateProvider<S> {
    (): Promise<S>;
}
export interface Reloader {
    (): void;
}
export interface StateSetter<S> {
    (newState: S): void;
}
export interface UseAsyncStateOptions<S> {
    initialState: S;
    provider: AsyncStateProvider<S>;
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
            const data = await options.provider();
            stateSetter(data);
            statusSetter(Status.fullfilled);
        } catch (err) {
            options.onError && options.onError(err);
            statusSetter(Status.rejected);
        }
    }, [options.provider, stateSetter, statusSetter, options.onError]);

    useEffect(() => {
        fn();
    }, []);

    return {
        state,
        loadingStatus: status,
        reload: fn,
        setter: stateSetter
    };
}