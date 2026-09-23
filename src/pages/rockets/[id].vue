<template>
  <v-container
    class="py-6"
    max-width="1000"
  >
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      to="/"
      class="mb-4 px-0"
    >
      Back to rockets
    </v-btn>

    <!-- Loading -->
    <v-card
      v-if="store.detailStatus === 'loading' || store.detailStatus === 'idle'"
      rounded="lg"
      variant="outlined"
    >
      <v-skeleton-loader type="image, heading, paragraph, paragraph, actions" />
    </v-card>

    <!-- Error + retry -->
    <StateMessage
      v-else-if="store.detailStatus === 'error' || !rocket"
      icon="mdi-cloud-alert-outline"
      title="Failed to load rocket details"
      :message="store.detailError ?? 'This rocket could not be found. It may have been removed or the link is invalid.'"
      show-retry
      show-back
      @retry="reload"
    />

    <!-- Success -->
    <v-card
      v-else
      rounded="lg"
      variant="outlined"
    >
      <RocketImage
        :src="rocket!.image_url"
        :alt="displayName"
        aspect-ratio="21 / 9"
      />
      <v-card-item>
        <v-card-title class="text-h4 text-wrap">
          {{ displayName }}
        </v-card-title>
        <v-card-subtitle
          v-if="rocket!.family"
          class="mt-1"
        >
          {{ rocket!.family }}<span v-if="rocket!.variant"> · {{ rocket!.variant }}</span>
        </v-card-subtitle>
        <template #append>
          <v-chip
            v-if="rocket!.active !== null && rocket!.active !== undefined"
            :color="rocket!.active ? 'success' : 'grey'"
            variant="tonal"
          >
            {{ rocket!.active ? 'Active' : 'Retired' }}
          </v-chip>
        </template>
      </v-card-item>
      <v-card-text>
        <p class="text-body-1">
          {{ displayDescription }}
        </p>
        <v-divider class="my-4" />
        <v-row dense>
          <v-col
            cols="12"
            sm="4"
          >
            <DetailField
              icon="mdi-cash"
              label="Cost per launch"
              :value="formattedCost"
            />
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <DetailField
              icon="mdi-earth"
              label="Country"
              :value="country"
            />
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <DetailField
              icon="mdi-calendar-star"
              label="First flight"
              :value="formattedFlight"
            />
          </v-col>
        </v-row>
        <v-row
          dense
          class="mt-1"
        >
          <v-col
            cols="12"
            sm="4"
          >
            <DetailField
              icon="mdi-rocket"
              label="Family"
              :value="rocket!.family"
            />
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <DetailField
              icon="mdi-repeat"
              label="Reusable"
              :value="reusableText"
            />
          </v-col>
          <v-col
            cols="12"
            sm="4"
          >
            <DetailField
              icon="mdi-factory"
              label="Manufacturer"
              :value="rocket!.manufacturer?.name"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import DetailField from '@/components/DetailField.vue'
  import RocketImage from '@/components/RocketImage.vue'
  import StateMessage from '@/components/StateMessage.vue'
  import { useRocketsStore } from '@/stores/rockets'
  import {
    formatFlightDate,
    formatLaunchCost,
    rocketCountry,
    rocketDescription,
    rocketName,
  } from '@/utils/format'

  const route = useRoute()
  const store = useRocketsStore()

  const rocketId = computed(() => String(route.params.id ?? ''))

  const rocket = computed(() => store.activeDetail)
  const displayName = computed(() => (rocket.value ? rocketName(rocket.value) : 'Rocket details'))
  const displayDescription = computed(() => (rocket.value ? rocketDescription(rocket.value) : ''))
  const formattedCost = computed(() => (rocket.value ? formatLaunchCost(rocket.value.launch_cost) : null))
  const formattedFlight = computed(() => (rocket.value ? formatFlightDate(rocket.value.maiden_flight) : null))
  const country = computed(() => (rocket.value ? rocketCountry(rocket.value) : null))
  const reusableText = computed(() => {
    if (!rocket.value || rocket.value.reusable === null || rocket.value.reusable === undefined) return null
    return rocket.value.reusable ? 'Yes' : 'No'
  })

  function reload (): void {
    if (rocketId.value) store.loadRocketDetail(rocketId.value)
  }

  // Lifecycle: fetch detail on mount and whenever the route id changes.
  onMounted(reload)
  watch(rocketId, reload)
</script>
