<script setup lang="ts">
import type { BlockState } from '~/types'
import { isDev } from '~/composables/index'
defineProps<{ block: BlockState }>()
const numberColors = ['text-transparent', 'text-green-500', 'text-yellow-500', 'text-orange-500', 'text-pink-500', 'text-purple-500', 'text-red-500']

function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/50'
  return block.mine ? 'bg-red-500/50' : numberColors[block.adjacentMines]
}
</script>

<template>
  <button
    w-10 h-10 border="1 gray-400/20" flex="~" m="0.5" items-center justify-center hover="bg-gray/10"
    :class="getBlockClass(block)"
  >
    <template v-if="block.flagged">
      <div i-mdi-flag text-red />
    </template>
    <template v-if="block.revealed || isDev">
      <div v-if="block.mine" i-mdi-mine />
      <div v-else font-bold>
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>
