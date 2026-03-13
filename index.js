#!/usr/bin/env node

import path from 'node:path'
import { createRequire } from 'node:module'
import minimist from 'minimist'
import { generateHash } from './src/app.js'

const require = createRequire(import.meta.url)
const { version: VERSION } = require('./package.json')

const help = `
Usage: hashmo [options]

Generate hash from current timestamp.

Options:
  -t, --type <type>        Output type (plaintext|php|json) (default: "plaintext")
  -d, --destination <dir>  Destination directory. Defaults to root directory.
  -o, --output <filename>  Output file name with extension (default: "hash.txt")
  --raw                    Keep raw timestamp without encoding.
  -q, --quiet              Do not print written file path on success.
  -v, --version            Output the current version.
  -h, --help               Display help for command.
`

const argv = minimist(process.argv.slice(2), {
  string: ['type', 'destination', 'output'],
  boolean: ['raw', 'quiet', 'version', 'help'],
  alias: {
    t: 'type',
    d: 'destination',
    o: 'output',
    q: 'quiet',
    v: 'version',
    h: 'help'
  },
  default: {
    type: 'plaintext',
    destination: '',
    output: 'hash.txt',
    raw: false
  }
})

if (argv.help) {
  process.stdout.write(help.trimStart())
  process.exit(0)
}

if (argv.version) {
  process.stdout.write(String(VERSION) + '\n')
  process.exit(0)
}

const type = argv.type
if (type !== 'plaintext' && type !== 'php' && type !== 'json') {
  console.error(`error: option '-t, --type <type>' argument '${type}' is invalid. Allowed choices are plaintext, php, json.`)
  process.exit(1)
}

const output = typeof argv.output === 'string' ? argv.output.trim() : ''
if (!output) {
  console.error('error: output filename cannot be empty.')
  process.exit(1)
}

const destination = argv.destination
generateHash({
  type,
  destination,
  output,
  raw: argv.raw
}, (err) => {
  if (err) {
    console.error(err.message || err)
    process.exit(1)
  }
  if (!argv.quiet) {
    process.stdout.write(path.join(path.resolve(destination), output) + '\n')
  }
})
