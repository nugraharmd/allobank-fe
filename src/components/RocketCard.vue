<template>
  <v-card
    hover
    rounded="lg"
    class="rocket-card d-flex flex-column"
    @click="goToDetail"
  >
    <RocketImage
      :src="rocket.image_url"
      :alt="displayName"
    />
    <v-card-item>
      <v-card-title class="text-h6 text-wrap">
        {{ displayName }}
      </v-card-title>
      <template #append>
        <v-chip
          v-if="rocket.isLocal"
          color="secondary"
          size="x-small"
          variant="flat"
        >
          NEW
        </v-chip>
      </template>
    </v-card-item>
    <v-card-text class="pt-0 flex-grow-1">
      <p class="description text-body-2 text-medium-emphasis">
        {{ displayDescription }}
      </p>
      <div class="d-flex flex-wrap ga-1 mt-3">
        <v-chip
          v-if="rocket.family"
          size="x-small"
          variant="tonal"
        >
          {{ rocket.family }}
        </v-chip>
        <v-chip
          v-if="rocket.active !== null && rocket.active !== undefined"
          size="x-small"
          :color="rocket.active ? 'success' : 'grey'"
          variant="tonal"
        >
          {{ rocket.active ? 'Active' : 'Retired' }}
        </v-chip>
        <v-chip
          v-if="formattedCost"
          size="x-small"
          variant="tonal"
          prepend-icon="mdi-cash"
        >
          {{ formattedCost }}
        </v-chip>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="primary"
        variant="text"
        append-icon="mdi-arrow-right"
        @click="goToDetail"
      >
        View details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import RocketImage from '@/components/RocketImage.vue'
  import { formatLaunchCost, rocketDescription, rocketName } from '@/utils/format'
  import type { Rocket } from '@/types/rocket'

  const props = defineProps<{ rocket: Rocket }>()
  const router = useRouter()

  const displayName = computed(() => rocketName(props.rocket))
  const displayDescription = computed(() => rocketDescription(props.rocket))
  const formattedCost = computed(() => formatLaunchCost(props.rocket.launch_cost))

  function goToDetail (): void {
    router.push(`/rockets/${props.rocket.id}`)
  }
</script>

<style scoped lang="scss">
@use '../styles/variables' as vars;
@use '../styles/mixins' as mixins;

.rocket-card {
  height: 100%;
  transition: vars.$card-transition;

  &:hover {
    transform: translateY(vars.$card-hover-lift);
  }
}

.description {
  @include mixins.line-clamp(3);
}
</style>
