import { v4 } from 'uuid'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { ClassEventContext } from './EventProvider'

export type Class<T> = ObjectType<T> | Function
export type ObjectType<T> = {
    new (): T
}
export interface Listener<E> {
    (event: E): void
}
export interface Trigger<E> {
    (event: E): void
}
const map: Map<Class<any>, string> = new Map()
export default function useEvent<E extends object>(
    objectClass: Class<E>,
    listener?: Listener<E>
): Trigger<E> {
    const context = useContext(ClassEventContext)
    const randomId = useMemo(() => {
        if (!map.has(objectClass)) {
            map.set(objectClass, v4())
        }
        return map.get(objectClass)!
    }, [objectClass])

    useEffect(() => {
        if (!listener) {
            return () => {}
        }
        context.eventBus.on(randomId, listener)
        return () => {
            context.eventBus.off(randomId, listener)
        }
    }, [listener, context.eventBus])

    const trigger: Trigger<E> = useCallback(
        (args: E) => {
            context.eventBus.emit(randomId, args)
        },
        [context.eventBus]
    )

    return trigger
}
