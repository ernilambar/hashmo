import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { tmpdir } from 'node:os'
import { generateHash } from '../src/app.js'

describe('generateHash', () => {
  let testDir

  beforeEach(() => {
    testDir = path.join(tmpdir(), `hashmo-app-${Date.now()}-${Math.random().toString(36).slice(2)}`)
    fs.mkdirSync(testDir, { recursive: true })
  })

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
  })

  it('writes plaintext hash file to destination', (t, done) => {
    generateHash({
      type: 'plaintext',
      destination: testDir,
      output: 'out.txt',
      raw: false
    }, (err) => {
      assert.ifError(err)
      const fullPath = path.join(testDir, 'out.txt')
      assert(fs.existsSync(fullPath))
      const content = fs.readFileSync(fullPath, 'utf8')
      assert.match(content, /^[0-9a-f]+$/, 'plaintext should be hex')
      done()
    })
  })

  it('writes php type hash file', (t, done) => {
    generateHash({
      type: 'php',
      destination: testDir,
      output: 'hash.php',
      raw: false
    }, (err) => {
      assert.ifError(err)
      const fullPath = path.join(testDir, 'hash.php')
      assert(fs.existsSync(fullPath))
      const content = fs.readFileSync(fullPath, 'utf8')
      assert.match(content, /^<\?php return "[0-9a-f]+";$/, 'php wrapper with hex hash')
      done()
    })
  })

  it('writes json type hash file', (t, done) => {
    generateHash({
      type: 'json',
      destination: testDir,
      output: 'hash.json',
      raw: false
    }, (err) => {
      assert.ifError(err)
      const fullPath = path.join(testDir, 'hash.json')
      assert(fs.existsSync(fullPath))
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
      assert.strictEqual(typeof content.hash, 'string')
      assert.match(content.hash, /^[0-9a-f]+$/)
      done()
    })
  })

  it('uses raw timestamp when raw is true', (t, done) => {
    generateHash({
      type: 'plaintext',
      destination: testDir,
      output: 'raw.txt',
      raw: true
    }, (err) => {
      assert.ifError(err)
      const fullPath = path.join(testDir, 'raw.txt')
      assert(fs.existsSync(fullPath))
      const content = fs.readFileSync(fullPath, 'utf8')
      assert.match(content, /^\d+$/, 'raw should be decimal string')
      assert(Number(content) > 0, 'should be positive number')
      done()
    })
  })

  it('creates destination directory if missing', (t, done) => {
    const nestedDir = path.join(testDir, 'sub', 'dir')
    generateHash({
      type: 'plaintext',
      destination: nestedDir,
      output: 'hash.txt',
      raw: false
    }, (err) => {
      assert.ifError(err)
      assert(fs.existsSync(nestedDir))
      assert(fs.existsSync(path.join(nestedDir, 'hash.txt')))
      done()
    })
  })

  it('overwrites existing output file', (t, done) => {
    const outPath = path.join(testDir, 'hash.txt')
    fs.writeFileSync(outPath, 'old')
    generateHash({
      type: 'plaintext',
      destination: testDir,
      output: 'hash.txt',
      raw: false
    }, (err) => {
      assert.ifError(err)
      const content = fs.readFileSync(outPath, 'utf8')
      assert.match(content, /^[0-9a-f]+$/, 'should be updated with new hash')
      assert.notStrictEqual(content, 'old')
      done()
    })
  })

  it('calls callback with error when destination is a file', (t, done) => {
    const fileAsDest = path.join(testDir, 'notadir')
    fs.writeFileSync(fileAsDest, 'x')
    generateHash({
      type: 'plaintext',
      destination: fileAsDest,
      output: 'hash.txt',
      raw: false
    }, (err) => {
      assert(err)
      assert(err.code === 'EEXIST' || /not a directory|already exists|EEXIST/i.test(err.message || ''))
      done()
    })
  })

  it('calls callback with no error on success', (t, done) => {
    generateHash({
      type: 'plaintext',
      destination: testDir,
      output: 'cb.txt',
      raw: false
    }, (err) => {
      assert.ifError(err)
      assert(fs.existsSync(path.join(testDir, 'cb.txt')))
      done()
    })
  })

  it('calls callback with error when output is empty', (t, done) => {
    generateHash({
      type: 'plaintext',
      destination: testDir,
      output: '',
      raw: false
    }, (err) => {
      assert(err)
      assert.match(err.message, /output.*empty|empty.*output/)
      done()
    })
  })

  it('calls callback with error when output is whitespace only', (t, done) => {
    generateHash({
      type: 'plaintext',
      destination: testDir,
      output: '   \t  ',
      raw: false
    }, (err) => {
      assert(err)
      assert.match(err.message, /output.*empty|empty.*output/)
      done()
    })
  })
})
