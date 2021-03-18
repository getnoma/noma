# @noma/plugin-amqplib

Creates `AMQP` connections with [amqplib](https://www.npmjs.com/package/amqplib).

## Usage

main.js:

```js
export default async function main({ amqplib }) {
  const { connection, connections } = mongodb;
}
```
### Configuring the default AMQP connection

config/default.yml:

```yml
amqplib:
  connections:
    default:
      connectionString: "amqp://default"
```

main.js:

```js
export default async function main({ amqplib }) {
  const { connection, connections } = amqplib;
}
```

### Configuring multiple AMQP connections

config/default.yml:

```yml
amqplib:
  connections:
    primary:
      connectionString: "amqp://primary"
    secondary:
      connectionString: "amqp://secondary"
            
```

main.js:

```js
export default async function main({ amqplib }) {
  const { connections } = amqplib;
  const { primary, secondary } = connections;
}
```

### Removing the default AMQP connection

config/default.yml:

```yml
amqplib:
  connections:
    default: null
```

## License

Copyright 2021 Jonatan Pedersen 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
