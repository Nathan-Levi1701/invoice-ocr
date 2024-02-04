<script setup lang="ts">
import { reactive, ref } from 'vue'

interface Props {
  dialogState: boolean;
  dialogData?: DialogData;
}

interface DialogData {
  title: string
  images: Array<File>
}

const props = withDefaults(defineProps<Props>(), {
  dialogData: {} as any,
  dialogState: false,
});

const emit = defineEmits<{ (e: 'dialogResponse', response: {} | boolean): void }>()

const dialogState = ref<boolean>(props.dialogState);
const uploadForm = ref<any>({});

const dialogData = reactive<any>({
  title: props.dialogData.title,
  images: [],
});

const onSubmit = async (value: any) => {
  if (value) {
    const { valid } = await uploadForm.value.validate();
    if (valid) {
      emit('dialogResponse', dialogData);
    }
  } else {
    emit('dialogResponse', false);
  }
}

</script>

<template>
  <v-dialog v-model="dialogState" width="512" persistent>
    <v-card>
      <v-card-item>
        <v-card-title class="flex flex-row justify-between items-baseline">
          <h6 class="text-h6">
            {{ props.dialogData.title }}
          </h6>
          <v-btn variant="flat" icon="mdi-close" @click="emit('dialogResponse', false)" />
        </v-card-title>
        <div class="dialog_content">
          <!-- <v-card-subtitle>
            <p class="text-subtitle-1">
              {{ message }}
            </p>
          </v-card-subtitle> -->

          <v-form ref="uploadForm" class="overflow-auto">
            <v-file-input v-model="dialogData.images" accept=".png" counter label="Select images to upload" :rules="[v => v.length > 0 || 'Photos are required']"
              multiple chips prepend-icon="mdi-upload" variant="solo" :show-size="1000">
              <template #selection="{ fileNames }">
                <template v-for="(fileName) in fileNames" :key="fileName">
                  <v-chip label size="small" class="me-2">
                    {{ fileName }}
                  </v-chip>
                </template>
              </template>
            </v-file-input>
          </v-form>
        </div>
        <div class="dialog_actions">
          <v-btn variant="tonal" @click="onSubmit(false)">Close</v-btn>
          <v-btn color="primary" @click="onSubmit(dialogData)">Upload</v-btn>
        </div>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
:deep(.v-card .v-card-item) {
  padding: 14px 24px !important;
  .v-card-title {
    @apply flex flex-row justify-between items-baseline mb-3;
  }

  .v-card-subtitle {
    @apply mt-3;
  }

  .v-form {
    max-height: 60vh;
  }

  .dialog {
    &_content {
      @apply mt-8;
      padding-right: 3px;
    }

    &_actions {
      @apply grid grid-cols-2 gap-6 mt-6;
    }
  }
}
</style>
