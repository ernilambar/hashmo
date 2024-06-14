import * as fs from 'fs'
import path from 'path'

const createFile = (filename, content) => {
  fs.open(filename, 'r', function (err, fd) {
    if (err) {
      fs.writeFile(filename, content, function (err) {
        if (err) {
          console.log(err)
        }
      })
    }
  })
}

const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.resolve(dir), { recursive: true })
  }
}

const updateFile = (filename, content) => {
  fs.writeFile(filename, content, function (err) {
    if (err) {
      console.log(err)
    }
  })
}

const getHashString = (isRaw) => {
  if (isRaw) {
    return Date.now().toString()
  }

  return Number(Date.now()).toString(16)
}

const getFileContent = (hash, type) => {
  let output = hash

  if (type === 'php') {
    output = `<?php return "${hash}";`
  }

  return output
}

const handleHashFile = (filePath, content) => {
  if (!fs.existsSync(filePath)) {
    createFile(filePath, content)
  } else {
    updateFile(filePath, content)
  }
}

export { createFile, createDir, updateFile, getHashString, getFileContent, handleHashFile }
