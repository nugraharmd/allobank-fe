<template>
  <v-app>
    <AppHeader :count="store.allRockets.length" />
    <v-main>
      <router-view />
    </v-main>
    <v-footer
      app
      border
      class="justify-center text-caption text-medium-emphasis"
    >
      Data by The Space Devs · Launch Library 2 (dev host)
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
  import AppHeader from '@/components/AppHeader.vue'
  import { useRocketsStore } from '@/stores/rockets'

  const store = useRocketsStore()
</script>
