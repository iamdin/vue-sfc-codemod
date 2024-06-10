import type { Parser } from 'jscodeshift'
import jscodeshift from 'jscodeshift'

export function applyTransform(
  module,
  options,
  input,
  testOptions: { parser?: string | Parser } = {}
) {
  // Handle ES6 modules using default export for the transform
  const transform = module.default ? module.default : module

  let j = jscodeshift
  if (testOptions.parser || module.parser) {
    j = jscodeshift.withParser(testOptions.parser || module.parser)
  }

  const output = transform(
    input,
    {
      jscodeshift: j,
      j,
      stats: () => {},
    },
    options || {}
  )

  return (output || '').trim()
}

export function runInlineTest(
  module,
  options,
  input,
  expectedOutput,
  testOptions?
) {
  const output = applyTransform(module, options, input, testOptions)
  expect(output).toEqual(expectedOutput.trim())
  return output
}
