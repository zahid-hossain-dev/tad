
async function payNow(){
  await submitPaymentWithRetry('Here i am folks!')
}

async function submitPaymentWithRetry(payForm, iterate = 10){
  if (iterate <= 0) {
    console.log("Payment Submit: Max retries reached");
    return;
  }

  console.log(payForm);
  
  setTimeout(() => submitPaymentWithRetry(payForm, iterate - 1), 20);
}

payNow()