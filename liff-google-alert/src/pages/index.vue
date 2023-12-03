<template lang="pug">
v-card(
  width="90vw"
)
  v-data-iterator(
    :items="alertLists"
    :items-per-page="5"
    :search="search"
    :page="page"
  )
    template(v-slot:header)
      v-toolbar.px-2
        v-text-field(
          v-model="search"
          clearable
          density="comfortable"
          hide-details
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          style="max-width: 300px;"
          variant="solo"
        )

    //- カード作成
    template(v-slot:default="{ items }")
        v-container.pa-2(fluid)
          v-row(dense)
            v-col(
              v-for="item in items"
              :key="item.title"
              cols="auto"
            )
              v-card.pb-3(
                border
                flat
              )
                div.d-flex.px-4
                  img(
                    :src="item.raw.image"
                    width="300px"
                    height="160px"
                    object-fit="fill"
                  )
                  div
                    v-list-item.mb-2(
                      :subtitle="item.raw.siteName"
                    )
                    v-list-item.mb-2(
                      :subtitle="item.raw.description"
                    )
                    v-list-item.mb-2(
                      :subtitle="item.raw.keyword"
                    )
                      template(v-slot:title)
                        strong.text-h6.mb-2 {{ item.raw.title }}
                    div.d-flex.px-4
                      v-icon(
                        icon="mdi-clock"
                        start
                      )
                      div.text-truncate {{ item.raw.publishedDate }}
                    v-btn(
                      :href="item.raw.url"
                      target="_blank"
                      border
                      flat
                      size="small"
                      class="text-none"
                      text="Read"
                    )

    template(v-slot:footer="{ page, pageCount, prevPage, nextPage }")
        div.d-flex.align-center.justify-center.pa-4
          v-btn(
            :disabled="page === 1"
            icon="mdi-arrow-left"
            density="comfortable"
            variant="tonal"
            rounded
            @click="prevPage"
          )
          div.mx-2.text-caption
            Page {{ page }} of {{ pageCount }}
          v-btn(
            :disabled="page >= pageCount"
            icon="mdi-arrow-right"
            density="comfortable"
            variant="tonal"
            rounded
            @click="nextPage"
          )
</template>

<script setup lang="ts">
import { JSDOM } from "jsdom";

const config = useRuntimeConfig()
const page = ref(1)
const search = ref('')

// OGP 情報取得
const getUrlOgp = (url: string) => {
  return fetch(url).then(res => res.text()).then(text => {
    const jsdom = new JSDOM();
    const parser = new jsdom.window.DOMParser();
    const el = parser.parseFromString(text, "text/html")
    const headEls = (el.head.children)
    return Array.from(headEls).map(v => {
      const prop = v.getAttribute('property')
      if(!prop) return
      return { prop: prop.replace("og:",""), content: v.getAttribute("content")}
    })
  }).then(list=>{
    return list.filter(v=>v)
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
const alertLists = await Promise.all(response.results.map(async (item, index) => {
  const formattedUrl = formatURL(item.properties.URL.url)
  let alert = { title: item.properties.Title.title[0].plain_text, keyword: item.properties.Keyword.select.name, url: item.properties.URL.url, publishedDate: item.properties.公開日.date.start }

  // OGP 情報取得
  const ogp = await getUrlOgp(formattedUrl)

  // OGP 情報が存在すれば alert にプロパティ追加
  if(!!ogp.length){
    for (var element of ogp){
      switch(element.prop){
        case 'description':
          alert.description = element.content
          break;
        case 'image':
          alert.image = element.content
          break;
        case 'site_name':
          alert.siteName = element.content
          break;
      }
    }
  }

  return alert
}))

</script>

<style scoped lang="sass">

</style>
