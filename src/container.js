import { Constants } from "./constants";

export class Container {
    constructor() {
        this.dependencies = {};
        this.factories = {};
        this.functions = {};
        this.injecting = {};
    }

    registerValue(typeId, value) {
        this._assertUnique(typeId);

        this.dependencies[typeId] = value;
    }

    register(typeId, wrappedObj) {
        this._assertUnique(typeId);

        if (typeof wrappedObj !== 'function') {
            throw new Error(`Class or function expected for "${typeId}". Received "${typeof wrappedObj}"`);
        }
        this.factories[typeId] = wrappedObj;
    }

    registerFunc(typeId, func) {
        this._assertUnique(typeId);

        if (typeof func !== 'function') {
            throw new Error(`Function expected. Received "${typeof func}"`);
        }

        this.functions[typeId] = func;
    }

    _assertUnique(typeId) {
        if (this.factories[typeId] || this.dependencies[typeId]) {
            throw new Error(`Already registered "${typeId}"`);
        }
    }

    resolve(typeId) {
        if (this.dependencies[typeId]){
            return this.dependencies[typeId];
        }
        const factory = this.factories[typeId];
        const func = this.functions[typeId];
        if (!factory && !func) {
            throw new Error(`Can't resolve type "${typeId}". Possibly not registered.`);
        }

        if (this.injecting[typeId]) {
            throw new Error(`Cannot resolve circular dependencies for "${typeId}"`);
        }

        this.injecting[typeId] = true;

        const dependency = this._inject(factory || func, !!func);
        this.dependencies[typeId] = this.dependency;

        this.injecting[typeId] = false;
        return dependency;
    }
    _inject(factory, isFunc = false) {
        const factoryDependencies = factory[Constants.__inject__] || [];
        const args = factoryDependencies.map(factoryDependency => this.resolve(factoryDependency));
        if (isFunc) {
            return factory.apply(null, args);
        }
        return new factory(...args);
    }
}