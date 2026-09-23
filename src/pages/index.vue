<template>
  <v-container
    class="py-6"
    max-width="1200"
  >
    <!-- Hero -->
    <div class="d-flex flex-wrap align-center justify-space-between ga-3 mb-4">
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ resultSummary }}
        </p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        prepend-icon="mdi-plus"
        @click="dialog = true"
      >
        Add rocket
      </v-btn>
    </div>

    <!-- Filter -->
    <RocketFilterBar
      :filter="store.filter"
      :families="store.families"
      class="mb-4"
      @patch="store.setFilter"
      @reset="store.resetFilter"
    />

    <!-- Loading -->
    <LoadingGrid
      v-if="store.listStatus === 'loading' || store.listStatus === 'idle'"
      :count="6"
    />

    <!-- Error + retry -->
    <StateMessage
      v-else-if="store.listStatus === 'error'"
      icon="mdi-cloud-alert-outline"
      title="Failed to load rockets"
      :message="store.listError ?? 'We could not reach the Launch Library API. Check your connection and try again.'"
      show-retry
      @retry="store.loadRockets"
    />

    <!-- Success -->
    <template v-else>
      <v-row v-if="store.filteredRockets.length > 0">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
      <StateMessage
        v-else
        icon="mdi-rocket-launch-outline"
        color="grey"
        title="No rockets match your filters"
        message="Try a different search term, or clear the filters to see all rockets."
        show-reset
        @reset="store.resetFilter"
      />
    </template>

    <AddRocketDialog
      v-model="dialog"
      @add="onAdd"
    />

    <v-snackbar
      v-model="snackbar"
      color="success"
      timeout="3500"
    >
      <v-icon
        icon="mdi-check-circle-outline"
        class="mr-2"
      />
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import AddRocketDialog from '@/components/AddRocketDialog.vue'
  import LoadingGrid from '@/components/LoadingGrid.vue'
  import RocketCard from '@/components/RocketCard.vue'
  import RocketFilterBar from '@/components/RocketFilterBar.vue'
  import StateMessage from '@/components/StateMessage.vue'
  import { useRocketsStore } from '@/stores/rockets'
  import { rocketName } from '@/utils/format'

  const store = useRocketsStore()
  const dialog = ref(false)
  const snackbar = ref(false)
  const snackbarText = ref('')

  const resultSummary = computed(() => {
    if (store.listStatus === 'loading' || store.listStatus === 'idle') return 'Loading rockets…'
    const total = store.allRockets.length
    const shown = store.filteredRockets.length
    if (total === 0) return 'No rockets loaded yet.'
    return shown === total
      ? `Showing all ${total} rockets`
      : `Showing ${shown} of ${total} rockets`
  })

  // Lifecycle: fetch once when the list screen mounts.
  onMounted(() => {
    if (store.listStatus === 'idle') {
      store.loadRockets()
    }
  })

  function onAdd (payload: {
    name: string
    description: string
    family?: string | null
    country_code?: string | null
    launch_cost?: string | null
    maiden_flight?: string | null
    image_url?: string | null
  }): void {
    const created = store.addRocket(payload)
    snackbarText.value = `${rocketName(created)} added to your list.`
    snackbar.value = true
  }
</script>
