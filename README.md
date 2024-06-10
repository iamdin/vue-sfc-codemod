# Vue SFC Codemod

This repository based on [jscodeshift](https://github.com/facebook/jscodeshift) to transform for Vue SFC files

Inspired by vue-codemod, react-codemod.

## Feature

- Written with Typescript & ESM Only.
- Support Vue SFC file: `<script></script>` and `<script setup></script>`.
- Support `TS` and `TSX` in Vue SFC script, like: `<script lang="ts"></script>`, `<script lang="tsx"></script>`

## Usage

### Command Line

`npx vue-sfc-codemod <transform> <path> [...options]`

- transform (required). name of transformation
- path (required). files or directory to transform.

### API

- jscodeshiftVueAdapter(transform: Transform): Transform
- vueSfcDescriptorToString(sfcDescriptor: SFCDescriptor): string

#### Test Utils

A simple utility to allow easy unit testing with [Vitest](https://vitest.dev/), corresponds to what [jscodeshift provides](https://github.com/facebook/jscodeshift?tab=readme-ov-file#unit-testing)
