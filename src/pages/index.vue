<route lang="yaml">
meta:
  layout: blank
</route>

<script setup lang="ts">
/* eslint-disable */
import { useHead } from '@vueuse/head'
import { reactive, ref } from 'vue';
import Tesseract, { Line, LoggerMessage, Page, RecognizeResult, Word } from 'tesseract.js';
import { watch } from 'vue';
import _ from 'lodash'
import * as ExcelJS from 'exceljs';

useHead({
  title: 'Invoice OCR',
  meta: [
    { name: 'description', content: 'Home Description' }],
});

const uploadDialogState = ref<boolean>(false);
const dialogData = ref<any>({
  title: 'Upload Invoices'
});

const loggerObject = ref<LoggerMessage>({
  jobId: '',
  progress: 0,
  status: 'Ready',
  userJobId: '',
  workerId: ''
});

const indicators = reactive({
  overallStartTime: 0,
  overallElapsedTime: 0,
  overallProcess: 0,

  individualProcess: 0,

  queueLength: 0,
  processedLength: 0,
})

const timerRunning = ref(false);
const formattedTime = ref('00:00.00');

const stopAllProcessing = ref(false);

const generatedFile = reactive<any>({
  file: '',
  url: ''
});

const scheduler = ref<Tesseract.Scheduler>();

const startTimer = () => {
  indicators.overallStartTime = performance.now() - indicators.overallElapsedTime;
  timerRunning.value = true;
  updateTimer();
};

const updateTimer = () => {
  if (timerRunning.value) {
    indicators.overallElapsedTime = performance.now() - indicators.overallStartTime;
    requestAnimationFrame(updateTimer);
  }
};

const stopTimer = () => {
  indicators.overallElapsedTime = performance.now() - indicators.overallStartTime;
  timerRunning.value = false;
};

const resetIndicators = () => {
  indicators.queueLength = 0;
  indicators.overallStartTime = 0;
  indicators.processedLength = 0;
  indicators.overallProcess = 0;
  indicators.overallElapsedTime = 0;
  formattedTime.value = '00:00.00';
  indicators.individualProcess = 0;
  generatedFile.file = '';
  generatedFile.url = '';
  loggerObject.value.status = 'Ready';
}

const updateFormattedTime = () => {
  const minutes = Math.floor(indicators.overallElapsedTime / 60000);
  const seconds = Math.floor((indicators.overallElapsedTime % 60000) / 1000);
  const milliseconds = Math.floor((indicators.overallElapsedTime % 1000));

  formattedTime.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
};

watch(() => indicators.overallElapsedTime, updateFormattedTime);

watch(stopAllProcessing, async () => {
  if (stopAllProcessing.value) {
    await terminateAll();
    stopTimer();
  }
})

const OCRlogger = (log: LoggerMessage) => {
  loggerObject.value = { ...log };
  loggerObject.value.status = log.status;

  if (loggerObject.value.jobId) {
    indicators.individualProcess = loggerObject.value.progress * 100;

    if (log.progress === 1) {
      indicators.processedLength += 1;
      indicators.overallProcess = (indicators.processedLength / indicators.queueLength) * 100;
    }
  }
}

const terminateAll = async () => {
  loggerObject.value.status = 'Stopped';
  await scheduler.value.terminate();
  stopAllProcessing.value = false;
}

