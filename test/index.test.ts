import * as fs from 'node:fs'
import updateDotenv from "../dist/index.js";
import * as os from "node:os";
import * as path from 'node:path';
import { describe, beforeEach, afterEach, test } from 'node:test';
import assert from "node:assert/strict";

const originalCwd = process.cwd()
// Make a copy of current env
const originalEnv = Object.assign({}, process.env)

describe('update-dotenv', () => {
  beforeEach(async () => {
    process.chdir(fs.mkdtempSync(path.join(os.tmpdir(), 'update-dotenv')))
  })

  afterEach(() => {
    process.env = originalEnv
    process.chdir(originalCwd)
  })

  test('creates .env, writes new values, sets process.env', async () => {
    await updateDotenv({ FOO: 'bar' })
    assert.equal(fs.readFileSync('.env', { encoding: 'utf-8' }), 'FOO=bar')
    assert.equal(process.env.FOO, "bar")
  })

  test('properly writes multi-line strings', async () => {
    await updateDotenv({ FOO: 'bar\nbaz' })
    assert(fs.readFileSync('.env', {encoding: "utf-8"}), 'FOO="bar\\nbaz"')
  })

  test('appends new variables to existing variables', async () => {
    await updateDotenv({ FIRST: 'foo' })
    await updateDotenv({ SECOND: 'bar' })
    assert(fs.readFileSync('.env', {encoding: "utf-8"}), 'FIRST=foo\nSECOND=bar')
  })

  test('wraps strings with spaces in quotes', async () => {
    await updateDotenv({ FOO: 'foo bar' })
    assert(fs.readFileSync('.env', {encoding: "utf-8"}), 'FOO=\'foo bar\'')
  })

  test('wraps strings with dollar signs in quotes', async () => {
    await updateDotenv({ FOO: '$foo $bar' })
    assert(fs.readFileSync('.env', {encoding: "utf-8"}), 'FOO=\'$foo $bar\'')
  })

  test('escapes single quotes', async () => {
    await updateDotenv({ FOO: '\'foo\' "$and" \'bar\'' })
    assert(fs.readFileSync('.env', {encoding: "utf-8"}), 'FOO=\'\\\'foo\\\' "$and" \\\'bar\\\'\'')
  })

  test('escapes double quotes', async () => {
    await updateDotenv({ FOO: "\"foo\"\n'$and'\n\"bar\"" })
    assert(fs.readFileSync('.env', {encoding: "utf-8"}), 'FOO="\\"foo\\"\\n\'\\$and\'\\n\\"bar\\""')
  })
})
