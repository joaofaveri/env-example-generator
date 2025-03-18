import { execSync } from 'child_process'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'

describe('CLI', () => {
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

  it('should generate .env.example and env.d.ts files', async () => {
    execSync(`node dist/index.js -i ${inputPath} -o ${outputPath} -t`)
    await expect(fs.access(outputPath)).resolves.toBeUndefined()
    await expect(fs.access(typesPath)).resolves.toBeUndefined()
  })
})
