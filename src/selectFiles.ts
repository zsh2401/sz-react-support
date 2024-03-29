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
            accept: '*/*',
            multiple: false
        }

        if (_options) {
            options.accept = _options.accept ?? options.accept;
            options.multiple = _options.multiple ?? options.multiple;
        }

        const el = document.createElement('input')
        el.type = 'file'
        el.accept = options.accept
        el.multiple = options.multiple
        el.addEventListener('change', _ => {
            if (el.files && el.files.length > 0) {
                res(el.files);
            } else {
                rej("No files selected")
            }
        })
        el.click()
    })
}