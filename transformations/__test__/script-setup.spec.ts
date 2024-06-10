import { defineInlineTest } from 'jscodeshift/src/testUtils'
import { runInlineTest } from '../../utils/testUtils'
import transform from '../example'

const input = `
<script setup>
const props = defineProps({
  name: String,
})
</script>

<template>
  <div>
    {{ name }}
  </div>
</template>
`

const output = `
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
