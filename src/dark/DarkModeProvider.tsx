import { createContext, useEffect, useMemo } from "react";
import { OnlyChildrenProps } from "../IStdProps";
import { useSavedState } from "../useSavedState";
import React from "react"
import { detectOSDarkMode, setAppDarkMode, } from "./dark";

export interface DarkModeContextDefinition {
    darkMode: boolean
}
/**
 * The context.
 * @author zsh2401
 */
export const DarkModeContext = createContext<DarkModeContextDefinition>({
    darkMode: false
})
/**
 * The dark mode provider that
 * bring dark mode features to your
 * application and enable related hooks
 * work.
 * @author zsh2401
 * @param props 
 * @returns 
 */
export function DarkModeProvider(props: OnlyChildrenProps) {
    const [darkMode, setDarkMode] = useSavedState<boolean | null>("dark", null)

    // Auto detect OS dark mode information
    // and then set to system
    useEffect(() => {
        if (typeof darkMode !== "boolean" || darkMode === null) {
            setDarkMode(detectOSDarkMode())
        }
    }, [darkMode])

    // Applying changes to HTML document
    // when dark mode changed to a valid value.
    useEffect(() => {
        if (!darkMode) {
            return
        } else {
            setAppDarkMode(darkMode)
        }
    }, [darkMode])

    return <DarkModeContext.Provider value={{
        get darkMode() {
            return darkMode ?? false
        },
        set darkMode(value: boolean) {
            setDarkMode(value)
        }
    }}>
        {props.children}
    </DarkModeContext.Provider>
}