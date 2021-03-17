# @noma/plugin-express

Creates Express Applications and optionally adds to configured HTTP or HTTPS servers.

## Usage

main.js:

``` js
export default async function main({ express }) {
    express.app.get('/', (req, res) => {
        res.send('hello world')
    })
}
```

### Configuring the default app

config/default.yml:

``` yml
http:
    servers:
        other:
            port: 8080
express:
    apps:
        default:
            servers:
                - other
```

main.js:

``` js
export default async function main({ express }) {
    express.app.get('/', (req, res) => {
        res.send('hello world')
    })
}
```

### Configuring multiple apps

config/default.yml:

``` yml
https:
    servers:
        default:
            port: 8080
        app:
            port: 8081
        api:
            port: 8082
express:
    apps:
        default:
            servers:
                - default
                - app
                - api
        app:
            servers:
                - app
        api:
            servers:
                - api
```

main.js:

``` js
export default async function main({ express }) {
    express.apps.default.get('/', (req, res, next) => {
      res.set('X-App', 'default')

      next()
    })

    express.apps.app.get('/', (req, res, next) => {
      res.set('X-App', 'app')

      res.end()
    })

    express.apps.api.get('/', (req, res, next) => {
      res.set('X-Api', 'api')

      res.end()
    })
}
```

### Removing the default app

config/default.yml:

``` yml
express:
    apps:
        default: null
```

## License

Copyright 2021 Jonatan Pedersen 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
