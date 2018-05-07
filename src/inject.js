import { Constants } from "./constants";

export function inject(...typeIds) {
    return function (wrappedObject) {
        for (let typeId of typeIds) {
            if (!typeId) {
                throw new Error(`Incorrect typeId ${typeId}. Must be non falsy value`);
            }
            if (typeof typeId === 'string' || typeof typeId === 'number' || typeof typeId === 'symbol') {
                continue;
            }
            throw new Error(`Type identifier "${typeId}" `+
                `must be typeof "symbol" or "number" or "string". Received "${typeof typeId}"`+
                `Wrapped object ${wrappedObject}`);
        }
        if (typeof wrappedObject !== 'function') {
            throw new Error(`Can't inject types to non function object. Provided ${wrappedObject}`)
        }
        wrappedObject[Constants.__inject__] = typeIds || [];
        return wrappedObject;
    }
}
