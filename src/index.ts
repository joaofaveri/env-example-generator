#!/usr/bin/env node
import { program } from 'commander'
import inquirer from 'inquirer'
import packageJson from '../package.json'
import { generateEnvFiles } from './generator.js'

program
  .version(packageJson.version)
  .description('Generates .env.example and env.d.ts files')
  .option('-i, --input <file>', 'Input .env file')
  .option('-o, --output <file>', 'Output .env.example file', '.env.example')
  .option('-t, --typescript', 'Generate env.d.ts file')
  .option('-r, --remove-comments', 'remove comments from .env.example')
  .option('-I, --interactive', 'Interactive mode')
  .option('-c, --include-comments', 'include comments on .env.example')
  .option('-d, --delimiter <delimiter>', 'delimiter used on .env file', '=')
  .parse(process.argv)

const options = program.opts()

async function run(): Promise<void> {
  try {
    if (options.interactive) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'input',
          message: 'Input .env file:'
        },
        {
          type: 'input',
          name: 'output',
          message: 'Output .env.example file:',
          default: '.env.example'
        },
        {
          type: 'confirm',
          name: 'typescript',
          message: 'Generate env.d.ts file?',
          default: false
        },
        {
          type: 'confirm',
          name: 'removeComments',
          message: 'Remove comments?',
          default: false
        },
        {
          type: 'confirm',
          name: 'includeComments',
          message: 'Include comments?',
          default: false
        },
        {
          type: 'input',
          name: 'delimiter',
          message: 'Delimiter to be used',
          default: '='
        }
      ])
      await generateEnvFiles(
        answers.input,
        answers.output,
        answers.typescript,
        answers.removeComments,
        answers.includeComments,
        answers.delimiter
      )
    } else {
      await generateEnvFiles(
        options.input,
        options.output,
        options.typescript,
        options.removeComments,
        options.includeComments,
        options.delimiter
      )
    }
  } catch (error) {
    console.error(`An unexpected error occurred: ${(error as Error).message}`)
    process.exit(1)
  }
}

run()
