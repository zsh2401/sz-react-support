import { useContext } from "react";
import { DarkModeContext } from "./DarkModeProvider";

/**
 * The hooks for application dark mode.
 * You should wrap your entire application
 * with {@link DarkModeProvider} first.
 * 
 * <DarkModeProvider>
 * <App/>
 * </DarkModeProvider>
 * @author zsh2401
 * @returns 
 */
export function useDarkMode(): [boolean, React.Dispatch<boolean>] {
    const context = useContext(DarkModeContext)
    return [context.darkMode, (value: boolean) => context.darkMode = value]
}