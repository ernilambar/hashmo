/* global test, expect */

const utils = require('../src/utils')

test('Get plaintext file content', () => {
  const hash = 'mynameisjohndoe'

  const fileContent = utils.getFileContent(hash, 'plaintext')

  expect(fileContent).toStrictEqual(hash)
})

test('Get PHP file content', () => {
  const fileContent = utils.getFileContent('mynameisjohndoe', 'php')

  const expectedContent = '<?php return "mynameisjohndoe";'

  expect(fileContent).toStrictEqual(expectedContent)
})

test('Get hash string', () => {
  const result = utils.getHashString()

  expect(result).toHaveLength(8)
  expect(result).toMatch(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+/)
})
