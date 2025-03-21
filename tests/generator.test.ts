import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { generateEnvFiles } from '../src/generator'

describe('generateEnvFiles', () => {
  const testDir = path.join(__dirname, 'tmp')
  const inputPath = path.join(testDir, '.env')
  const outputPath = path.join(testDir, '.env.example')
  const typesPath = path.join(testDir, 'env.d.ts')

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true })
    await fs.writeFile(
      inputPath,
      `API_KEY=123${os.EOL}DATABASE_URL=postgres://user:password@host:port/db`
    )
  })

  afterEach(async () => {
    try {
      await fs.unlink(outputPath)
      await fs.unlink(typesPath)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Ignore errors if files don't exist
    }
  })

  afterAll(async () => {
    await fs.rm(testDir, { recursive: true })
  })

  it('should generate .env.example file', async () => {
    await generateEnvFiles(inputPath, outputPath, false, false, false, '=')
    const exampleContent = await fs.readFile(outputPath, 'utf-8')
    expect(exampleContent).toBe(`API_KEY=${os.EOL}DATABASE_URL=`)
  })

  it('should generate env.d.ts file', async () => {
    await generateEnvFiles(inputPath, outputPath, true, false, false, '=')
    const typesContent = await fs.readFile(typesPath, 'utf-8')
    expect(typesContent).toContain('API_KEY: string;')
    expect(typesContent).toContain('DATABASE_URL: string;')
  })

  it('should remove comments', async () => {
    await fs.writeFile(
      inputPath,
      `API_KEY=123${os.EOL}# COMMENT${os.EOL}DATABASE_URL=postgres://user:password@host:port/db`
    )
    await generateEnvFiles(inputPath, outputPath, false, true, false, '=')
    const exampleContent = await fs.readFile(outputPath, 'utf-8')
    expect(exampleContent).toBe(`API_KEY=${os.EOL}DATABASE_URL=`)
  })

  it('should include comments', async () => {
    await fs.writeFile(
      inputPath,
      `API_KEY=123${os.EOL}# COMMENT${os.EOL}DATABASE_URL=postgres://user:password@host:port/db`
    )
    await generateEnvFiles(inputPath, outputPath, false, false, true, '=')
    const exampleContent = await fs.readFile(outputPath, 'utf-8')
    expect(exampleContent).toBe(
      `API_KEY=${os.EOL}# COMMENT${os.EOL}DATABASE_URL=`
    )
  })

  it('should use custom delimiter', async () => {
    await fs.writeFile(
      inputPath,
      `API_KEY:123${os.EOL}DATABASE_URL:postgres://user:password@host:port/db`
    )
    await generateEnvFiles(inputPath, outputPath, false, false, false, ':')
    const exampleContent = await fs.readFile(outputPath, 'utf-8')
    expect(exampleContent).toBe(`API_KEY=${os.EOL}DATABASE_URL=`)
  })

  it('should handle file permission errors', async () => {
    await fs.chmod(inputPath, 0o000) // Remove read permission
    await expect(
      generateEnvFiles(inputPath, outputPath, false, false, false, '=')
    ).rejects.toThrow(/denied/)
    await fs.chmod(inputPath, 0o644) // Restore read permission
  })
})
