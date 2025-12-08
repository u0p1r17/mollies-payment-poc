import { createPayment } from "@/lib/server-actions";
import { Metadata } from "@/lib/types";
import { validateFormData } from "@/lib/validation";

export default function CheckoutButton() {
  const handleClick = async (formData: FormData) => {
    
    // fetch("/api/mollie/payments/create", {
    //   method: "POST",
    //   // headers: {
    //   //   "Content-Type": "application/x-www-form-urlencoded",
    //   // },
    //   // body: JSON.stringify(Object.fromEntries(formData)),
    //   body: validatedForm,
    // });
  };
  return (
    <div>
      {/* <button formAction={createPayment}>Pay now</button> */}
      {/* <button formAction={handleClick}>Pay now</button> */}
      <button>Pay now</button>
    </div>
  );
}
