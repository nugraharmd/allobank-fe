<template>
  <v-app-bar
    flat
    border
  >
    <v-app-bar-title>
      <RouterLink
        to="/"
        class="brand-link"
      >
        <v-icon
          icon="mdi-rocket-launch"
          color="primary"
          class="mr-2"
        />
        <span class="font-weight-bold">Rocket Explorer</span>
        <span class="text-caption text-medium-emphasis ml-2 d-none d-sm-inline">SpaceX · Launch Library 2</span>
      </RouterLink>
    </v-app-bar-title>
    <template #append>
      <v-chip
        color="primary"
        variant="tonal"
        size="small"
        prepend-icon="mdi-rocket"
      >
        {{ count }} rockets
      </v-chip>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
  defineProps<{ count: number }>()
</script>

<style scoped lang="scss">
.brand-link {
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
}
</style>
