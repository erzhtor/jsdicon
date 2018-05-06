# Javascript Dependency Injection Container
### Example usage

1. **Create constant identifiers for type registration**
    ```js
    // types.js
    export const TYPES = Object.freeze({
        foo: 'FOO_SERVICE',
        bar: 'BAR_SERVICE',
        appConfig: 'APP_CONFIG',
    })
    ```
2. **Inject types to your services**
    ```js
    // foo.js
    import {inject} from 'jsdicon';
    import {TYPES} from './types';

    export const Foo = inject(TYPES.appConfig)(
        class Foo {
            constructor(appConfig) {
                this.appConfig = appConfig;
            }
            // ... other properties and methods
        }
    )
    ```
    ```js
    // bar.js
    import {inject} from 'jsdicon';
    import {TYPES} from './types';

    export const Bar = inject(TYPES.foo, TYPES.appConfig)(
        class Bar {
            constructor(foo, appConfig) {
                this.foo = foo;
                this.appConfig = appConfig;
            }
            // ... other properties and methods
        }
    )
    ```
3. **Create DI container, register types and start your app**
    ```js
    // index.js
    import {Container} from 'jsdicon';
    import {TYPES} from './types';
    import {Foo} from './foo';
    import {Bar} from './bar';

    const container = new Container();
    container.register(TYPES.foo, Foo);
    container.register(TYPES.bar, Bar);
    container.register(TYPES.appConfig, {
        ENV: 'DEV',
        // ... other properties
    });

    const bar = container.resolve(TYPES.bar);
    // do something with bar
    ```