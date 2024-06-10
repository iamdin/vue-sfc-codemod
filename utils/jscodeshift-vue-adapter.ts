import { parse, SFCScriptBlock } from '@vue/compiler-sfc'
import type { Parser, Transform } from 'jscodeshift'
import getParser from 'jscodeshift/src/getParser'
import { stringify } from './vue-sfc-descriptor-to-string'

/**
 * The following function is adapted from https://github.com/psalaets/vue-jscodeshift-adapter/blob/master/src/jscodeshift-mode.js
 */

/**
The MIT License (MIT)

Copyright (c) 2020 Paul Salaets

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

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
