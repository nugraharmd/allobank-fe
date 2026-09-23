<template>
  <v-card
    variant="outlined"
    rounded="lg"
    class="pa-4"
  >
    <v-row dense>
      <v-col
        cols="12"
        md="5"
      >
        <v-text-field
          :model-value="filter.query"
          label="Search rockets"
          placeholder="e.g. Falcon, Starship…"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          @update:model-value="emitPatch({ query: $event ?? '' })"
        />
      </v-col>
      <v-col
        cols="6"
        md="3"
      >
        <v-select
          :model-value="filter.family"
          :items="familyOptions"
          label="Family"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          @update:model-value="emitPatch({ family: $event })"
        />
      </v-col>
      <v-col
        cols="6"
        md="2"
      >
        <v-select
          :model-value="filter.sort"
          :items="sortOptions"
          label="Sort by"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="emitPatch({ sort: $event })"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
        class="d-flex align-center justify-md-end ga-2"
      >
        <v-switch
          :model-value="filter.activeOnly"
          label="Active"
          density="compact"
          hide-details
          color="success"
          @update:model-value="emitPatch({ activeOnly: $event ?? false })"
        />
        <v-btn
          v-if="hasActiveFilter"
          icon="mdi-filter-off-outline"
          variant="text"
          size="small"
          title="Clear filters"
          @click="$emit('reset')"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { RocketFilter } from '@/types/rocket'

  const props = defineProps<{
    filter: RocketFilter
    families: string[]
  }>()

  const emit = defineEmits<{
    patch: [patch: Partial<RocketFilter>]
    reset: []
  }>()

  const familyOptions = computed(() => props.families)

  const sortOptions = [
    { title: 'Name (A–Z)', value: 'name-asc' },
    { title: 'Name (Z–A)', value: 'name-desc' },
    { title: 'Cost (low first)', value: 'cost-asc' },
    { title: 'Cost (high first)', value: 'cost-desc' },
    { title: 'First flight (oldest)', value: 'flight-asc' },
    { title: 'First flight (newest)', value: 'flight-desc' },
  ]

  const hasActiveFilter = computed(() =>
    props.filter.query.trim() !== '' || props.filter.family !== null || props.filter.activeOnly,
  )

  function emitPatch (patch: Partial<RocketFilter>): void {
    emit('patch', patch)
  }
</script>
