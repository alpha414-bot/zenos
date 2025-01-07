import { auth } from "@/firebase-config";
import { PaystackButton } from "react-paystack";

// Define interfaces
interface BillingInputInterface {
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface PaymentOnSuccessProps {
  amount: number;
  [key: string]: any;
}

interface PayDeskInterface {
  amount: number;
  metadata?: any;
  FormData?: BillingInputInterface;
  onSuccess: (reference: PaymentOnSuccessProps) => void;
}

// Use environment variable for Paystack public key
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

const PayDesk: React.FC<PayDeskInterface> = ({
  onSuccess,
  amount,
  FormData,
  metadata,
}) => {
  const onDone = (reference: PaymentOnSuccessProps) => {
    // Implementation for whatever you want to do with reference and after success call.
    onSuccess(reference);
  };

  const onClose = () => {
    // implementation for whatever you want to do when the Paystack dialog closed.
    console.log("Payment cancelled");
  };

  return (
    <>
      <PaystackButton
        publicKey={PAYSTACK_PUBLIC_KEY}
        firstname={FormData?.first_name}
        lastname={FormData?.last_name}
        email={
          FormData?.email || auth.currentUser?.email || "noclient@gmail.com"
        }
        amount={Number(amount.toFixed(0)) * 100}
        onSuccess={(data) =>
          onDone({
            ...data,
            ...{ amount: Number(amount.toFixed(0)) },
          })
        }
        onClose={onClose}
        metadata={{
          custom_fields: [
            {
              display_name: JSON.stringify(metadata),
              variable_name: new Date().toDateString(),
              value: "Purchasing Goods",
            },
          ],
        }}
        className="flex gap-2 items-center px-4 py-3 text-base font-medium text-center rounded-lg bg-zenos-700 hover:bg-zenos-800 hover:border-gray-800 hover:ring-2 hover:outline-none hover:ring-zenos-600"
      >
        <p>Pay with</p>
        <img 
          src="/assets/images/paystack.svg" 
          className="w-16 md:w-24"
          alt="Paystack Logo"
        />
      </PaystackButton>
    </>
  );
};

export default PayDesk;