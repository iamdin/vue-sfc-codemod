import { runInlineTest } from 'jscodeshift/src/testUtils'
import transform from '../example'

const input = `
<template>
  <div class="widget">
    Hello {{name}}
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: false
    },
    age: {
      type: String
    }
  },
  computed: {
    hasName() {
      return !!this.name;
    }
  }
};
</script>

<style>
.widget {
  color: red;
}
</style>
`

const output = `
<template>
  <div class="widget">
    Hello {{name}}
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    age: {
      type: String,
      required: true
    }
  },
  computed: {
    hasName() {
      return !!this.name;
    }
  }
};
</script>

<style>
.widget {
  color: red;
}
</style>
`

it.skip('example codeshift', () => {
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
// defineInlineTest(transform, {}, input, output, 'example codeshift')
