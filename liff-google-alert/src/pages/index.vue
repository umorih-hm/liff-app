<template lang="pug">
v-card(
  width="90vw"
)
  v-data-iterator(
    :items="items"
    :page="page"
  )
    template(v-slot:default="{ items }")
      template(
        v-for="(item, i) in items"
        :key="i"
      )
        v-card(
          v-bind="item.raw"
        )
</template>

<script setup lang="ts">
const page = 1
const items = Array.from({ length: 15 }, (k, v) => ({
      title: 'Item ' + v + 1,
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!',
}))

// notionDB 一覧取得
require("dotenv").config();
const notion = useNotion();
const response = await notion.databases.query({ database_id: process.env.DATABASE_ID });
console.log(response);
console.log(response.results[0].properties.Title.title[0].plain_text);
</script>

<style scoped lang="sass">

</style>
