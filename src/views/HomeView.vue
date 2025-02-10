<template>
  <main class=" px-32 min-h-screen bg-slate-800 text-cyan-200">
    <h2 class="pt-4 text-3xl">Pay now</h2>
    <div class="border-b-2 border-cyan-300"></div>

    <div>
      <section class="pt-10">
        <div class="py-3">
          <input type="file" @change="handleFileUpload">
        </div>

        <div>
          Total amount: {{ user_visa_fee }}
        </div>
      </section>

      <section class="space-y-2">
        <h2 class="font-bold text-blue-700 underline underline-offset-4 mb-2">User Details</h2>

        <div class="flex gap-3">
          <div>
            User full name: {{ userDetails.fullname }}
          </div>
          <div>
            User email: {{ userDetails.email }}
          </div>
        </div>

        <div class="flex gap-3">
          <div>
            User phone: {{ userDetails.phone }}
          </div>
          <div>
            Reference no.: {{ userDetails.reference_no }}
          </div>
        </div>
      </section>

      <section class="text-black">
        <h2 class="font-bold text-blue-700 underline underline-offset-4 mt-5">Applicant Details</h2>
        <div class="bg-blue-100 mt-2 rounded-md shadow-lg p-2">
          <table class="border-collapse table-auto min-w-full">
            <thead>
              <tr class="">
                <th class="p-2 border-b border-gray-400">Name</th>
                <th class="p-2 border-b border-gray-400">Passport</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(applicant, index) in applicants">
                <td class="px-4 py-2 border-b">
                  {{ applicant.full_name }}
                </td>
                <td class="px-4 py-2 border-b">
                  {{ applicant.travel_doc_no }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="pt-10 pb-6 flex justify-center">
        <button @click="payNow" class="bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-2 rounded-lg mt-3">Pay
          Now</button>
      </div>

      <div class="pt-3 pb-20 flex justify-center">
        <button @click="paymentSubmit"
          class="bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-2 rounded-lg mt-3">Continue Stage 2</button>
      </div>

      <section class="mb-16 p-4 border-2 border-white">
        <div>Current method: {{ currentMethod }}</div>
        <div>Attempts: {{ count }}, Error: {{ responseError }}</div>
        <div>Message : {{ msg ? 'passed' : 'null' }}</div>
        <div class="my-2 bg-yellow-50 text-black">
          <div>Stage 1: Invoice upload: <span class="text-blue-600 font-bold text-2xl"
              v-if="isInvoiceUploaded">Yes</span></div>
          <div>Stage 2: In the applicants: <span class="text-blue-600 font-bold text-2xl"
              v-if="isInsideApplicants">Yes</span></div>
          <div>Stage 2.1: Is applicants passed: <span class="text-blue-600 font-bold text-2xl"
              v-if="isApplicantPassed">Yes</span></div>
        </div>

        <div>Response invoice: {{ transDetails }}</div>
        <div>Visa type: {{ getVisaType }}</div>
        <div>Total amount: {{ totalAmountGross }}</div>
        <div>Confirm ref: {{ userDetails.confirm_reference_no }}</div>

        <div>Payment url: <span>{{ getPaymentUrl }}</span></div>
        <div v-if="getPaymentUrl">Payment url: <a :href="getPaymentUrl" target="_blank"
            class="text-blue-600 underline">Click here</a></div>
      </section>
    </div>
    <div class="pt-3 pb-20 flex justify-center">
      <button @click="saveToSession" class="bg-cyan-600 hover:bg-cyan-500 text-white px-12 py-2 rounded-lg mt-3">Save to
        Session</button>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useApplicantInfo } from '@/composables/useApplicantInfo';
import { useApiRequest } from '@/composables/useApiRequest';

let { user_visa_fee, userDetails, applicants } = useApplicantInfo();
let { apiClient2, apiClient4, errorMessage, setSessionData, getSessionData } = useApiRequest();

const getPaymentUrl = ref('')
const currentMethod = ref('')
const msg = ref(null)
const totalAmountGross = ref(0)

const invoiceFile = ref(null);
const isInvoiceUploaded = ref(false)
const isInsideApplicants = ref(false)
const isApplicantPassed = ref(false)

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (file) {
    invoiceFile.value = file
  }
}

const getVisaType = ref(null)

const responseError = ref('')

const count = ref(0);
const transDetails = ref(null)

const totalFees = computed(() => applicants.value.reduce((acc, applicant) => acc + applicant.fee, 0));
const totalConvenienceFees = computed(() => applicants.value.reduce((acc, applicant) => acc + applicant.convenience_fee, 0));
const totalVat = computed(() => applicants.value.reduce((acc, applicant) => acc + applicant.vat_amt, 0));
const totalAmount = computed(() => totalFees.value + totalConvenienceFees.value + totalVat.value);

console.log(totalAmount.value);

//pay now
//--------------------------------
async function payNow() {
  count.value = 0;
  userDetails.value.confirm_reference_no = userDetails.value.reference_no;

  //attempt to submit invoice
  await invoiceSubmit()

  let transId = await getSessionData("transaction_ref_id")

  if (transId !== null) {
    isInvoiceUploaded.value = true
  } else {
    console.error("Transaction details are missing!");
    return;
  }

  count.value = 0;
  //attempt submit payment
  await paymentSubmit()
}


