import axios from "axios";
import { ref } from "vue";

// const baseUrl = 'http://localhost:8080';
const baseUrl = 'https://api.thaivisa-cbcssl.com/api';

const errorMessage = ref('')

const apiClient = async (requestUrl, data = new FormData()) => {
  const config = {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    },
    data: data instanceof FormData ? data : JSON.stringify(data),
  };

  try {
    const response = await axios(`${baseUrl}/${requestUrl}`, config);
    return response.data;
  }
  catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

const apiClient2 = async (requestUrl, data) => {
  const config = {
    method: "POST",
    headers: { Accept: "application/json" },
    ...data ? { body: data } : {}
  };
  try {
    // return await (await fetch(`${baseUrl}/${requestUrl}`, config)).json()
    const response = await fetch(`${baseUrl}/${requestUrl}`, config);
    
    if (response.status >299) {
      errorMessage.value = ' '+response.status; 
      return null
    }
    
    return await response.json();
  }
  catch (err) {
    console.error("API call error:", err)
    errorMessage.value = err
    return null
  }
};

const apiClient3 = async (requestUrl, data) => {
  const config = {
    method: "POST",
    headers: { Accept: "application/json" },
    ...(data ? { body: data } : {}),
  };

  try {
    const response = await fetch(`${baseUrl}/${requestUrl}`, config);
    
    if (response.status >299) {
      errorMessage.value = await response.json(); 
      return null
    }

    return await response.json();
  } catch (err) {
    console.error("API call error:", err);
    errorMessage.value = err; // Ensure errorMessage is defined
    return null
  }
};

const apiClient4 = async (requestUrl, data) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data", // This will be automatically set by axios with FormData, but it's okay to include it for clarity
    },
  };

  try {
    const response = await axios.post(`${baseUrl}/${requestUrl}`, data, config);

    return response.data; // Axios automatically parses the response JSON
  } catch (err) {
    console.error("API call error:", err);
    errorMessage.value = err;
    return null
  }
};

function setSessionData(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value))
}

function getSessionData(key) {
  const val = sessionStorage.getItem(key)
  return val ? JSON.parse(val) : null
}
export function useApiRequest() {
  return { apiClient, apiClient2, apiClient4, errorMessage, setSessionData, getSessionData }
}