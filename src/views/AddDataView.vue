<template>
  <div class="bg-yellow-100 px-32 min-h-screen">

    <h2 class="pt-4 text-3xl">Add Data</h2>
    <div class="border-b-2 border-black"></div>

    <section class="pt-2">
      <div>
        <input type="text" placeholder="Total amount" v-model="user_visa_fee" class="bg-yellow-50 p-2 my-4 rounded-lg border">
      </div>
    </section>

    <section class="space-y-2">
      <h2 class="font-bold text-blue-700 underline underline-offset-4 mb-2">User Details</h2>

      <div class="flex gap-3">
        <div>
          <input type="text" placeholder="User full name" v-model="userDetails.fullname"
            class="bg-yellow-50 p-2 rounded-lg border">
        </div>
        <div>
          <input type="text" placeholder="Email" v-model="userDetails.email" class="bg-yellow-50 p-2 rounded-lg border">
        </div>
      </div>

      <div class="flex gap-3">
        <div>
          <input type="text" placeholder="Phone" v-model="userDetails.phone" class="bg-yellow-50 p-2 rounded-lg border">
        </div>
        <div>
          <input type="text" placeholder="Reference" v-model="userDetails.reference_no"
            class="bg-yellow-50 p-2 rounded-lg border">
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-bold text-blue-700 underline underline-offset-4 mt-5">Applicant Details</h2>
      <div class="bg-blue-100 mt-2 rounded-md shadow-lg p-2">
        <table class="border-collapse table-auto min-w-full">
          <thead>
            <tr class="">
              <th class="p-2 border-b border-gray-400">Name</th>
              <th class="p-2 border-b border-gray-400">Passport</th>
              <th class="p-2 border-b border-gray-400">Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(applicant, index) in applicants">
              <td class="px-4 py-2 border-b"><input type="text" placeholder="Enter name" v-model="applicant.full_name"
                  class="p-2 border-b rounded-md w-full"></td>

              <td class="px-4 py-2 border-b"><input type="text" placeholder="Enter passport"
                  v-model="applicant.travel_doc_no" class="p-2 border-b rounded-md w-full"></td>

              <td class="px-4 py-2 border-b text-center">
                <button class="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-500"
                  @click="deleteApplicant(index)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-center items-center ">
          <button @click="addApplicant"
            class="bg-slate-600 hover:bg-slate-500 text-white px-12 py-2 rounded-lg mt-3">Add</button>
        </div>
      </div>
    </section>

    <div class="pt-10 pb-20 flex justify-center">
      <button @click="saveData" class="bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-2 rounded-lg mt-3">Save data</button>
    </div>
  </div>
</template>

<script setup>
import { useApplicantInfo } from '@/composables/useApplicantInfo';

let {user_visa_fee, userDetails, applicants, addApplicant, deleteApplicant, saveData} = useApplicantInfo();
</script>