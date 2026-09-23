<template>
  <div
    class="rocket-image"
    :style="{ aspectRatio }"
  >
    <v-img
      v-if="src && !failed"
      :src="src"
      :alt="alt"
      cover
      class="h-100 w-100"
      @error="failed = true"
    >
      <template #placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </div>
      </template>
    </v-img>
    <div
      v-else
      class="fallback d-flex flex-column align-center justify-center fill-height"
    >
      <v-icon
        icon="mdi-rocket-launch-outline"
        size="48"
        color="grey"
      />
      <span class="text-caption text-medium-emphasis mt-2">No image available</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const props = withDefaults(defineProps<{
    src?: string | null
    alt?: string
    aspectRatio?: string
  }>(), {
    src: null,
    alt: 'Rocket image',
    aspectRatio: '16 / 9',
  })

  const failed = ref(false)
  watch(() => props.src, () => {
    failed.value = false
  })
</script>

<style scoped lang="scss">
@use '../styles/variables' as vars;

.rocket-image {
  width: 100%;
  overflow: hidden;
  background: rgb(var(--v-theme-surface-variant));
}

.fallback {
  min-height: vars.$image-fallback-min-height;
}
</style>
