import { createContext, useContext, useMemo } from "react";
import { Levent } from "levent"
import { ChildrenProps, IStdProps } from "./IStdProps";
import React from "react"
export interface ClassEventContextDefine {
    eventBus: Levent
}
export const ClassEventContext = createContext<ClassEventContextDefine>({
    eventBus: new Levent()
})
export function EventProvider(props: ChildrenProps) {
    const eventBus = useMemo<Levent>(() => new Levent(), [])
    return <ClassEventContext.Provider value={
        { eventBus }
    }>
        {props.children}
    </ClassEventContext.Provider>
}