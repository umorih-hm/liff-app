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
import { JSDOM } from "jsdom";
const config = useRuntimeConfig()

// OGP 情報取得
const getUrlOgp = (url: string) => {
  fetch(url).then(res => res.text()).then(text => {
    const jsdom = new JSDOM();
    const parser = new jsdom.window.DOMParser();
    const el = parser.parseFromString(text, "text/html")
    const headEls = (el.head.children)
    let imageUrl
    let description
    Array.from(headEls).map(v => {
      const prop = v.getAttribute('property')
      console.log(prop, v.getAttribute("content"))
      switch(prop) {
        case 'og:image':
          imageUrl = v.getAttribute("content")
          break;
        case 'og:description':
          description = v.getAttribute("content")
          break;
        default:
          break;
      }
    })
  })
}

// URL の整形
const formatURL = (url: string) => {
  const searchString = 'url='
  var regex = new RegExp(searchString);
  var match = regex.exec(url);

  if (match) {
    var result = url.substring(match.index + match[0].length);
    return result
  } else {
    console.log("特定の文字列は見つかりませんでした。");
  }
}

// notionDB 一覧取得
const notion = useNotion();
const response = await notion.databases.query({ database_id: config.public.notion_database_id });

// 取得データをループ
const alertLists = response.results.map((item, index) => {
  const formattedUrl = formatURL(item.properties.URL.url)
  // OGP 情報取得
  getUrlOgp(formattedUrl)

  const alert = { title: item.properties.Title.title[0].plain_text, url: formattedUrl, publishedDate: item.properties.公開日.date.start }
  return alert
})

console.log(alertLists)

</script>

<style scoped lang="sass">

</style>
