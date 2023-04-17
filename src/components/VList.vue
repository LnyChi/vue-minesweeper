<script setup lang="ts">
import type { vListItem } from '../types'

const { listData, itemSize } = defineProps<{ listData: vListItem[]; itemSize?: number }>()
// DOM元素
const items = ref(null)
const list = ref()
const itemHeight = ref(itemSize || 0)
// 开始索引
const start = ref(0)
// 结束索引
const end = ref()
// 可视区域高度
const screenHeight = ref(0)
// 偏移量
const startOffset = ref<number>(0)
// 偏移量对应的style
const getTransform = computed(() => `translate3d(0,${startOffset.value}px,0)`)
// 可显示的列表项数
const visibleCount = computed(() => Math.ceil(screenHeight.value / itemHeight.value))
// 获取当前显示列表数据
const visibleData = computed(() => listData.slice(start.value, Math.min(end.value, listData.length)))
// 列表总高度
const listHeight = computed(() => listData.length * itemHeight.value)
onMounted(() => {
  screenHeight.value = document.documentElement.clientHeight
  start.value = 0
  end.value = start.value + visibleCount.value
})
function scrollEvent() {
  // 当前滚动位置
  const scrollTop = list.value.scrollTop
  // 此时的开始索引
  start.value = Math.floor(scrollTop / itemHeight.value)
  // 此时的结束索引
  end.value = start.value + visibleCount.value
  // 此时的偏移量
  startOffset.value = start.value * itemHeight.value
}
function init() {
  if (!itemHeight.value)
    itemHeight.value = 200
}
init()
</script>

<template>
  <div ref="list" class="infinite-list-container" @scroll="scrollEvent">
    <div class="infinite-list-phantom" :style="{ height: `${listHeight}px` }" />
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div
        v-for="item in visibleData" ref="items" :key="item.id" class="infinite-list-item"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
  border: 1px solid black;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
