import { Constants } from "./constants";

export function inject(...injectTypeIds) {
    // TODO: check typeIds
    return function (obj) {
        if (typeof obj !== 'function') {
            // TODO: custom error with nice msg
            throw new Error(`Can't inject types to non function object. Provided ${obj}`)
        }
        obj[Constants.__inject__] = injectTypeIds || [];
        return obj;
    }
}
