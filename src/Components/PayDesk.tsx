import { auth } from "@/firebase-config";
import { PaystackButton } from "react-paystack";
import * as ENV from "../../package.json";

interface PayDeskInterface {
  amount: any;
  metadata?: any;
  FormData?: BillingInputInterface;
  onSuccess?: any;
}

const PayDesk: React.FC<PayDeskInterface> = ({
  onSuccess,
  amount,
  FormData,
  metadata,
}) => {
  // you can call this function anything
  const onDone = (reference: PaymentOnSuccessProps) => {
    // Implementation for whatever you want to do with reference and after success call.
    onSuccess(reference);
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    
  };

  return (
    <>
      <PaystackButton
        publicKey={ENV.PayPublicKey}
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
            // To pass extra metadata, add an object with the same fields as above
          ],
        }}
        className="flex gap-2 items-center px-4 py-3 text-base font-medium text-center rounded-lg bg-zenos-700 hover:bg-zenos-800 hover:border-gray-800 hover:ring-2 hover:outline-none hover:ring-zenos-600"
      >
        <p>Pay with</p>
        <img src="paystack.svg" className="w-16 md:w-24" />
      </PaystackButton>
    </>
  );
};

export default PayDesk;
