/**
 * Check if a string is 
 * blank (all chars is space) 
 * or null or empty(length=0)
 * 
 * @author zsh2401
 * @param str
 * @returns
 */
export function isBlankOrNullOrEmpty(str?: string) {
    return str === void 0 || str === null || str.length === 0 || isBlank(str)
}
/**
 * Check if a string is blank.
 * @author zsh2401
 * @param str
 * @returns
 */
export function isBlank(str: string) {
    for (let i = 0; i < str.length; i++) {
        if (str[i] !== ' ') {
            return false
        }
    }
    return true
}
