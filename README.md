![GETNOMA](getnoma.png)

NOMA is an open source dependency orchestrator and code runner for [Node.js](https://nodejs.org/).

[![@git-json-merge](https://circleci.com/gh/getnoma/noma.svg?style=shield)](https://app.circleci.com/pipelines/github/getnoma/noma)

### Why

There are a lot of YAK-shaving required to build a production ready node application. The community has tried to solve this through use of templates and project generators. This can work well for some projects, but it does not scale very well in a micro app centric environment. Generated code goes stale and is never kept up to date when the generators themselves are updated. This leads to code divergence in projects that in turn increases the cost of maintaining these projects. Code generation is often just a one off benefit, a get started quickly scheme that too often loses its apeal.

Maybe there is a better way. Or not, time will tell. The purpose of NOMA is to do away with most of the YAK-shaving, and allow developers to focus on writing code that serves their users rather than the YAKs.

NOMA attempts to automate dependency orchestration for dependencies such as http servers and database connections, so instead of writing code like this:

```javascript
import express from 'express';

const app = expres();

app.get('/', (req, res) => {
  res.send('Hello World');
});

const port = process.env.PORT || 8080;

app.listen(port);
```

You write code like this:
```javascript
export function main({ express }) {
  express.app.get('/', (req, res) => {
    res.send('Hello World');
  });
}
```

The express plugin for NOMA takes care of instantiating and starting the express application for you. The example above is only that, an example. 

NOMA is not a web server, or worker process, or anything in particular, it does nothing on its own, other than to orchestrate your app's dependencies through plugins. A plugin is just a function that takes dependecies as arguments and returns a value that other plugins can depend on. In essence:

name.js:

```javascript
export function() {
  return () => 'John'
}
```

hello.js:

```javascript

export function({ name }) {
  return () => console.log(`Hello ${name()}`);
}
```

main.js:

```javascript
export function({ hello }) {
  hello();
}
```

``` bash
$ noma ./main.js

// Hello John
```

## Getting started

Create a hello world express app using the noma CLI and the expres plugin.

``` bash
$ npm install @noma/cli @noma/plugin-express
```

package.json

```javascript
{
    "main": "src/main.js",
    "dependencies": {
        "@noma/cli": "^1.0.0",
        "@noma/plugin-express": "^1.0.0"
    },
    "scripts": {
        "start": "export PORT=8080 noma ."
    }
}
```

src/main.js

```javascript
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

- [@noma/cli](packages/@noma/cli/README.md): Command Line Interface (Start here).
- [@noma/core](packages/@noma/core/README.md): Core Library (Used by CLI, and can be used directly in tests).

### Plugins

Plugins maintained by `getnoma`.

- [@noma/plugin-amqp](packages/@noma/plugin-amqp/README.md)
- [@noma/plugin-express](packages/@noma/plugin-express/README.md)
- [@noma/plugin-http](packages/@noma/plugin-http/README.md)
- [@noma/plugin-https](packages/@noma/plugin-https/README.md)
- [@noma/plugin-kafka](packages/@noma/plugin-kafka/README.md)
- [@noma/plugin-mongodb](packages/@noma/plugin-mongodb/README.md)
- [@noma/plugin-redis](packages/@noma/plugin-redis/README.md)
- [@noma/plugin-ws](packages/@noma/plugin-ws/README.md)

### Helpers

Helper packages used by `@noma/core`.

- [@noma/helper-config](packages/@noma/helper-config/README.md): Configuration loading and validation.
- [@noma/helper-debug](packages/@noma/helper-debug/README.md): Debugging utility.
- [@noma/helper-env](packages/@noma/helper-env/README.md): Environment loading.
- [@noma/helper-json](packages/@noma/helper-json/README.md): JSON file loading.
- [@noma/helper-modules](packages/@noma/helper-modules/README.md): Module resolution and loading.
- [@noma/helper-objects](packages/@noma/helper-objects/README.md): Object inspection and tranformation.
- [@noma/helper-packages](packages/@noma/helper-packages/README.md): Package resolution and loading.

## Development

Anyone can create and publish a noma plugin as `noma-plugin-[name]` or `@scope/noma-plugin-[name]`.

@noma/plugin-numbers defined as:

```javascript
export default function (context) {
  return {
    random: () => Math.random(),
  };
}
```

Can be used like this:

```javascript
export default function ({ numbers }) {
  const { random } = numbers;

  console.log(random());
}
```

## License

Copyright 2021 Jonatan Pedersen 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
