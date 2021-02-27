# @noma

Why? Creating and maintaining micro services requires a lot of boilerplate configuration and setup. Over time the micro services will start to diverge and it becomes difficult to context switch between services as the same problems are solved in different ways in each service. The explicit goal of `noma` is to do away with most of the boiler plate and make it easy to develop micro services in an efficient and consistent manner, and to let the programmer focus on solving the business problem instead of YAK shaving.

## Getting started

Create a hello world express app.

```bash
$ npm install @noma/cli @noma/plugin-express
```

package.json

```js
{
    "main": "src/main.js",
    "dependencies": {
        "@noma/cli": "1.0.0",
        "@noma/plugin-express": "1.0.0"
    },
    "scripts": {
        "start": "noma"
    }
}
```

src/main.js

```js
export default async function main({ express }) {
  const { app } = express;

  app.get('/', helloWorld);

  function helloWorld(req, res) {
    res.send('Hello World');
  }
}
```

Run

```bash
$ npm start
```

## Packages

### System

- [@noma/cfg](packages/@noma/cfg/README.md): Configuration loading and validation.
- [@noma/cli](packages/@noma/cli/README.md): Command Line Interface.
- [@noma/dbg](packages/@noma/dbg/README.md): Debugging utility.
- [@noma/env](packages/@noma/env/README.md): Environment loading.
- [@noma/jsn](packages/@noma/jsn/README.md): JSON file loading.
- [@noma/lib](packages/@noma/lib/README.md): Noma Library.
- [@noma/mdl](packages/@noma/mdl/README.md): Module resolution and loading.
- [@noma/obj](packages/@noma/obj/README.md): Object inspection and tranformation.
- [@noma/pkg](packages/@noma/pkg/README.md): Package resolution and loading.

### Plugins

- [@noma/plugin-amqp](packages/@noma/plugin-amqp/README.md): AMQP plugin
- [@noma/plugin-express](packages/@noma/plugin-express/README.md): Express Plugin
- [@noma/plugin-http](packages/@noma/plugin-http/README.mdp): Http Plugin
- [@noma/plugin-kafka](packages/@noma/plugin-kafka/README.mdp): Kafka Plugin
- [@noma/plugin-mongodb](packages/@noma/plugin-mongodb/README.md): MongoDB Plugin
- [@noma/plugin-redis](packages/@noma/plugin-redis/README.md): Redis Plugin
- [@noma/plugin-ws](packages/@noma/plugin-ws/README.md): WS Plugin

## Development

Anyone can create and publish a noma plugin as `noma-plugin-random` or `@scope/noma-plugin-random`.

```javascript
export default function (context) {
  return {
    random: {
      number: () => Math.random(),
    },
  };
}
```

## License

Copyright 2021 Jonatan Pedersen 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
