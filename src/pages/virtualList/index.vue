<script setup lang="ts">
import { faker } from '@faker-js/faker'
import type { vListItem } from '../../types'
// 所有列表数据
const listData = ref<vListItem[]>(Array.from({ length: 20 }, (_, index) => ({
  id: index,
  value: faker.lorem.sentences(), // 长文本
})))
</script>

<template>
  <div>虚拟列表-VirtuaList</div>
  <div class="list">
    <VList :list-data="listData" />
  </div>
</template>

<style scoped>
.list{
    width: 300px;
    height: 100%;
}
</style>
