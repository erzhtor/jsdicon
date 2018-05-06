# Javascript Dependency Injection Container

[![Build Status](https://travis-ci.org/erzhtor/jsdicon.svg?branch=master)](https://travis-ci.org/erzhtor/jsdicon)

## API
* `inject` - wrap your functions\classes where you want to inject parameters
    ```js
    // types.js
    export const TYPE = Object.freeze({
        foo: 'FOO_SERVICE',
        bar: 'BAR_SERVICE',
        appConfig: 'APP_CONFIG',
    })

    // foo.js
    import {inject} from 'jsdicon';
    import {TYPE} from './types';

    export const foo = inject(TYPE.appConfig)(
        function foo (appConfig) {
            // do something with appConfig;
            return someValue;
        }
    )

    // bar.js
    import {inject} from 'jsdicon';
    import {TYPE} from './types';

    export const Bar = inject(TYPE.foo, TYPE.appConfig)(
        class Bar {
            constructor(foo, appConfig) {
                foo; // value of foo function is now available here
            }

            startApp() {
            }
            // ... other properties and methods
        }
    )
    ```
* `Container` - create instance of **Container**
    * `register` - registers class.
    * `registerValue` - registers value.
    * `registerFunc` - registers function
    * `resolve` - resolve your type by typeId;
    ```js
    // index.js
    import {Container} from 'jsdicon';
    import {TYPE} from './types';
    import {foo} from './foo';
    import {Bar} from './bar';

    const container = new Container();
    container.register(TYPE.bar, Bar);
    container.registerFunc(TYPE.foo, foo);
    container.registerValue(TYPE.appConfig, {
        ENV: 'DEV',
        // ... other properties
    });

    const bar = container.resolve(TYPE.bar);
    bar.startApp();
    ```
