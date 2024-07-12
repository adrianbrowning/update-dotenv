# update-dotenv

A fork of [davehensley/update-dotenv](https://github.com/davehensley/update-dotenv), which is a fork of [bkeepers/update-dotenv](https://github.com/bkeepers/update-dotenv)

This adds support for wrapping lines with special characters (space or $) with a `'` (single quote).

> A NodeJS module to write updates to a .env file

## Installation

```
npm install dotenv update-dotenv
pnpm add dotenv update-dotenv
```

## Usage

```js
const updateDotenv = require('update-dotenv')

updateDotenv({
  MY_VARIABLE: 'new value'
}).then((newEnv) => console.log('Done!', newEnv))
```

## License

[ISC](LICENSE)
