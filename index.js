const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

function escapeCharacters (str) {
  let wrapper = ''

  // If the string contains a space or dollar sign, wrap it in single quotes.
  if (str.match(/[\s$]/)) {
    wrapper = '\''
  }

  // If the string contains a newline, escape it and wrap in double quotes.
  // Also escape any dollar signs to prevent interpolation.
  if (str.match(/\n/)) {
    str = str.replace(/\$/g, '\\$').replace(/\n/g, '\\n')
    wrapper = '"'
  }

  // If we're wrapping the string, escape any wrapper characters.
  if (wrapper !== '') {
    str = str.replace(new RegExp(wrapper, 'g'), `\\${wrapper}`)
  }

  // Wrap the string (if necessary) and return it.
  return [wrapper, str, wrapper].join('')
}

function format (key, value) {
  return `${key}=${escapeCharacters(value)}`
}

module.exports = async function updateDotenv (env) {
  const filename = path.join(process.cwd(), '.env')

  // Merge with existing values
  try {
    const existing = dotenv.parse(await promisify(fs.readFile)(filename, 'utf-8'))
    env = Object.assign(existing, env)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
  }

  const contents = Object.keys(env).map(key => format(key, env[key])).join('\n')
  await promisify(fs.writeFile)(filename, contents)

  // Update current env with new values
  Object.assign(process.env, env)

  return env
}
