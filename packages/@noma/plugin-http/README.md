# @noma/plugin-http

Creates HTTP servers and listens on configured ports.

## Usage

main.js:

``` js
export default async function main({ http }) {
    http.server.on('request', (req, res) => {
        res.send('hello world')
    })
}
```

### Configuring the default HTTP server

config/default.yml:

``` yml
http:
    servers:
        default:
            port: 80
```

main.js:

``` js
export default async function main({ http }) {
    assert(http.server.port === 80)
    assert(http.servers.default.port === 80)

    http.server.on('request', (req, res) => {
        res.send('hello world')
    })
}
```

### Configuring multiple HTTP servers

config/default.yml:

``` yml
http:
    servers:
        app:
            port: 8080
        api:
            port: 8181
```

main.js:

``` js
export default async function main({ http }) {
    const { app, api } = http.servers;

    assert(app.port === 8080)
    assert(api.port === 8181)

    app.on('request', (req, res) => {
        res.set('X-Http-Server-Name', 'app')
        
    })

    api.on('request', (req, res) => {
        res.set('X-Http-Server-Name', 'api')
        res.end()
    })
}
```

### Removing the default HTTP server

config/default.yml:

``` yml
http:
    servers:
        default: null
```

## License

Copyright 2021 Jonatan Pedersen 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
