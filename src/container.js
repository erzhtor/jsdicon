import { Constants } from "./constants";

export class Container {
    constructor() {
        this.dependencies = {};
        this.factories = {};
    }

    register(typeId, obj) {
        if (this.factories[typeId] || this.dependencies[typeId]) {
            // TODO: custom errors with nice msg
            throw new Error(`Already registered "${typeId}"`);
        }
        if (typeof obj === 'function') {
            this.factories[typeId] = obj;
            return;
        }

        this.dependencies[typeId] = obj;
    }

    resolve(typeId) {
        if (this.dependencies[typeId]){
            return this.dependencies[typeId];
        }
        const factory = this.factories[typeId];
        if (!factory) {
            // TODO: custom errors with nice msg
            throw new Error(`Can't resolve type "${typeId}"`);
        }

        const dependency = this._inject(factory);
        this.dependencies[typeId] = this.dependency;

        return dependency;
    }

    _inject(factory) {
        const factoryDependencies = factory[Constants.__inject__] || [];
        const args = factoryDependencies.map(factoryDependency => this.resolve(factoryDependency));
        return new factory(...args);
    }
}