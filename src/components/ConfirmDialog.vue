<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string;
  message: string;
  dialogState: boolean;
  dialogData?: any;
  type?: string;
}

const props = withDefaults(defineProps<Props>(), {
  dialogState: false,
  title: '',
  message: '',
  dialogData: {},
  type: ''
})

const emit = defineEmits<{ (e: 'dialogResponse', response: {} | boolean): void }>()

const dialogState = ref<boolean>(props.dialogState);
</script>

<template>
  <v-dialog v-model="dialogState" width="512" persistent>
    <v-card>
      <v-card-item>
        <v-card-title class="flex flex-row justify-between items-baseline">
          <h6 class="text-h6">
            {{ title }}
          </h6>
          <v-btn variant="flat" icon="mdi-close" @click="emit('dialogResponse', false)" />
        </v-card-title>
        <v-divider class="border-opacity-100"></v-divider>
        <div class="dialog_content">
          <v-card-subtitle>
            <p class="text-subtitle-1" :style="{ color: props.type === 'danger' ? 'red': 'black'}">
              {{ message }}
            </p>
          </v-card-subtitle>
        </div>
        <div class="dialog_actions">
          <v-btn variant="tonal" @click="emit('dialogResponse', false)">No</v-btn>
          <v-btn color="primary" @click="emit('dialogResponse', dialogData)">Yes</v-btn>
        </div>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
:deep(.v-card .v-card-item) {
  padding: 14px 0 !important;

  .v-card-title {
    @apply flex flex-row justify-between items-baseline mb-3;
    padding: 0 24px;
  }

  .v-card-subtitle {
    @apply mt-4;

    p {
      text-wrap: wrap;
      font-weight: 600;
    }
  }

  .dialog {
    &_content {
      padding: 0 24px;
    }

    &_actions {
      @apply grid grid-cols-2 gap-6 mt-6;
      padding: 0 24px;
    }
  }
}
</style>
