/**
 * Sleep for a moment
 * @author zsh2401
 * @param ms
 * @returns
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}
/**
 * Go to next event loop.
 *
 * @author zsh2401
 * @param task
 */
export async function nextSchedule(
    task?: TaskAtNextSchedule,
    timeout = 0
): Promise<void> {
    await sleep(timeout)
    task && (await task())
}

export interface TaskAtNextSchedule {
    (): Promise<void> | void
}
