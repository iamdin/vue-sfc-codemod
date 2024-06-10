import { Parser, Transform } from 'jscodeshift'
import { parse, SFCScriptBlock } from '@vue/compiler-sfc'
import getParser from 'jscodeshift/src/getParser'
import { stringify } from './vue-sfc-descriptor-to-string'

export function Adapter(transform: Transform): Transform {
  return function transformAdapted(fileInfo, api, options) {
    if (!fileInfo.path.endsWith('.vue')) {
      return transform(fileInfo, api, options)
    }

    const { descriptor } = parse(fileInfo.source, {
      filename: fileInfo.path,
    })
    if (!descriptor.script && !descriptor.scriptSetup) {
      return
    }

    let hasChanged = false

    const transformScriptBlock = (scriptBlock: SFCScriptBlock) => {
      if (!scriptBlock || !scriptBlock.content) {
        return
      }

      let parser: Parser = getParser('babylon')
      if (scriptBlock.lang === 'ts' || scriptBlock.lang === 'tsx') {
        parser = getParser(scriptBlock.lang)
      }
      const j = api.j.withParser(parser)
      const transformed = transform(
        {
          ...fileInfo,
          source: scriptBlock.content,
        },
        {
          ...api,
          j,
          jscodeshift: j,
        },
        options
      )

      if (transformed && transformed !== scriptBlock.content) {
        hasChanged = true
        scriptBlock.content = transformed
      }

      return transformed
    }

    transformScriptBlock(descriptor.script)
    transformScriptBlock(descriptor.scriptSetup)

    if (hasChanged) {
      return stringify(descriptor)
    }
  }
}
