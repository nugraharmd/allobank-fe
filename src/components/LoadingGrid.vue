<template>
  <v-row>
    <v-col
      v-for="n in count"
      :key="n"
      cols="12"
      sm="6"
      md="4"
    >
      <v-card rounded="lg">
        <v-skeleton-loader type="image, heading, paragraph, actions" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  withDefaults(defineProps<{ count?: number }>(), { count: 6 })
</script>
