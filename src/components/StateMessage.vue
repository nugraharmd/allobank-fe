<template>
  <div class="state-wrap d-flex flex-column align-center justify-center text-center py-16 px-6">
    <v-icon
      :icon="icon"
      size="56"
      :color="color"
    />
    <h3 class="text-h6 mt-4">
      {{ title }}
    </h3>
    <p class="text-body-2 text-medium-emphasis mt-1 mb-5 max-w">
      {{ message }}
    </p>
    <div class="d-flex ga-2">
      <v-btn
        v-if="showRetry"
        color="primary"
        variant="flat"
        prepend-icon="mdi-refresh"
        @click="$emit('retry')"
      >
        Retry
      </v-btn>
      <v-btn
        v-if="showReset"
        variant="outlined"
        prepend-icon="mdi-filter-off-outline"
        @click="$emit('reset')"
      >
        Clear filters
      </v-btn>
      <v-btn
        v-if="showBack"
        variant="outlined"
        prepend-icon="mdi-arrow-left"
        to="/"
      >
        Back to list
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{
    icon?: string
    color?: string
    title?: string
    message?: string
    showRetry?: boolean
    showReset?: boolean
    showBack?: boolean
  }>(), {
    icon: 'mdi-alert-circle-outline',
    color: 'error',
    title: 'Something went wrong',
    message: 'We could not load the data. Please try again.',
    showRetry: false,
    showReset: false,
    showBack: false,
  })

  defineEmits<{
    retry: []
    reset: []
  }>()
</script>

<style scoped lang="scss">
@use '../styles/variables' as vars;

.state-wrap {
  min-height: vars.$state-min-height;
}

.max-w {
  max-width: vars.$state-message-max-width;
}
</style>
