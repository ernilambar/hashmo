#!/usr/bin/env node

import { Command, Option } from 'commander'
import { generateHash } from './src/app.js'

const program = new Command()

program
  .name('hashmo')
  .usage('[options]')
  .description('Generate hash from current timestamp.')
  .addOption(new Option('-t, --type <type>', 'Output type').choices(['plaintext', 'php']).default('plaintext'))
  .option('-d, --destination <dir>', 'Destination directory. Defaults to root directory.', '')
  .option('-o, --output <filename>', 'Output file name with extension', 'hash.txt')
  .action((options) => {
    generateHash(options)
  })
  .version('1.0.1', '-v, --version', 'Output the current version.')
  .helpOption('-h, --help', 'Display help for command.')

program.parse()
