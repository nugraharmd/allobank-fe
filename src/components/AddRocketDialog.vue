<template>
  <v-dialog
    :model-value="modelValue"
    max-width="560"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center">
        <v-icon
          icon="mdi-rocket-launch"
          color="primary"
          class="mr-2"
        />
        Add a new rocket
      </v-card-title>
      <v-card-subtitle>Stored locally — the API is read-only.</v-card-subtitle>
      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.name"
            label="Rocket name *"
            :rules="[rules.required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-textarea
            v-model="form.description"
            label="Description *"
            :rules="[rules.required]"
            variant="outlined"
            density="compact"
            rows="3"
            auto-grow
            class="mb-2"
          />
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.family"
                label="Family"
                placeholder="Falcon"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Country code"
                placeholder="USA"
                variant="outlined"
                density="compact"
                maxlength="8"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Cost per launch (USD)"
                placeholder="52000000"
                variant="outlined"
                density="compact"
                type="number"
                min="0"
                :rules="[rules.numeric]"
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.maiden_flight"
                label="First flight"
                variant="outlined"
                density="compact"
                type="date"
              />
            </v-col>
          </v-row>
          <v-text-field
            v-model="form.image_url"
            label="Image URL"
            placeholder="https://…"
            variant="outlined"
            density="compact"
            :rules="[rules.url]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-plus"
          @click="submit"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { VForm } from 'vuetify/components'

  defineProps<{ modelValue: boolean }>()
  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    add: [payload: {
      name: string
      description: string
      family?: string | null
      country_code?: string | null
      launch_cost?: string | null
      maiden_flight?: string | null
      image_url?: string | null
    }]
  }>()

  const formRef = ref<VForm | null>(null)
  const form = reactive({
    name: '',
    description: '',
    family: '',
    country_code: '',
    launch_cost: '',
    maiden_flight: '',
    image_url: '',
  })

  const rules = {
    required: (v: string) => (!!v && v.trim().length > 0) || 'This field is required.',
    numeric: (v: string) => (!v || (!Number.isNaN(Number(v)) && Number(v) >= 0)) || 'Enter a valid non-negative number.',
    url: (v: string) => {
      if (!v) return true
      try {
        const url = new URL(v)
        return (url.protocol === 'http:' || url.protocol === 'https:') || 'Enter a valid http(s) URL.'
      } catch {
        return 'Enter a valid http(s) URL.'
      }
    },
  }

  function reset (): void {
    form.name = ''
    form.description = ''
    form.family = ''
    form.country_code = ''
    form.launch_cost = ''
    form.maiden_flight = ''
    form.image_url = ''
    formRef.value?.resetValidation()
  }

  function close (): void {
    emit('update:modelValue', false)
  }

  async function submit (): Promise<void> {
    const result = await formRef.value?.validate()
    if (!result?.valid) return
    emit('add', {
      name: form.name.trim(),
      description: form.description.trim(),
      family: form.family.trim() || null,
      country_code: form.country_code.trim() || null,
      launch_cost: form.launch_cost.trim() || null,
      maiden_flight: form.maiden_flight.trim() || null,
      image_url: form.image_url.trim() || null,
    })
    reset()
    close()
  }
</script>
