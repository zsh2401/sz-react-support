const html = document.querySelector('html')!
const statusBarMeta = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]'
)
const themeColorMeta =
    document.querySelector(
        'meta[name="theme-color"]'
    )
export function detectOSDarkMode() {
    return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    )
}
export function isAppDarkMode(): boolean {
    return html.classList.contains('dark')
}
function applyLightMode() {
    html.classList.remove('dark')
    html.classList.add('light')
    statusBarMeta?.setAttribute('content', 'default')
    themeColorMeta?.setAttribute("content", "#ffffff")
    html.removeAttribute('data-prefers-color-scheme')
}
function applyDarkMode() {
    html.classList.remove('light')
    html.classList.add('dark')
    statusBarMeta?.setAttribute('content', 'black')
    themeColorMeta?.setAttribute("content", "#000000")
    html.setAttribute(
        'data-prefers-color-scheme',
        'dark'
    )
}
export function setAppDarkMode(value: boolean) {
    if (value) {
        applyDarkMode()
    } else {
        applyLightMode()
    }
}