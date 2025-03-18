import * as fs from 'fs/promises'
import ora from 'ora'
import * as os from 'os'
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
  let checkFilesSpinner: ora.Ora | undefined
  let processSpinner: ora.Ora | undefined
  let typesSpinner: ora.Ora | undefined

  try {
    let filesToProcess: string[] = []
    if (!inputPath) {
      checkFilesSpinner = ora('Checking for default .env files...').start()
      filesToProcess = await findDefaultEnvFiles()
      checkFilesSpinner.succeed(`Found ${filesToProcess.length} .env files.`)

      if (filesToProcess.length === 0) {
        throw new Error('No .env files found.')
      }
    } else {
      filesToProcess = [inputPath]
    }

    for (const filePath of filesToProcess) {
      processSpinner = ora(`Processing ${path.basename(filePath)}...`).start()
      try {
        await processEnvFile(
          filePath,
          outputPath,
          removeComments,
          includeComments,
          delimiter
        )
        processSpinner.succeed(`${path.basename(filePath)} processed.`)
      } catch (error) {
        processSpinner.fail(
          `Error processing file: ${(error as Error).message}`
        )
        throw new Error(`Error processing file: ${(error as Error).message}`)
      } finally {
        processSpinner.stop()
      }
    }

    if (generateTypes) {
      typesSpinner = ora('Generating env.d.ts...').start()
      const keys = await extractKeys(filesToProcess)
      const typesContent = generateTypesContent(keys)
      await fs.writeFile(
        path.join(path.dirname(outputPath), 'env.d.ts'),
        typesContent
      )
      typesSpinner.succeed('env.d.ts generated.')
    }
  } catch (error) {
    checkFilesSpinner?.fail(`Error checking files: ${(error as Error).message}`)
    typesSpinner?.fail(`Error generating types: ${(error as Error).message}`)
    throw new Error(`Error generating files: ${(error as Error).message}`)
  } finally {
    checkFilesSpinner?.stop()
    typesSpinner?.stop()
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
  removeComments: boolean,
  includeComments: boolean,
  delimiter: string
): Promise<void> {
  if (!(await checkFilePermissions(inputPath))) {
    throw new Error(`Permission denied: Cannot read file ${inputPath}`)
  }
  let mainSpinner: ora.Ora | undefined
  try {
    mainSpinner = ora('Generating files...').start()
    const envContent = await fs.readFile(inputPath, 'utf-8')
    const lines = envContent.split(os.EOL)
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
      exampleLines.join(os.EOL)
    )
    mainSpinner.succeed('Files generated successfully.')
  } catch (error) {
    mainSpinner?.fail(`Error generating files: ${(error as Error).message}`)
    throw new Error(`Error generating files: ${(error as Error).message}`)
  } finally {
    mainSpinner?.stop()
  }
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
  let content = `declare namespace NodeJS {${os.EOL}  interface ProcessEnv {${os.EOL}`
  keys.forEach(key => {
    content += `    ${key}: string;${os.EOL}`
  })
  content += `  }${os.EOL}}${os.EOL}`
  return content
}
