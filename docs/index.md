# Getting Started

## Getting Started

Install `nw-builder` via `npm` or your preferred Node package manager of choice.

```shell
npm i -D nw-builder
```

### Your first application

Create a `package.json` with a `name` and `main` property. The `name` signifies your NW.js application's unique name. The `main` is the entry point of your application.

`package.json`:
```json
{
    "name": "demo",
    "main": "./index.html"
}
```

`index.html`
```html
<html>
    <head></head>
    <body>Demo</body>
</html>
```

You can also have a JavaScript file as an entry point:

`package.json`:
```json
{
    "name": "demo",
    "main": "./main.js"
}
```

`main.js`:
```javascript
nw.Window.open("./index.html", {}, () => {});
```

Refer to the [NW.js documentation](https://nwjs.readthedocs.io/en/latest/References/Window/) to learn more.

To run your application, call `nwbuild` CLI command:

```json
{
    "scripts": {
        "run": "nwbuild . --version=0.70.1 --flavour=sdk --platform=linux --arch=x64 --outDir=./out"
    }
}

```

### Tips
