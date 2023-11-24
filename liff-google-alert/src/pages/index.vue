<template lang="pug">
v-card(
  width="90vw"
)
  v-data-iterator(
    :items="alertLists"
    :page="page"
  )
</template>

<script setup lang="ts">
const config = useRuntimeConfig()

// notionDB 一覧取得
const notion = useNotion();
const response = await notion.databases.query({ database_id: config.public.notion_database_id });

// 取得データをループ
const alertLists = response.results.map((item, index) => {
  const alert = { title: item.properties.Title.title[0].plain_text, url:  item.properties.URL.url, publishedDate: item.properties.公開日.date.start }
  return alert
})

console.log(alertLists)

</script>

<style scoped lang="sass">

</style>
