# Javascript Dependency Injection Container

## API
* `inject` - wrap your functions\classes where you want to inject parameters
* `Container` - create instance of **Container**
    * `register` - register classes or values. Detects automatically
    * `registerFunc` - register function
    * `resolve` - resolve your type;
### Example usage

1. **Create constant identifiers for type registration**
    ```js
    // TYPE.js
    export const TYPE = Object.freeze({
        foo: 'FOO_SERVICE',
        bar: 'BAR_SERVICE',
        appConfig: 'APP_CONFIG',
    })
    ```
2. **Inject TYPE to your classes**
    ```js
    // foo.js
    import {inject} from 'jsdicon';
    import {TYPE} from './TYPE';

    export const Foo = inject(TYPE.appConfig)(
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
    import {TYPE} from './TYPE';

    export const Bar = inject(TYPE.foo, TYPE.appConfig)(
        class Bar {
            constructor(foo, appConfig) {
                this.foo = foo;
                this.appConfig = appConfig;
            }
            // ... other properties and methods
        }
    )
    ```
3. **Create DI container, register TYPE and start your app**
    ```js
    // index.js
    import {Container} from 'jsdicon';
    import {TYPE} from './TYPE';
    import {Foo} from './foo';
    import {Bar} from './bar';

    const container = new Container();
    container.register(TYPE.foo, Foo);
    container.register(TYPE.bar, Bar);
    container.register(TYPE.appConfig, {
        ENV: 'DEV',
        // ... other properties
    });

    const bar = container.resolve(TYPE.bar);
    // do something with bar
    ```

### More Examples
You can also inject values to a function. This will register function return value;
```js
// foo.js
// wrap function to inject parameters
const wrappedFoo = inject(TYPE.bar)(
    function foo(bar){
        return `Hello, ${bar}!`;
    }
);

// injex.js
import {TYPE} from './TYPE';
import {inject, Container} from 'jsdicon';

container.register(TYPE.bar, 'BAR');

container.register(TYPE.foo, wrappedFoo);

container.resolve(TYPE.foo); // 'Hello, BAR!'
```