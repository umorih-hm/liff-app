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
          variant="solo"
        )

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
                variant="elevated"
              )
                v-card-item
                  div.d-flex.px-4
                    a(
                      :href="item.raw.url"
                      target="_blank"
                    )
                      img(
                        :src="item.raw.image"
                        width="300px"
                        height="auto"
                        object-fit="fill"
                      )
                    div
                      a(
                        :href="item.raw.url"
                        target="_blank"
                      )
                        v-card-title.px-4.py-2 {{ item.raw.title }}
                      v-card-text.px-4.py-2(v-if="!!item.raw.description") {{ item.raw.description }}
                      v-chip.mx-4.my-2(
                        label
                        x-small
                      ) {{ item.raw.keyword }}
                      v-card-text.px-4.py-2(v-if="!!item.raw.siteName") {{$t('pages.index.provider')}} {{ item.raw.siteName }}
                      div.d-flex.px-4.py-2.justify-end
                        v-icon.mr-1(
                          icon="mdi-clock-outline"
                          x-small
                        )
                        v-card-subtitle {{ item.raw.publishedDate }}

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
import { useDisplay } from 'vuetify'

const config = useRuntimeConfig()
const { mdAndDown } = useDisplay()
const page = ref(1)
const search = ref('')
const alertLists = ref([])

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
alertLists.value = await Promise.all(response.results.map(async (item, index) => {
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
