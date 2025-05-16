export interface SelectFileOptions {
    accept?: string;
    multiple?: boolean;
}
/**
 * Show a modern browser dialog to 
 * request user to select file(s)
 * with certain type(s).
 * @author zsh2401
 * @param _options 
 * @returns 
 */
export async function selectFiles(_options?: SelectFileOptions): Promise<FileList> {
    return new Promise((res, rej) => {
        let options = {
            accept: _options?.accept ?? '*/*',
            multiple: _options?.multiple ?? false
        }

        const el = document.createElement('input')
        el.value = ""
        el.style.position = 'fixed';
        el.style.top      = '0';
        el.style.left     = '-9999px';
        document.body.appendChild(el);
        el.type = 'file'
        el.accept = options.accept
        el.multiple = options.multiple
        // el.capture = ""
        el.addEventListener('change', _ => {
            if (el.files && el.files.length > 0) {
                res(el.files);
            } else {
                rej("No files selected")
            }
            document.body.removeChild(el)
        })
        el.click()
    })
}