//invoice submit
//-------------------------------------------
async function invoiceSubmit(iterate = 500) {
  if (iterate <= 0) {
    responseError.value = 'Invoice Submit: Max retries reached'
    return;
  }

  currentMethod.value = 'Invoice Submit'
  count.value++;

  const invoiceForm = new FormData();
  invoiceForm.append('invoice', invoiceFile.value);
  invoiceForm.append('visa_fee', user_visa_fee.value)

  const response = await apiClient4('upload-invoice', invoiceForm);
  msg.value = response

  if (response !== null) {
    transDetails.value = response
    localStorage.setItem('all_obj', JSON.stringify(response))

    //----------saving to session storage---------    
    setSessionData('applicants', applicants.value)
    setSessionData('countries', response.meta.countries)
    setSessionData('invoiceQRCode', userDetails.value.reference_no)
    setSessionData('secret_key', response.data.secret_key)

    setSessionData('transaction_ref_id', response.data.transaction_ref_id)
    setSessionData('user_visa_fee', user_visa_fee.value)
    setSessionData('userFormData', userDetails.value)
    setSessionData('visa_type', response.meta.visa_type)
    //--------------------------------------------
  }
  else {
    responseError.value = 'Error submit invoice: ' + errorMessage.value
    setTimeout(() => invoiceSubmit(iterate - 1), 20);
  }
}

// payment submit
//-------------------------------------------
async function paymentSubmit() {

  currentMethod.value = 'Payment Submit'
  isInsideApplicants.value = true;

  const userFormData = await getSessionData('userFormData')
  const allApplicants = await getSessionData('applicants')

  const payForm = new FormData();
  payForm.append("transaction_ref_id", await getSessionData("transaction_ref_id")),
    payForm.append("secret_key", await getSessionData("secret_key")),
    payForm.append("fullname", userFormData.fullname),
    payForm.append("email", userFormData.email),
    payForm.append("phone", userFormData.phone),
    payForm.append("reference_no", userFormData.reference_no),
    payForm.append("confirm_reference_no", userFormData.reference_no),

    allApplicants.forEach((applicant, index) => {
      payForm.append(`applicants[${index}][full_name]`, applicant.full_name);
      payForm.append(`applicants[${index}][travel_doc_no]`, applicant.travel_doc_no);
      payForm.append(`applicants[${index}][nationality]`, applicant.nationality);
      payForm.append(`applicants[${index}][visa_type]`, applicant.visa_type);
      payForm.append(`applicants[${index}][fee]`, applicant.fee);
      payForm.append(`applicants[${index}][vat]`, applicant.vat_amt);
      payForm.append(`applicants[${index}][convenience_fee]`, applicant.convenience_fee);
      payForm.append(`applicants[${index}][total_fee]`, (parseFloat(applicant.fee) + parseFloat(applicant.vat_amt) + parseFloat(applicant.convenience_fee)))
    });

  payForm.append("total_fee", totalFees.value.toFixed(2));
  payForm.append("total_convenience_fee", totalConvenienceFees.value.toFixed(2));
  payForm.append("total_vat", totalVat.value.toFixed(2));
  payForm.append("total_amount", totalAmount.value.toFixed(2));

  // payForm.append(`applicants[${index}][total_fee]`, (parseFloat(applicant.fee) + parseFloat(applicant.vat_amt) + parseFloat(applicant.convenience_fee)).toFixed(2));

  isApplicantPassed.value = true
  
  await submitPaymentWithRetry(payForm);

  // const response = await apiClient2('store-payer-payment', payForm);
  // msg.value = response

  // if (response !== null) {
  //   localStorage.setItem('payment_url', JSON.stringify(response))

  //   getPaymentUrl.value = response.data;
  //   window.location.href = response.data.payment_url;
  // } else {
  //   responseError.value = 'Error submit payment' + errorMessage.value
  //   setTimeout(() => paymentSubmit(iterate - 1), 10);
  // }
}

function saveToSession() {
  const allObj = JSON.parse(localStorage.getItem('all_obj'))

  setSessionData('applicants', applicants.value)
  setSessionData('countries', allObj.meta.countries)
  setSessionData('invoiceQRCode', userDetails.value.reference_no)
  setSessionData('secret_key', allObj.data.secret_key)

  setSessionData('transaction_ref_id', allObj.data.transaction_ref_id)
  setSessionData('user_visa_fee', user_visa_fee.value)
  setSessionData('userFormData', userDetails.value)
  setSessionData('visa_type', allObj.meta.visa_type)
}

async function submitPaymentWithRetry(payForm, iterate = 700){
  if (iterate <= 0) {
    responseError.value = "Payment Submit: Max retries reached";
    return;
  }

  count.value++;
  const response = await apiClient2('store-payer-payment', payForm);
  msg.value = response

  if (response !== null) {
    localStorage.setItem('payment_url', JSON.stringify(response))

    getPaymentUrl.value = await response.data;
    window.location.href = await response.data.payment_url;
  } else {
    responseError.value = 'Error submit payment' + errorMessage.value
    setTimeout(() => submitPaymentWithRetry(payForm, iterate - 1), 5);
  }
}
</script>