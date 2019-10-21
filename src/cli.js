import arg from 'arg'
import inquirer from 'inquirer'
import { assertNewExpression } from 'babel-types'

function parseArgumentsIntoOptions (rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install'
    },
    {
      argv: rawArgs.slice(2)
    }
  )
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false
  }
}

async function prompForMissingOptions (options) {
  const defaultTemplate = 'JavaScript'
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate
    }
  }
  const questions = []
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template too use',
      choices: ['JavaScript', 'TypeScript'],
      default: defaultTemplate
    })
  }
  if (!options.template) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false
    })
  }

  const answer = await inquirer.prompt(questions)
  return {
    ...options,
    template: options.template || answer.template,
    git: options.git || answer.git
  }
}

export async function cli (args) {
  let options = parseArgumentsIntoOptions(args)
  options = await prompForMissingOptions(options)
  console.log(options)

}