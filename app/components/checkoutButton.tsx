import { useEffect, useState } from "react";

export default function CheckoutButton({ isLoading }: { isLoading: boolean }) {
  const [togled, setToggled] = useState(isLoading);
  useEffect(()=>{
    setToggled(isLoading);
  }, [isLoading])


  return (
    <button
      type="submit"
      className={`w-full text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ${
        togled
          ? "bg-gray-400 cursor-not-allowed opacity-60"
          : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      }`}
      disabled={togled}
    >
      Procéder au paiement
    </button>
  );
}