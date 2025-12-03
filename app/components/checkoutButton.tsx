import { createPayment } from "@/lib/server-actions";

export default function CheckoutButton() {
  return (
    <div>
      <button formAction={createPayment}>Pay now</button>

    </div>
  );
}
