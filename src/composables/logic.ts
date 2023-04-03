import type { BlockState } from '~/types'
const directions = [
  [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1],
]
export class GamePlay {
  state = ref<BlockState[][]>([])
  isOver = false
  constructor(public width: number, public height: number) {
    watchEffect(() =>
      this.checkGameState(),
    )
    this.reset()
  }

  // 布置炸弹
  generateMines(state: BlockState[][], initial: BlockState) {
    for (const row of state) {
      for (const block of row) {
        if (Math.abs(initial.x - block.x) < 1)
          continue
        if (Math.abs(initial.y - block.y) < 1)
          continue

        block.mine = Math.random() < 0.3
      }
    }
    this.updateNumbers(state)
  }

  // 获取当前进度
  getState() {
    const totalBlocks = this.width * this.height
    const revealedBlocks = this.state.value.flat().filter(block => block.revealed).length
    const progress = Math.floor((revealedBlocks / totalBlocks) * 100)
    alert(`Progress: ${progress}%`)
  }

  // 有几个炸弹
  countMines() {
    const blocks = this.state.value.flat()
    const mines = blocks.filter(block => block.mine).length
    alert(`There are ${mines} mines.`)
  }

  updateNumbers(state: BlockState[][]) {
    state.forEach((raw) => {
      raw.forEach((block) => {
        if (block.mine)
          return
        this.getSiblings(block).forEach((b) => {
          if (b.mine)
            block.adjacentMines += 1
        })
      })
    })
  }

  expendZero(block: BlockState) {
    if (block.adjacentMines)
      return

    this.getSiblings(block).forEach((s) => {
      if (!s.revealed) {
        s.revealed = true
        this.expendZero(s)
      }
    })
  }

  mineGenerated = false

  onClick(block: BlockState) {
    if (!this.mineGenerated) {
      this.generateMines(this.state.value, block)
      this.mineGenerated = true
    }
    block.revealed = true
    if (block.mine) {
      alert('BOOOOM!')
      this.showAll()
    }
    this.expendZero(block)
  }

  onRightClick(block: BlockState) {
    if (block.revealed)
      return
    block.flagged = !block.flagged
  }

  getSiblings(block: BlockState) {
    return directions.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined

      return this.state.value[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  checkGameState() {
    if (!this.state.value.length)
      return
    const blocks = this.state.value.flat()
    if (blocks.every(block => block.revealed || block.flagged)) {
      this.isOver = true
      if (blocks.some(block => block.revealed && block.mine))
        return
      if (blocks.every(block => block.flagged && !block.mine))
        alert('You cheat!')
      else
        alert('You win!!')
    }
  }

  showAll() {
    const blocks = this.state.value.flat()
    blocks.forEach((block) => {
      block.revealed = true
    })
  }

  reset() {
    this.mineGenerated = false
    this.isOver = false
    this.state.value = Array.from({ length: this.height }, (_, y) =>
      Array.from({ length: this.width },
        (_, x): BlockState => ({
          x,
          y,
          adjacentMines: 0,
          revealed: false,
        }),
      ),
    )
  }
}
