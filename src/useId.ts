import { useEffect, useState } from "react"
export function useId() {
    const [id] = useState(() => allocate())
    useEffect(() => {
        return () => {
            free(id)
        }
    })
    return id;
}

export type Id = string;
export interface IdRecorder {
    [key: string]: boolean;
}
const records = new Array<Id>();
function allocate(): Id {
    let id: Id;
    do {
        id = _generateId();
    } while (_wasUsed(id))
    _record(id);
    return id;
}
function free(id: Id) {
    _remove(id);
}

function _generateId(): Id {
    let id: number = Math.ceil(Math.random() * 100000000);
    return "__random_tmp_id_" + id;
}
function _getRecordArray(): Array<Id> {
    return records;
}
function _wasUsed(id: Id): boolean {
    return _getRecordArray().findIndex((_id) => _id === id) !== -1;
}
function _remove(id: Id) {
    let index = _getRecordArray().indexOf(id);
    if (index >= 0) {
        _getRecordArray().splice(index, 1);
    }
}
function _record(id: Id) {
    _getRecordArray().push(id);
}
