import * as fs from 'fs/promises'
import ora from 'ora'
import * as path from 'path'

const DEFAULT_ENV_FILES = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production'
]

export async function generateEnvFiles(
  inputPath: string,
  outputPath: string,
  generateTypes: boolean,
  removeComments: boolean,
  includeComments: boolean,
  delimiter: string
): Promise<void> {
  const mainSpinner = ora('Generating files...').start()

  try {
    let filesToProcess: string[] = []
    if (!inputPath) {
      const checkFilesSpinner = ora(
        'Checking for default .env files...'
      ).start()
      filesToProcess = await findDefaultEnvFiles()
      checkFilesSpinner.succeed(`Found ${filesToProcess.length} .env files.`)

      if (filesToProcess.length === 0) {
        mainSpinner.fail('Error: No .env files found.')
        process.exit(1)
      }
    } else {
      filesToProcess = [inputPath]
    }

    for (const filePath of filesToProcess) {
      const processSpinner = ora(
        `Processing ${path.basename(filePath)}...`
      ).start()
      await processEnvFile(
        filePath,
        outputPath,
        generateTypes,
        removeComments,
        includeComments,
        delimiter
      )
      processSpinner.succeed(`${path.basename(filePath)} processed.`)
    }

    if (generateTypes) {
      const typesSpinner = ora('Generating env.d.ts...').start()
      const keys = await extractKeys(filesToProcess)
      const typesContent = generateTypesContent(keys)
      await fs.writeFile(
        path.join(path.dirname(outputPath), 'env.d.ts'),
        typesContent
      )
      typesSpinner.succeed('env.d.ts generated.')
    }

    mainSpinner.succeed('Files generated successfully.')
  } catch (error) {
    mainSpinner.fail(`Error generating files: ${(error as Error).message}`)
    process.exit(1)
  }
}

async function findDefaultEnvFiles(): Promise<string[]> {
  const foundFiles: string[] = []
  for (const file of DEFAULT_ENV_FILES) {
    try {
      await fs.access(file)
      foundFiles.push(file)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Arquivo não encontrado, continue para o próximo
    }
  }
  return foundFiles
}

async function processEnvFile(
  inputPath: string,
  outputPath: string,
  generateTypes: boolean,
  removeComments: boolean,
  includeComments: boolean,
  delimiter: string
): Promise<void> {
  if (!(await checkFilePermissions(inputPath))) {
    throw new Error(`Permission denied: Cannot read file ${inputPath}`)
  }

  const envContent = await fs.readFile(inputPath, 'utf-8')
  const lines = envContent.split('\n')
  const keys: string[] = []
  const exampleLines: string[] = []

  for (const line of lines) {
    if (removeComments && (line.startsWith('#') || line.startsWith(';'))) {
      continue
    }

    if (includeComments && (line.startsWith('#') || line.startsWith(';'))) {
      exampleLines.push(line)
      continue
    }

    const [key] = line.split(delimiter)
    if (key) {
      keys.push(key.trim())
      exampleLines.push(`${key.trim()}=`)
    }
  }

  const outputFileName = path.basename(inputPath) + '.example'
  await fs.writeFile(
    path.join(path.dirname(outputPath), outputFileName),
    exampleLines.join('\n')
  )
}

async function extractKeys(filePaths: string[]): Promise<string[]> {
  const allKeys: string[] = []
  for (const filePath of filePaths) {
    if (!(await checkFilePermissions(filePath))) {
      throw new Error(`Permission denied: Cannot read file ${filePath}`)
    }
    const envContent = await fs.readFile(filePath, 'utf-8')
    const lines = envContent.split('\n')
    for (const line of lines) {
      const [key] = line.split('=')
      if (key) {
        allKeys.push(key.trim())
      }
    }
  }
  return allKeys
}

async function checkFilePermissions(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, fs.constants.R_OK) // Verifica se o arquivo pode ser lido
    return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false
  }
}

function generateTypesContent(keys: string[]): string {
  let content = 'declare namespace NodeJS {\n  interface ProcessEnv {\n'
  keys.forEach(key => {
    content += `    ${key}: string;\n`
  })
  content += '  }\n}\n'
  return content
}
