<template>
  <div class="d-flex align-start ga-3 py-2">
    <v-avatar
      color="surface-variant"
      rounded="lg"
      size="40"
    >
      <v-icon :icon="icon" />
    </v-avatar>
    <div class="min-w-0">
      <div class="text-caption text-medium-emphasis text-uppercase font-weight-medium">
        {{ label }}
      </div>
      <div class="text-body-1 font-weight-medium text-wrap">
        {{ value ?? MISSING_TEXT }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { MISSING_TEXT } from '@/utils/format'

  withDefaults(defineProps<{
    icon?: string
    label?: string
    value?: string | null
  }>(), {
    icon: 'mdi-information-outline',
    label: 'Detail',
    value: null,
  })
</script>

<style scoped lang="scss">
.min-w-0 {
  min-width: 0;
}
</style>
