import { v4 } from 'uuid'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { ClassEventContext } from './EventProvider'

export type Class<T> = ObjectType<T> | Function
export type ObjectType<T> = {
    new(): T
}
export interface Listener<E> {
    (event: E): void
}
export interface Trigger<E> {
    (event: E): void
}
const classMap: WeakMap<Class<any>, string> = new Map()

export function useClassEvent<E extends object>(
    eventClass: Class<E>,
    listener?: Listener<E>
): Trigger<E> {
    const key = useMemo(() => {
        if (classMap.has(eventClass)) {
            return classMap.get(eventClass)!
        } else {
            const key = v4()
            classMap.set(eventClass, key)
            return key
        }
    }, [eventClass])
    return useEvent(key, listener)
}

export function useEvent<E extends object>(
    eventKey: string,
    listener?: Listener<E>
): Trigger<E> {
    const context = useContext(ClassEventContext)
    useEffect(() => {
        if (!listener) {
            return () => { }
        }
        context.eventBus.on(eventKey, listener)
        return () => {
            context.eventBus.off(eventKey, listener)
        }
    }, [listener, context.eventBus])

    const trigger: Trigger<E> = useCallback(
        (args: E) => {
            context.eventBus.emit(eventKey, args)
        },
        [context.eventBus]
    )

    return trigger
}
