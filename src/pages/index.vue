<script setup lang="ts">
import { isDev, toggleDev } from '~/composables/index'
import { GamePlay } from '~/composables/logic'
const play = new GamePlay(10, 10)
// useStorage('vuesweeper-sate', play.state)
const state = play.state
</script>

<template>
  <div>
    Minesweeper

    <div p5>
      <div v-for="row, y in state" :key="y" flex="~" items-center justify-center>
        <MineBlock
          v-for="block, x in row" :key="x" :block="block" @contextmenu.prevent="play.onRightClick(block)"
          @click="play.onClick(block)"
        />
      </div>
    </div>
    <div flex="~ gap-1" justify-center>
      <button btn @click="toggleDev()">
        开发模式： {{ isDev }}
      </button>
      <button btn @click="play.reset">
        重置扫雷
      </button>
      <button btn @click="play.countMines">
        本局几个炸弹
      </button>
      <button btn @click="play.getState">
        进度
      </button>
    </div>
  </div>
</template>
