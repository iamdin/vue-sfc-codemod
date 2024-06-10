import type { Transform } from 'jscodeshift'
import { Adapter } from '../utils/jscodeshift-vue-adapter'

const transformer: Transform = (fileInfo, { j }) => {
  const root = j(fileInfo.source)

  const specifiers = root.find(j.ImportDeclaration, {
    source: { value: '@xhs/delight' },
  })

  // replace toast with toast2 in the import
  specifiers
    .find(j.ImportSpecifier, {
      imported: { name: 'toast' },
    })
    .replaceWith(
      j.importSpecifier(j.identifier('toast2'), j.identifier('toast'))
    )

  // replace Cascader with Cascader2 in the import
  specifiers
    .find(j.ImportSpecifier, {
      imported: { name: 'Cascader' },
    })
    .replaceWith(
      j.importSpecifier(j.identifier('Cascader2'), j.identifier('Cascader'))
    )

  return root.toSource()
}

export default Adapter(transformer)
