import * as fs from 'node:fs'
// @ts-ignore
import updateDotenv from "../dist/index.js";
import * as os from "node:os";
import * as path from 'node:path';
import {describe, beforeEach, afterEach, test} from 'node:test';
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
        await updateDotenv({FOO: 'bar'})
        assert.equal(fs.readFileSync('.env', {encoding: 'utf-8'}), 'FOO=bar')
        assert.equal(process.env.FOO, "bar")
    })

    test('set multi keys/values', async () => {
        await updateDotenv({FOO: 'bar', BAR: 'foo'})
        assert.equal(fs.readFileSync('.env', {encoding: 'utf-8'}), 'FOO=bar\nBAR=foo')
        assert.equal(process.env.FOO, "bar");
        assert.equal(process.env.BAR, "foo");
    })

    test('properly writes multi-line strings', async () => {
        await updateDotenv({FOO: 'bar\nbaz'})
        assert.equal(fs.readFileSync('.env', {encoding: "utf-8"}), 'FOO="bar\\nbaz"')
    })

    test('appends new variables to existing variables', async () => {
        await updateDotenv({FIRST: 'foo'})
        await updateDotenv({SECOND: 'bar'})
        assert.equal(fs.readFileSync('.env', {encoding: "utf-8"}), 'FIRST=foo\nSECOND=bar')
    })

    test('wraps strings with spaces in quotes', async () => {
        await updateDotenv({FOO: 'foo bar'})
        assert.equal(fs.readFileSync('.env', {encoding: "utf-8"}), 'FOO=\'foo bar\'')
    })

    test('wraps strings with dollar signs in quotes', async () => {
        await updateDotenv({FOO: '$foo $bar'})
        assert.equal(fs.readFileSync('.env', {encoding: "utf-8"}), 'FOO=\'$foo $bar\'')
    })

    test('escapes single quotes', async () => {
        await updateDotenv({FOO: '\'foo\' "$and" \'bar\''})
        assert.equal(fs.readFileSync('.env', {encoding: "utf-8"}), 'FOO=\'\\\'foo\\\' "$and" \\\'bar\\\'\'')
    })

    test('escapes double quotes', async () => {
        await updateDotenv({FOO: "\"foo\"\n'$and'\n\"bar\""})
        assert.equal(fs.readFileSync('.env', {encoding: "utf-8"}), 'FOO="\\"foo\\"\\n\'\\$and\'\\n\\"bar\\""')
    })
    test('numbers should stay as numbers', async () => {
        await updateDotenv({
            "THIS_IS_A_NUMBER": 5,
        })
        assert.equal(fs.readFileSync('.env', {encoding: "utf-8"}), "THIS_IS_A_NUMBER=5")
    })
    test('Non-alphanumeric characters should cause a quote', async () => {
        await updateDotenv({
            "asterisk": "*",
            "question_mark": "?",
            "square_brackets": "[]",
            "curly_braces": "{}",
            "parentheses": "()",
            "ampersand": "&",
            "pipe": "|",
            "semicolon": ";",
            "hash": "#",
            "tilde": "~",
            "greater_less_than": "><",
            "equals_sign": "="
        })
        assert.equal(fs.readFileSync('.env', {encoding: "utf-8"}), "asterisk='*'\nquestion_mark='?'\nsquare_brackets='[]'\ncurly_braces='{}'\nparentheses='()'\nampersand='&'\npipe='|'\nsemicolon=';'\nhash='#'\ntilde='~'\ngreater_less_than='><'\nequals_sign='='")
    })
    test('Other non-alphanumeric characters should cause a quote', async () => {
        await updateDotenv({
            "AT": "@",
            "colon": ":",
            "backslash": "\\",
            "single_quotes": "'",
            "double_quotes": '"',
            "backtick_quotes": "`",
        })
        assert.equal(fs.readFileSync('.env', {encoding: "utf-8"}), `AT='@'\ncolon=':'\nbackslash='\\\'\nsingle_quotes='\\\''\ndouble_quotes='\"'\nbacktick_quotes='\`'`)
    })

})
