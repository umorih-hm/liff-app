<template lang="pug">
v-app
  v-main(
    style="background: #F0F4F7"
  )
    v-container.h-100(
      fluid
    )
      v-row(
        align="center"
        justify="center"
        no-gutters
      )
        v-col.flex-grow-0
          slot
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

// const config = useRuntimeConfig()
const { mdAndDown } = useDisplay()
// const i18n = useI18n()
</script>

<style scoped lang="sass">
</style>
