import { Constants } from "./constants";

export function inject(...typeIds) {
    return function (wrappedObject) {
        for (let typeId of typeIds) {
            if (!typeId) {
                throw new Error(`Expected non falsy typeId. Provided "${typeId}"`);
            }
            if (typeof typeId === 'string' || typeof typeId === 'number') {
                continue;
            }
            throw new Error(`Expected "number" or "string". Received "${typeof typeId}"`);
        }
        if (typeof wrappedObject !== 'function') {
            throw new Error(`Expected function or class. Provided "${typeof wrappedObject}"`)
        }
        wrappedObject[Constants.__inject__] = typeIds || [];
        return wrappedObject;
    }
}
