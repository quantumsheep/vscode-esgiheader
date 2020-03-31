import * as path from 'path'
import { runTests } from 'vscode-test'

const extensionDevelopmentPath = path.resolve(__dirname, '../')
const extensionTestsPath = path.resolve(__dirname, './')

runTests({
  extensionDevelopmentPath,
  extensionTestsPath,
})
