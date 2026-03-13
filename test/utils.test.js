import { describe, it, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { tmpdir } from 'node:os'
import { createFile, createDir, updateFile, getHashString, getFileContent, handleHashFile } from '../src/utils.js'

describe('getFileContent', () => {
  it('returns plaintext file content unchanged', () => {
    const hash = 'mynameisjohndoe'
    const fileContent = getFileContent(hash, 'plaintext')
    assert.strictEqual(fileContent, hash)
  })

  it('returns PHP file content with wrapper', () => {
    const fileContent = getFileContent('mynameisjohndoe', 'php')
    assert.strictEqual(fileContent, '<?php return "mynameisjohndoe";')
  })

  it('handles empty hash for plaintext', () => {
    assert.strictEqual(getFileContent('', 'plaintext'), '')
  })

  it('handles empty hash for php type', () => {
    assert.strictEqual(getFileContent('', 'php'), '<?php return "";')
  })

  it('handles hash with special characters for plaintext', () => {
    const hash = 'a1b2-c3d4_e5f6'
    assert.strictEqual(getFileContent(hash, 'plaintext'), hash)
  })

  it('handles hash with special characters for php type', () => {
    const hash = 'abc123'
    assert.strictEqual(getFileContent(hash, 'php'), '<?php return "abc123";')
  })

  it('escapes double quote and backslash in hash for php type', () => {
    assert.strictEqual(getFileContent('a"b', 'php'), '<?php return "a\\"b";')
    assert.strictEqual(getFileContent('a\\b', 'php'), '<?php return "a\\\\b";')
    assert.strictEqual(getFileContent('"\\', 'php'), '<?php return "\\"\\\\";')
  })

  it('returns JSON object with hash for json type', () => {
    assert.strictEqual(getFileContent('abc123', 'json'), '{"hash":"abc123"}')
    assert.strictEqual(getFileContent('', 'json'), '{"hash":""}')
  })

  it('handles unknown type as plaintext (no wrapper)', () => {
    const hash = 'somehash'
    assert.strictEqual(getFileContent(hash, 'unknown'), 'somehash')
  })

  it('handles undefined type as plaintext', () => {
    const hash = 'somehash'
    assert.strictEqual(getFileContent(hash, undefined), 'somehash')
  })
})

describe('getHashString', () => {
  it('returns hex string when not raw', () => {
    const result = getHashString(false)
    assert.strictEqual(typeof result, 'string')
    assert.match(result, /^[0-9a-f]+$/, 'should be hex string')
  })

  it('returns decimal string when raw', () => {
    const result = getHashString(true)
    assert.strictEqual(typeof result, 'string')
    assert.match(result, /^\d+$/, 'should be decimal string')
  })

  it('raw timestamp is numeric when parsed', () => {
    const result = getHashString(true)
    const num = Number(result)
    assert(!Number.isNaN(num), 'should be parseable as number')
    assert(num > 0, 'should be positive')
  })

  it('hex timestamp is valid base-16 when parsed', () => {
    const result = getHashString(false)
    const num = parseInt(result, 16)
    assert(!Number.isNaN(num), 'should be valid hex')
    assert(num > 0, 'should be positive')
  })
})

describe('createDir', () => {
  const testDir = path.join(tmpdir(), `hashmo-createDir-${Date.now()}`)

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
  })

  it('creates directory when it does not exist', () => {
    assert(!fs.existsSync(testDir))
    createDir(testDir)
    assert(fs.existsSync(testDir))
    assert(fs.statSync(testDir).isDirectory())
  })

  it('does not throw when directory already exists', () => {
    createDir(testDir)
    assert.doesNotThrow(() => createDir(testDir))
  })

  it('creates nested directories recursively', () => {
    const nested = path.join(testDir, 'a', 'b', 'c')
    createDir(nested)
    assert(fs.existsSync(nested))
    assert(fs.statSync(nested).isDirectory())
  })
})

describe('createFile and updateFile', () => {
  const testDir = path.join(tmpdir(), `hashmo-file-${Date.now()}`)
  const testFile = path.join(testDir, 'hash.txt')

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }
  })

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
  })

  it('createFile creates new file with content', (t, done) => {
    createFile(testFile, 'hello', (err) => {
      assert.ifError(err)
      assert(fs.existsSync(testFile))
      assert.strictEqual(fs.readFileSync(testFile, 'utf8'), 'hello')
      done()
    })
  })

  it('updateFile overwrites existing file', (t, done) => {
    fs.writeFileSync(testFile, 'old')
    updateFile(testFile, 'new', (err) => {
      assert.ifError(err)
      assert.strictEqual(fs.readFileSync(testFile, 'utf8'), 'new')
      done()
    })
  })
})

describe('handleHashFile', () => {
  const testDir = path.join(tmpdir(), `hashmo-handleHash-${Date.now()}`)
  const newFile = path.join(testDir, 'new.txt')
  const existingFile = path.join(testDir, 'existing.txt')

  beforeEach(() => {
    fs.mkdirSync(testDir, { recursive: true })
    fs.writeFileSync(existingFile, 'old content')
  })

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true })
    }
  })

  it('creates file when path does not exist', (t, done) => {
    handleHashFile(newFile, 'new content', (err) => {
      assert.ifError(err)
      assert(fs.existsSync(newFile))
      assert.strictEqual(fs.readFileSync(newFile, 'utf8'), 'new content')
      done()
    })
  })

  it('updates file when path exists', (t, done) => {
    handleHashFile(existingFile, 'updated content', (err) => {
      assert.ifError(err)
      assert.strictEqual(fs.readFileSync(existingFile, 'utf8'), 'updated content')
      done()
    })
  })
})
