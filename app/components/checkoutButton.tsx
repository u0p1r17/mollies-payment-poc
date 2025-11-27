import { useMollie } from "@/lib/MollieContext";
import { createPayment } from "@/lib/server-actions";

export default function CheckoutButton() {
  const { mollie } = useMollie();
  const payWithToken = async () => {
    // get the form data
    const formElement = document.querySelector("form");
    if (!formElement) {
      console.error("Form element not found");
      return;
    }
    // create a new FormData object
    const formData = new FormData(formElement);
    // get the card token from mollie
    if (!mollie) {
      console.error("Mollie is not initialized");
      return;
    }
    const { token, error } = await mollie.createToken();
    console.log(token);
    
    // if (error) {
    //   console.error("Error creating card token:", error);
    //   return;
    // }
    // // append the card token to the form data
    // formData.append("cardToken", token);
    // // submit the form to the createPayment function
    // createPayment(formData);
  };

  return (
    <div>
      <button formAction={payWithToken}>Pay now</button>
    </div>
  );
}
