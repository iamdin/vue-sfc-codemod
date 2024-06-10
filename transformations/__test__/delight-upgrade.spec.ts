import { runInlineTest } from '../../utils/testUtils'
import transform from '../delight-upgrade'

it('hello world', () => {
  const input = `
<script setup lang="ts">
import { toast, Cascader } from '@xhs/delight'
</script>
`

  const output = `
<script setup lang="ts">
import { toast2 as toast, Cascader2 as Cascader } from '@xhs/delight'
</script>
`
  runInlineTest(
    transform,
    {},
    {
      path: 'example.vue',
      source: input,
    },
    output
  )
})
