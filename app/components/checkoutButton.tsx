// import { useMollie } from "@/lib/MollieContext";
import { createPayment } from "@/lib/server-actions";

export default function CheckoutButton() {
  // const { mollie } = useMollie();
  
  // const payWithToken = async () => {
  //   // get the form data
    
  //   const formElement = document.querySelector(
  //     "form#form_payment"
  //   ) as HTMLFormElement;
    
  //   if (!formElement) {
  //     console.error("Form element not found");
  //     return;
  //   }
  //   // create a new FormData object
  //   const formData = new FormData(formElement);
  //   // get the card token from mollie
  //   if (!mollie) {
  //     console.error("Mollie is not initialized");
  //     return;
  //   }
  //   // const { token, error } = await mollie.createToken();
    
  //   // if (error) {
  //   //   console.error("Error creating card token:", error);
  //   //   return;
  //   // }
  //   console.log("HEY HO");
  //   // Debug: afficher le contenu du FormData
  
  //   // // append the card token to the form data
  //   formData.append("cardToken", token);

  //   console.log("Token ajouté:", token);

  //   // // submit the form to the createPayment function
  //   console.log(formData);
    
  //   // createPayment(formData);
  // };

  return (
    <div>
      <button formAction={createPayment}>Pay now</button>
      {/* <button onClick={payWithToken}>Pay now</button> */}
    </div>
  );
}
