<script setup lang="ts">
interface BlockState {
  x: number
  y: number
  revealed: boolean
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
}
const WIDTH = 10
const HEIGHT = 10
const state = reactive(Array.from({ length: HEIGHT }, (_, y) =>
  Array.from({ length: WIDTH },
    (_, x): BlockState => ({
      x,
      y,
      adjacentMines: 0,
      revealed: false,
    }),
  ),
),
)

// 布置炸弹
function generateMines(initial: BlockState) {
  for (const row of state) {
    for (const block of row) {
      if (Math.abs(initial.x - block.x) < 1)
        continue
      if (Math.abs(initial.y - block.y) < 1)
        continue

      block.mine = Math.random() < 0.3
    }
  }
  updateNumbers()
}

const directions = [
  [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1],
]

const numberColors = ['text-transparent', 'text-green-500', 'text-yellow-500', 'text-orange-500', 'text-pink-500', 'text-purple-500', 'text-red-500']

function updateNumbers() {
  state.forEach((raw) => {
    raw.forEach((block) => {
      if (block.mine)
        return
      getSiblings(block).forEach((b) => {
        if (b.mine)
          block.adjacentMines += 1
      })
    })
  })
}

function expendZero(block: BlockState) {
  if (block.adjacentMines)
    return

  getSiblings(block).forEach((s) => {
    if (!s.revealed) {
      s.revealed = true
      expendZero(s)
    }
  })
}

let mineGenerated = false
const dev = true

function onClick(block: BlockState) {
  if (!mineGenerated) {
    generateMines(block)
    mineGenerated = true
  }
  block.revealed = true
  if (block.mine)
    alert('BOOOOM!')
  expendZero(block)
}

function getBlockClass(block: BlockState) {
  if (!block.revealed)
    return 'bg-gray-500/50'
  return block.mine ? 'bg-red-500/50' : numberColors[block.adjacentMines]
}

function getSiblings(block: BlockState) {
  return directions.map(([dx, dy]) => {
    const x2 = block.x + dx
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT)
      return undefined

    return state[y2][x2]
  }).filter(Boolean) as BlockState[]
}
</script>

<template>
  <div>
    Minesweeper
    <div p5>
      <div v-for="row, y in state" :key="y" flex="~" items-center justify-center>
        <button
          v-for="item, x in row" :key="x" w-10 h-10 border="1 gray-400/20" flex="~" m="0.5" items-center justify-center
          hover="bg-gray/10" :class="getBlockClass(item)" @click="onClick(item)"
        >
          <template v-if="item.revealed || dev">
            <div v-if="item.mine" i-mdi-mine />
            <div v-else>
              {{ item.adjacentMines }}
            </div>
          </template>
        </button>
      </div>
    </div>
  </div>
</template>
