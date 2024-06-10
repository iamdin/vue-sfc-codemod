import { defineInlineTest } from 'jscodeshift/src/testUtils'
import { runInlineTest } from '../../utils/testUtils'
import transform from '../script-setup-ts'

const input = `
<script setup lang="ts">
const props = defineProps<{
  name?: string
  show: boolean
}>()
</script>

<template>
  <div>
    {{ name }}
  </div>
</template>
`

const output = `
<script setup lang="ts">
const props = defineProps<{
  name?: string
  show?: boolean
}>()
</script>

<template>
  <div>
    {{ name }}
  </div>
</template>
`

it.skip('script setup codeshift', () => {
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
