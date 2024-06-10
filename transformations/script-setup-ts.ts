import type { Transform } from 'jscodeshift'
import { Adapter } from '../utils/jscodeshift-vue-adapter'

const transformer: Transform = (fileInfo, { j }) => {
  const root = j(fileInfo.source)

  root
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: 'defineProps',
      },
    })
    .forEach((calleePath) => {
      const typeParameters = calleePath.get('typeParameters')?.value
      if (j.TSTypeParameterInstantiation.check(typeParameters)) {
        const propsTypeDecl = typeParameters.params[0]
        if (propsTypeDecl.type === 'TSTypeLiteral') {
          propsTypeDecl.members.forEach((member) => {
            if (member.type === 'TSPropertySignature') {
              if (member.typeAnnotation?.type === 'TSTypeAnnotation') {
                member.optional = true
              }
            }
          })
        }
        console.log(typeParameters)
      }
    })

  return root.toSource()
}

export default Adapter(transformer)
