import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

function escapeCharacters (str: string) {
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

function format (key: string, value: string) {
  return `${key}=${escapeCharacters(value)}`
}

export default async function updateDotenv(env: Record<string, any>) {
  const filename = path.join(process.cwd(), '.env')

  // Merge with existing values
  try {
    const existing = dotenv.parse(await promisify(fs.readFile)(filename, 'utf-8'))
    env = Object.assign(existing, env)
  } catch (err:any) {
    if ("code" in err && err.code !== 'ENOENT') {
      throw err
    }
  }

  const contents = Object.keys(env).map(key => format(key, env[key])).join('\n')
  await promisify(fs.writeFile)(filename, contents)

  // Update current env with new values
  Object.assign(process.env, env)

  return env
}
