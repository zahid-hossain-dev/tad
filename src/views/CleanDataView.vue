<template>
  <div class="min-h-screen bg-slate-800 px-20">
    <div>
      <h2 class="text-cyan-300 text-3xl pt-5 underline underline-offset-4">Clean Session Data</h2>
      <div>
        <button class="bg-slate-300 px-8 py-2 mt-8 rounded-md hover:bg-slate-400" @click="cleanSessionData">Clean Session Data</button>
      </div>
    </div>

    <div>
      <h2 class="text-cyan-300 text-3xl pt-5 underline underline-offset-4">Clean Bank Data</h2>
      <div>
        <button class="bg-slate-300 px-8 py-2 mt-8 rounded-md hover:bg-slate-400">Clean Bank Data</button>
      </div>
    </div>

    <div>
      <h2 class="text-cyan-300 text-3xl pt-5 underline underline-offset-4">Clean Saved Data</h2>
      <div>
        <button class="bg-slate-300 px-8 py-2 mt-8 rounded-md hover:bg-slate-400">Clean Saved Data</button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useCleanData } from '@/composables/useCleanData';


const {cleanSessionData, cleanBankData, cleanSavedData} = useCleanData()
</script>