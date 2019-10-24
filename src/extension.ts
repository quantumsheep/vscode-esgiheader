//           __  _
//       .-.'  ` `-._  __  _
//      (_,         .-:'  ` `-._
//    ,'o"(    Q   (_,           )
//   (__,-'      ,'o"(     S      )>
//      (       (__,-'            )
//       `-'._.--._(             )
//          |||  |||`-'._.--._.-'
//                     |||  |||

import * as vscode from 'vscode'
import * as moment from 'moment'
import { basename } from 'path'

export type HeaderData = {
  filename: string
  author: string
  createdBy: string
  createdAt: moment.Moment
  updatedBy: string
  updatedAt: moment.Moment
}

declare global {
  interface String {
    repeat(count: number): string
  }
}

String.prototype.repeat = function (count: number) {
  if (count < 1) return ''

  let pattern = this
  let result = ''

  while (count > 1) {
    if (count & 1) result += pattern
    count >>= 1, pattern += pattern
  }
  return result + pattern
}

export const template = `
***************************************************************************************************************
*                                                                                                             *
*                                                               :::::::::: ::::::::   :::::::: :::::::::::    *
*    $FILENAME___________________________________              :+:       :+:    :+: :+:    :+:    :+:         *
*                                                             +:+       +:+        +:+           +:+          *
*    By: $AUTHOR_________________________________            +#++:++#  +#++:++#++ :#:           +#+           *
*                                                           +#+              +#+ +#+   +#+#    +#+            *
*    Created: $CREATEDAT_________ by $CREATEDBY__          #+#       #+#    #+# #+#    #+#    #+#             *
*    Updated: $UPDATEDAT_________ by $UPDATEDBY__         ########## ########   ######## ###########          *
*                                                                                                             *
***************************************************************************************************************

`.substring(1)

const hashes = ['# ', ' #']
const slashes = ['/* ', ' */']
const semicolons = [' ', ' ']
const parens = ['(* ', ' *)']
const dashes = ['-- ', ' --']
const percents = ['%% ', ' %%']

export const commentTypes: { [lang: string]: string[] } = {
  'c': slashes,
  'coffeescript': hashes,
  'cpp': slashes,
  'css': slashes,
  'dockerfile': hashes,
  'fsharp': parens,
  'go': slashes,
  'groovy': slashes,
  'haskell': dashes,
  'ini': semicolons,
  'jade': slashes,
  'java': slashes,
  'javascript': slashes,
  'javascriptreact': slashes,
  'latex': percents,
  'less': slashes,
  'lua': semicolons,
  'makefile': hashes,
  'objective-c': slashes,
  'ocaml': parens,
  'perl': hashes,
  'perl6': hashes,
  'php': slashes,
  'plaintext': hashes,
  'powershell': hashes,
  'python': hashes,
  'r': hashes,
  'ruby': hashes,
  'rust': slashes,
  'scss': slashes,
  'shellscript': hashes,
  'sql': hashes,
  'swift': slashes,
  'typescript': slashes,
  'typescriptreact': slashes,
  'xsl': slashes,
  'yaml': hashes
}

enum EOL {
  LF,
  CR,
  CRLF,
}

export function getLineBreakType(str: string): EOL {
  const indexOfLF = str.indexOf('\n', 1)  // No need to check first-character

  if (indexOfLF === -1) {
    return (str.indexOf('\r') !== -1) ? EOL.CR : EOL.LF
  }

  if (str[indexOfLF - 1] === '\r') return EOL.CRLF

  return EOL.LF
}

export const isSupported = (language: string) => language in commentTypes

export function getHeader(fileContent: string): string {
  const match = fileContent.match(/^(.{111}((\r\n)|(\n))){10}/g)

  return match ? match[0] : null
}

export function getFieldValue(header: string, fieldname: string): string {
  const match = template.match(new RegExp(`^((?:.*\\\n)*.*)(\\\$${fieldname}_*)`))

  const offset = getLineBreakType(template) == EOL.CRLF ? match[1].split('\n').length - 1 : 0

  return match ? header.substr(match[1].length + offset, match[2].length) : ''
}

export const getHeaderData = (header: string): HeaderData => ({
  filename: getFieldValue(header, 'FILENAME'),
  author: getFieldValue(header, 'AUTHOR'),
  createdBy: getFieldValue(header, 'CREATEDBY'),
  createdAt: moment(getFieldValue(header, 'CREATEDAT'), 'YYYY/MM/DD HH:mm:ss'),
  updatedBy: getFieldValue(header, 'UPDATEDBY'),
  updatedAt: moment(getFieldValue(header, 'UPDATEDAT'), 'YYYY/MM/DD HH:mm:ss')
})

export function generateHeaderData(document: vscode.TextDocument, headerData?: HeaderData): HeaderData {
  const config = vscode.workspace.getConfiguration()

  const user: string = config.get('esgiheader.username') || process.env['USER'] || 'esgi student'
  const email: string = config.get('esgiheader.email') || `${user}@myges.fr`

  return {
    filename: basename(document.fileName),
    author: `${user} <${email}>`,
    updatedBy: headerData ? headerData.createdBy : user,
    updatedAt: moment(),
    createdAt: headerData ? headerData.createdAt : moment(),
    createdBy: user,
  }
}

export function setFieldValue(header: string, name: string, value: string): string {
  const match = template.match(new RegExp(`^((?:.*\\n)*.*)(\\\$${name}_*)`, ''))

  return match ? header.substr(0, match[1].length)
    .concat(value.concat(' '.repeat(match[2].length)).substr(0, match[2].length))
    .concat(header.substr(match[1].length + match[2].length)) : ""
}

export const getTemplate = (languageId: string) => template.replace(new RegExp(`^(.{${commentTypes[languageId][0].length}})(.*)(.{${commentTypes[languageId][0].length}})$`, 'gm'), commentTypes[languageId][0] + '$2' + commentTypes[languageId][1])

export const renderHeader = (language: string, headerdata: HeaderData) => [
  { name: 'FILENAME', value: headerdata.filename },
  { name: 'AUTHOR', value: headerdata.author },
  { name: 'CREATEDAT', value: headerdata.createdAt.format('YYYY/MM/DD HH:mm:ss') },
  { name: 'CREATEDBY', value: headerdata.createdBy },
  { name: 'UPDATEDAT', value: headerdata.updatedAt.format('YYYY/MM/DD HH:mm:ss') },
  { name: 'UPDATEDBY', value: headerdata.updatedBy }
].reduce((header, field) => setFieldValue(header, field.name, field.value), getTemplate(language))

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('esgiheader.insert', () => {
    if (vscode.window.activeTextEditor) {
      if (isSupported(vscode.window.activeTextEditor.document.languageId)) {
        vscode.window.activeTextEditor.edit(editor => {
          if (vscode.window.activeTextEditor) {
            const current = getHeader(vscode.window.activeTextEditor.document.getText())
            console.log(vscode.window.activeTextEditor.document.eol)

            if (current) {
              editor.replace(
                new vscode.Range(0, 0, 12, 0),
                renderHeader(vscode.window.activeTextEditor.document.languageId, generateHeaderData(vscode.window.activeTextEditor.document, getHeaderData(current)))
              )
            } else {
              editor.insert(
                new vscode.Position(0, 0),
                renderHeader(vscode.window.activeTextEditor.document.languageId, generateHeaderData(vscode.window.activeTextEditor.document))
              )
            }
          }
        })
      } else {
        vscode.window.showInformationMessage(`No header support for language ${vscode.window.activeTextEditor.document.languageId}`)
      }
    }
  })

  context.subscriptions.push(disposable)
}