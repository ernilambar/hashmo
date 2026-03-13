import { describe, it } from 'node:test'
import assert from 'node:assert'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as fs from 'node:fs'
import { tmpdir } from 'node:os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const cliPath = path.join(__dirname, '..', 'index.js')

function runCli (args = [], opts = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [cliPath, ...args], {
      cwd: opts.cwd || path.join(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'pipe']
    })
    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', (d) => { stdout += d })
    proc.stderr.on('data', (d) => { stderr += d })
    proc.on('close', (code, signal) => {
      resolve({ code, signal, stdout, stderr })
    })
    proc.on('error', reject)
  })
}

describe('CLI', () => {
  it('--help prints usage and exits 0', async () => {
    const result = await runCli(['--help'])
    assert.strictEqual(result.code, 0)
    assert.match(result.stdout, /Usage: hashmo/)
    assert.match(result.stdout, /--type/)
    assert.match(result.stdout, /--destination/)
    assert.match(result.stdout, /--output/)
    assert.match(result.stdout, /--raw/)
  })

  it('-h prints usage and exits 0', async () => {
    const result = await runCli(['-h'])
    assert.strictEqual(result.code, 0)
    assert.match(result.stdout, /Usage: hashmo/)
  })

  it('--version prints version and exits 0', async () => {
    const result = await runCli(['--version'])
    assert.strictEqual(result.code, 0)
    assert.match(result.stdout, /^\d+\.\d+\.\d+\n/)
  })

  it('-v prints version and exits 0', async () => {
    const result = await runCli(['-v'])
    assert.strictEqual(result.code, 0)
    assert.match(result.stdout, /^\d+\.\d+\.\d+\n/)
  })

  it('invalid --type exits 1 and prints error', async () => {
    const result = await runCli(['--type=invalid'])
    assert.strictEqual(result.code, 1)
    assert.match(result.stderr, /invalid/)
    assert.match(result.stderr, /plaintext, php, json/)
  })

  it('accepts --type=plaintext and exits 0', async () => {
    const result = await runCli(['--type=plaintext', '--destination=/tmp', '--output=hashmo-cli-test.txt'])
    assert.strictEqual(result.code, 0)
  })

  it('accepts --type=php and exits 0', async () => {
    const result = await runCli(['-t', 'php', '-d', '/tmp', '-o', 'hashmo-cli-php.txt'])
    assert.strictEqual(result.code, 0)
  })

  it('accepts --type=json and exits 0', async () => {
    const result = await runCli(['-t', 'json', '-d', '/tmp', '-o', 'hashmo-cli-json.json'])
    assert.strictEqual(result.code, 0)
  })

  it('prints written file path on success', async () => {
    const dir = path.join(tmpdir(), `hashmo-path-${Date.now()}`)
    fs.mkdirSync(dir, { recursive: true })
    const result = await runCli(['--destination=' + dir, '--output=out.txt'])
    assert.strictEqual(result.code, 0)
    const expectedPath = path.join(dir, 'out.txt')
    assert.strictEqual(result.stdout.trim(), expectedPath)
  })

  it('--quiet suppresses file path output', async () => {
    const result = await runCli(['--destination=/tmp', '--output=hashmo-quiet.txt', '--quiet'])
    assert.strictEqual(result.code, 0)
    assert.strictEqual(result.stdout, '')
  })

  it('exits 1 when destination is a file', async () => {
    const filePath = path.join(tmpdir(), `hashmo-dest-file-${Date.now()}`)
    fs.writeFileSync(filePath, 'x')
    try {
      const result = await runCli(['--destination=' + filePath, '--output=out.txt'])
      assert.strictEqual(result.code, 1)
      assert.match(result.stderr, /not a directory|already exists|EEXIST/)
    } finally {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
  })

  it('exits 1 when output is empty', async () => {
    const result = await runCli(['--output=', '--destination=/tmp'])
    assert.strictEqual(result.code, 1)
    assert.match(result.stderr, /output.*empty|empty.*output/)
  })
})
