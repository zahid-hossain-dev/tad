import { ref, computed } from 'vue'


// Retrieve data from localStorage
const savedData = localStorage.getItem('internal_saved_data');
let user_visa_fee = ref('');

const userDetails = ref({ fullname: '', email: '', phone: '', reference_no: '', confirm_reference_no: '' });

const applicants = ref([])

function addApplicant() {
  const applicant = { full_name: '', travel_doc_no: '', nationality: 'Bangladesh', visa_type: 'Tourist Visa (single entry)', fee: 4000, convenience_fee: 1000, vat_amt: 150 }

  applicants.value.push(applicant)
}

function deleteApplicant(index) {
  applicants.value.splice(index, 1)
}

//retrieving local storaage
if (savedData) {
  try {
    const parsedData = JSON.parse(savedData);

    user_visa_fee.value = parsedData.user_visa_fee || '';
    userDetails.value = parsedData.userDetails || userDetails.value
    applicants.value = parsedData.applicants || applicants.value
  } catch (e) {
    console.error('Error parsing JSON from localStorage:', e);
  }
}
//saving data
function saveData() {
  userDetails.value.confirm_reference_no = userDetails.value.reference_no;

  const internalSavedData = {
    user_visa_fee: user_visa_fee.value,
    userDetails: userDetails.value,
    applicants: applicants.value
  }

  localStorage.setItem('internal_saved_data', JSON.stringify(internalSavedData));
}

export function useApplicantInfo() {
  return { userDetails, user_visa_fee, applicants, addApplicant, deleteApplicant, saveData, savedData }
}