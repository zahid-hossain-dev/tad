<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
  <header>
    <nav class="flex justify-center py-3 bg-[#581845] text-white">
      <ul class="flex gap-4">
        <li class="border-r-2 pr-4">
          <RouterLink to="/" class="px-4 py-2 rounded-lg hover:bg-[#900C3F]">Home</RouterLink>
        </li>
        <li class="border-r-2 pr-4">
          <RouterLink to="add-data" class="px-4 py-2 rounded-lg hover:bg-[#900C3F]">Add Data</RouterLink>
        </li>
        <li class="">
          <RouterLink to="clean-data" class="px-4 py-2 rounded-lg hover:bg-[#900C3F]">Clean Data</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>