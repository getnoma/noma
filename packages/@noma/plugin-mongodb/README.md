# @noma/plugin-mongodb

Manage MongoDB Connections, Indexes and Schemas with the [mongodb](https://www.npmjs.com/package/mongodb) Node.js driver.

## Usage

main.js:

```js
export default async function main({ mongodb }) {
  const { client, collections, connectionString, db, connections } = mongodb;
}
```
### Configuring the default connection

config/default.yml:

```yml
mongodb:
  connections:
    default:
      connectionString: 'mongodb://default',
      collections:
        users:
          indexes:
            - - id: 1
              - unique: 1
            - - name: 1
              - unique: 1
          schema:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
```

main.js:

```js
export default async function main({ mongodb }) {
  const { client, collections, connectionString, db, connections } = mongodb;
}
```

### Configuring multiple MongoDB connections

config/default.yml:

```yml
mongodb:
  connections:
    primary:
      connectionString: 'mongodb://primary',
    secondary:
      connectionString: 'mongodb://secondary',
            
```

main.js:

```js
export default async function main({ mongodb }) {
  const { connections } = mongodb;
  const { primary, secondary } = connections;
}
```

### Removing the default MongoDB connection

config/default.yml:

```yml
mongodb:
  connections:
    default: null
```

## License

Copyright 2021 Jonatan Pedersen 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