const uploadDialogResponse = (response: any) => {
  uploadDialogState.value = false;

  if (response) {
    resetIndicators();

    scheduler.value = Tesseract.createScheduler();
    // Tesseract.setLogging(true)

    // Creates worker and adds to scheduler
    const workerGen = async () => {
      const worker = await Tesseract.createWorker('eng', Tesseract.OEM.DEFAULT, { logger: OCRlogger });
      scheduler.value.addWorker(worker);
    }

    const workerN = 4;
    (async () => {
      const resArr = Array(workerN);
      for (let i = 0; i < workerN; i++) {
        resArr[i] = workerGen();
      }
      await Promise.all(resArr);

      indicators.queueLength = response.images.length;

      startTimer();

      // Add recognition jobs for each image URL
      const recognitionJobs: Array<RecognizeResult> = await Promise.all(response.images.map((image: File) => {
        return scheduler.value.addJob('recognize', image)
      }));

      stopTimer();

      await scheduler.value.terminate(); // It also terminates all workers.

      loggerObject.value.status = 'Completed';

      const results: Array<Page> = recognitionJobs.map((job: any) => job.data);

      let invoices: Array<any> = [{}];
      let grandTotal: number = 0;

      results.forEach((value: Page, invIndex: number) => {
        let totalCost: number = 0;

        invoices[invIndex] = {
          items: []
        };

        const lines = value.lines.filter((_: Line, index: number) => index > value.lines.findIndex((line: Line) => line.text.includes('DESCRIPTION')));

        lines.forEach((line: Line) => {
          const condition1: RegExpMatchArray = JSON.stringify(line.text).match(/(?<=\s)(\d+)(?=\\n)/);
          const condition2 = parseFloat(line.words.map(((word: Word) => word.text)).pop());


          if (condition1 && condition1[0] && condition2) {
            const itemTotal = parseInt(condition1[0]);

            if (itemTotal && itemTotal > 0) {
              totalCost += itemTotal;
              grandTotal += itemTotal;
            }

            invoices[invIndex]['items'].push({
              description: line.words.map((word: Word) => word.text).slice(0, -1).join(' '),
              itemTotal
            });

            invoices[invIndex]['totalCost'] = totalCost;
          }
        })
      })

      exportToExcel(invoices, { grandTotal });
    })();
  }

  const exportToExcel = (data: Array<any>, extras?: any) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet();

    data.forEach((row: { items: Array<any>, totalCost: number, invoiceNumber: string }) => {
      sheet.addRow(['DESCRIPTION', 'TOTAL']);
      row.items.forEach((item: any) => {
        sheet.addRow([item.description, item.itemTotal])
      });
      sheet.addRow('');
      sheet.addRow(['SUBTOTAL:', row.totalCost]);
      sheet.addRow('');
    });

    sheet.addRow('');
    sheet.addRow(['GRAND TOTAL:', extras.grandTotal])

    workbook.xlsx.writeBuffer().then((response: BlobPart) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      generatedFile.file = new File([blob], 'EPI-USE INV OCR', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      generatedFile.url = URL.createObjectURL(generatedFile.file);
    })
  }
}

</script>

<template>
  <div class="page">
    <div class="content">
      <div class="flex">
        <v-btn prepend-icon="mdi-upload" color="primary" variant="elevated" @click="uploadDialogState = true;"
          :disabled="['recognizing text', 'initializing api', 'loading language traineddata', 'initializing tesseract', 'loading tesseract core', 'Stopped'].includes(loggerObject.status)">
          Upload Invoices
        </v-btn>

        <upload-dialog v-if="uploadDialogState" :dialogData="dialogData" :dialogState="uploadDialogState"
          @dialog-response="uploadDialogResponse">
        </upload-dialog>
      </div>

      <h3 class="my-6"><strong>Current Status: </strong>{{ _.startCase(loggerObject.status) }} </h3>

      <h3 class="mb-2">Individual Progress:</h3>
      <v-progress-linear class="mb-12" v-model="indicators.individualProcess"
        :color="indicators.overallProcess < 100 ? '#3fbbd3' : 'success'" height="20" rounded>
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>

      <h3 class="mb-2">Overall Progress:</h3>
      <v-progress-linear v-model="indicators.overallProcess"
        :color="indicators.overallProcess < 100 ? 'accent' : 'success'" height="20" rounded>
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>

      <h3 class="mt-6 mb-14">Total Time Elapsed: <strong>{{ formattedTime }}</strong></h3>

      <div class="flex flex-col md:flex-row box-border gap-6" :style="{ width: 'calc(100% - 20px)' }">
        <v-btn class="flex w-full md:w-1/2" prepend-icon="mdi-undo" color="accent" @click="resetIndicators"
          :disabled="['recognizing text', 'initializing api', 'loading language traineddata', 'initializing tesseract', 'loading tesseract core'].includes(loggerObject.status)">
          Reset
        </v-btn>

        <v-btn v-if="generatedFile.file" prepend-icon="mdi-download" class="flex w-full md:w-1/2" color="primary-darken-1"
          variant="elevated" :href="generatedFile.url" download="EPI-USE INV OCR">
          Download
        </v-btn>

        <v-btn v-if="loggerObject.status !== 'Completed' && loggerObject.status !== 'Ready' && loggerObject.status !== 'Stopped'" prepend-icon="mdi-cancel"
          class="flex w-full md:w-1/2" color="error" variant="elevated" @click="stopAllProcessing = true">
          Stop
        </v-btn>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  background: whitemdoke;
}

.icon {
  @apply h-6 w-6;
}
</style>
