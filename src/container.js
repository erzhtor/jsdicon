import { Constants } from "./constants";

export class Container {
    constructor() {
        this.dependencies = {};
        this.factories = {};
        this.functions = {};
    }

    registerValue(typeId, value) {
        this._assertNotExists(typeId);
        this._assertDefined(value);

        this.dependencies[typeId] = value;
    }

    register(typeId, wrappedObj) {
        this._assertNotExists(typeId);
        this._assertDefined(wrappedObj);

        if (typeof wrappedObj !== 'function') {
            throw new Error(`Class or function expected for "${typeId}". Received ${typeof func}`);
        }
        this.factories[typeId] = wrappedObj;
    }

    registerFunc(typeId, func) {
        this._assertNotExists(typeId);
        this._assertDefined(func);

        if (typeof func !== 'function') {
            throw new Error(`Function expected. Received ${typeof func}`);
        }

        this.functions[typeId] = func;
    }

    _assertNotExists(typeId) {
        if (this.factories[typeId] || this.dependencies[typeId]) {
            throw new Error(`Already registered "${typeId}"`);
        }
    }

    _assertDefined(value) {
        if (!value) {
            throw new Error(`Value for "${typeId}" should be defined. Received "${value}"`);
        }
    }

    resolve(typeId) {
        if (this.dependencies[typeId]){
            return this.dependencies[typeId];
        }
        const factory = this.factories[typeId];
        const func = this.functions[typeId];
        if (!factory && !func) {
            throw new Error(`"Can't resolve type "${typeId}". Possible not registered.`);
        }

        const dependency = this._inject(factory || func, !!func);
        this.dependencies[typeId] = this.dependency;

        return dependency;
    }

    _inject(factory, isFunc = false) {
        // TODO: throw Error on circular dependencies
        const factoryDependencies = factory[Constants.__inject__] || [];
        const args = factoryDependencies.map(factoryDependency => this.resolve(factoryDependency));
        if (isFunc) {
            return factory.apply(null, args);
        }
        return new factory(...args);
    }
}