import { Constants } from "./constants";

export class Container {
    constructor() {
        this.dependencies = {};
        this.factories = {};
        this.functions = {};
    }

    register(typeId, wrappedObj) {
        this._assertNotExists(typeId);

        if (typeof wrappedObj === 'function') {
            this.factories[typeId] = wrappedObj;
            return;
        }

        this.dependencies[typeId] = wrappedObj;
    }

    registerFunc(typeId, func) {
        this._assertNotExists(typeId);

        if (typeof func !== 'function') {
            // TODO: custom errors with nice msg
            throw new Error(`Expected function. Received ${func}`);
        }
        this.functions[typeId] = func;
    }

    _assertNotExists(typeId) {
        if (this.factories[typeId] || this.dependencies[typeId]) {
            // TODO: custom errors with nice msg
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
            // TODO: custom errors with nice msg
            throw new Error(`Can't resolve type "${typeId}"`);
        }

        const dependency = this._inject(factory || func, !!func);
        this.dependencies[typeId] = this.dependency;

        return dependency;
    }

    _inject(factory, isFunc = false) {
        // throw Error on circular dependencies
        const factoryDependencies = factory[Constants.__inject__] || [];
        const args = factoryDependencies.map(factoryDependency => this.resolve(factoryDependency));
        if (isFunc) {
            return factory.apply(null, args);
        }
        return new factory(...args);
    }
}