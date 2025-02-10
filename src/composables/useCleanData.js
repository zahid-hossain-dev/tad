

function removeLocalStorageData(key){
  const obj  = JSON.parse(localStorage.getItem(key))
  if(obj){
    localStorage.removeItem(key)
  }
}

function cleanBankData(){
  removeLocalStorageData('all_obj')
}

function cleanSavedData(){
  removeLocalStorageData('internal_saved_data')
}

function cleanSessionData(){
  sessionStorage.clear()
}

export function useCleanData(){
  return {cleanSessionData, cleanBankData, cleanSavedData}
}