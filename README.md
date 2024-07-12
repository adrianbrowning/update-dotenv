# update-dotenv

A fork of [davehensley/update-dotenv](https://github.com/davehensley/update-dotenv), which is a fork of [bkeepers/update-dotenv](https://github.com/bkeepers/update-dotenv)

This adds support for wrapping lines with special characters (space or $) with a `'` (single quote).

> A NodeJS module to write updates to a .env file

## Installation

```shell
// pnpm
pnpm add dotenv @gingacodemonkey/update-dotenv

// npm
npm install dotenv @gingacodemonkey/update-dotenv

//jsr
npx jsr add @gingacodemonkey/update-dotenv
pnpm dlx jsr add @gingacodemonkey/update-dotenv
```

## Usage

### MJS

```js
import updateDotenv from'@gingacodemonkey/update-dotenv'

updateDotenv({
  MY_VARIABLE: 'new value'
}).then((newEnv) => console.log('Done!', newEnv))
```

### CJS

```js
const {default: updateDotenv} = require('@gingacodemonkey/update-dotenv');

updateDotenv({
  MY_VARIABLE: 'new value'
}).then((newEnv) => console.log('Done!', newEnv))
```



## License

[ISC](LICENSE)
