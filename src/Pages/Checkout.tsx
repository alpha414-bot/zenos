import Button from "@/Components/Button";
import Input from "@/Components/Input";
import SelectDropdown from "@/Components/SelectDropdown";
import TextArea from "@/Components/TextArea";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useCartProducts } from "@/Services/Hooks";
import { queryToRegisterUser } from "@/Services/Queries/AuthQuery";
import { newOrderQuery } from "@/Services/Queries/OrderQuery";
import {
  EmailPattern,
  generateRandomString,
  NigeriaState,
  NumberPattern,
  PasswordPattern,
  price,
} from "@/System/function";
import { auth } from "@/firebase-config";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const { data: carts } = useCartProducts() as { data: CartMetaItem[] };
  const reference = useMemo(
    () => generateRandomString(_.random(24, 32)),
    [carts]
  );
  const [isForm, setIsForm] = useState<number>(0);
  const navigate = useNavigate();
  const { control, handleSubmit, reset, watch } =
    useForm<BillingInputInterface>({
      mode: "all",
    });
  const FormValue = watch();
  const onSubmit: SubmitHandler<BillingInputInterface> = (data) => {
    if (isForm === 1) {
      // about creating an account...
      if (!auth.currentUser?.isAnonymous) {
        // user is not anonymous
        setIsForm((current) => current + 1);
      } else {
        // user is anonymous and needs to create a permanent account
        queryToRegisterUser(data, false).then(() => {
          setIsForm((current) => current + 1);
        });
      }
    } else if (isForm !== 2) {
      // form of where to ship to (not related to profile, as it might different in each orders)
      setIsForm((current) => current + 1);
    }
  };
  useEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [isForm]);

  const CheckoutRoute = [
    { title: "Shipping", icon: "store" },
    { title: "Account", icon: "account" },
    { title: "Payment and Billing", icon: "payment" },
  ];

  const TotalProductPrice = _.sumBy(carts, (item): any => {
    if (item.metadata) {
      let discountedPrice = item.metadata.price;
      if (item.discount?.value) {
        discountedPrice =
          item.metadata.price * (1 - (item.discount?.value || 1) / 100);
      }
      return discountedPrice * item.quantity;
    }
  });
  return (
    <MainLayout no_footer>
      <PageMeta
        title="Checkout"
        description="Start pushing your cart to the finishing line"
      >
        <div className="relative flex flex-col-reverse lg:block">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full px-4 md:w-[75%] md:px-8 py-12"
          >
            <div className="flex">
              <ol className="flex items-center w-full space-x-2 text-sm font-medium text-center shadow-sm text-white sm:text-base sm:space-x-4 rtl:space-x-reverse">
                {CheckoutRoute.map((item, index) => (
                  <button
                    type="submit"
                    key={index}
                    className={`flex items-center gap-x-1 ${
                      isForm == index ? "text-zenos-600" : ""
                    }`}
                  >
                    <div
                      className={`border p-1 rounded-full ${
                        isForm == index
                          ? "bg-zenos-600 border-zenos-600 text-white"
                          : "border-gray-200"
                      }`}
                    >
                      {item.icon == "store" && (
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 12c.263 0 .524-.06.767-.175a2 2 0 0 0 .65-.491c.186-.21.333-.46.433-.734.1-.274.15-.568.15-.864a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 12 9.736a2.4 2.4 0 0 0 .586 1.591c.375.422.884.659 1.414.659.53 0 1.04-.237 1.414-.659A2.4 2.4 0 0 0 16 9.736c0 .295.052.588.152.861s.248.521.434.73a2 2 0 0 0 .649.488 1.809 1.809 0 0 0 1.53 0 2.03 2.03 0 0 0 .65-.488c.185-.209.332-.457.433-.73.1-.273.152-.566.152-.861 0-.974-1.108-3.85-1.618-5.121A.983.983 0 0 0 17.466 4H6.456a.986.986 0 0 0-.93.645C5.045 5.962 4 8.905 4 9.736c.023.59.241 1.148.611 1.567.37.418.865.667 1.389.697Zm0 0c.328 0 .651-.091.94-.266A2.1 2.1 0 0 0 7.66 11h.681a2.1 2.1 0 0 0 .718.734c.29.175.613.266.942.266.328 0 .651-.091.94-.266.29-.174.537-.427.719-.734h.681a2.1 2.1 0 0 0 .719.734c.289.175.612.266.94.266.329 0 .652-.091.942-.266.29-.174.536-.427.718-.734h.681c.183.307.43.56.719.734.29.174.613.266.941.266a1.819 1.819 0 0 0 1.06-.351M6 12a1.766 1.766 0 0 1-1.163-.476M5 12v7a1 1 0 0 0 1 1h2v-5h3v5h7a1 1 0 0 0 1-1v-7m-5 3v2h2v-2h-2Z"
                          />
                        </svg>
                      )}
                      {item.icon == "payment" && (
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"
                          />
                        </svg>
                      )}
                      {item.icon == "account" && (
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="square"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h2m10 1a3 3 0 0 1-3 3m3-3a3 3 0 0 0-3-3m3 3h1m-4 3a3 3 0 0 1-3-3m3 3v1m-3-4a3 3 0 0 1 3-3m-3 3h-1m4-3v-1m-2.121 1.879-.707-.707m5.656 5.656-.707-.707m-4.242 0-.707.707m5.656-5.656-.707.707M12 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Personal{" "} */}
                      <span className="hidden sm:inline-flex">
                        {item.title}
                      </span>
                      {CheckoutRoute.length - 1 !== index && (
                        <svg
                          className="w-3 h-3 rtl:rotate-180"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 12 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m7 9 4-4-4-4M1 9l4-4-4-4"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </ol>
              {!!isForm && (
                <Button
                  type="button"
                  className="inline-flex gap-1 items-center px-2"
                  onClick={() => {
                    setIsForm((current) => current - 1);
                  }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14M5 12l4-4m-4 4 4 4"
                    />
                  </svg>
                  Back
                </Button>
              )}
            </div>
            <div className="mt-7">
              {isForm == 0 && (
                <div className="pb-32">
                  <h3 className="text-2xl font-bold leading-none text-white">
                    Ship To
                  </h3>
                  <p className="mt-1 text-xs font-medium italic">
                    All asterik (*) are required to be filled.
                  </p>

                  <div className="mt-6 w-full space-y-8">
                    {/* first name & last name */}
                    <div className="flex flex-col gap-6 md:gap-12 md:flex-row">
                      <Input
                        control={control}
                        name="first_name"
                        placeholder="First Name"
                        rules={{ required: "First name is required" }}
                        defaultValue={FormValue.first_name}
                      />
                      <Input
                        control={control}
                        name="last_name"
                        placeholder="Last Name"
                        rules={{ required: "Last name is required" }}
                        defaultValue={FormValue.last_name}
                      />
                    </div>
                    {/* street address */}
                    <div>
                      <TextArea
                        control={control}
                        name="street_address"
                        placeholder="Street Address"
                        rules={{ required: "Street address is required" }}
                        defaultValue={FormValue.street_address}
                      />
                    </div>
                    {/* postal code & town/city */}
                    <div className="flex flex-col gap-6 md:gap-12 md:flex-row">
                      <Input
                        control={control}
                        name="postal_code"
                        placeholder="Postal Code"
                        rules={{ required: "Postal code is required" }}
                        defaultValue={FormValue.postal_code}
                      />
                      <Input
                        control={control}
                        name="town"
                        placeholder="Town/City"
                        rules={{ required: "Town/City is required" }}
                        defaultValue={FormValue.town}
                      />
                    </div>
                    {/* state/province */}
                    <div>
                      <SelectDropdown
                        control={control}
                        placeholder="State/Province"
                        name="state"
                        defaultValue={FormValue.state}
                        options={NigeriaState}
                        containerClassName="z-20"
                        rules={{
                          required:
                            "State is required. <em>Enter the name of state/province and choose from options</em>",
                        }}
                      />
                    </div>
                    {/* phone number */}
                    <div>
                      <Input
                        type="tel"
                        control={control}
                        name="phone_number"
                        placeholder="Phone number"
                        rules={{
                          required: "Phone number is required",
                          pattern: {
                            value: NumberPattern,
                            message: "Phone number can't contain letters",
                          },
                        }}
                        defaultValue={FormValue.phone_number}
                      />
                    </div>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <Button type="submit">Next Step: Account</Button>
                  </div>
                </div>
              )}
              {isForm == 1 && (
                <div>
                  {(auth.currentUser?.uid && !auth.currentUser.isAnonymous && (
                    <div className="border border-gray-200 p-4 rounded-md">
                      <p
                        className="text-base font-medium"
                        dangerouslySetInnerHTML={{
                          __html: auth.currentUser.displayName
                            ? `Hello, <strong>${_.startCase(
                                auth.currentUser.displayName
                              )}</strong>`
                            : "",
                        }}
                      />
                      <p className="text-base font-normal">
                        You are currently signed in, you can proceed to the next
                        step{" "}
                        <span className="underline underline-offset-4 decoration-dotted">
                          (Payment & Billing)
                        </span>{" "}
                        to continue your purchase.
                      </p>
                    </div>
                  )) || (
                    <>
                      <h3 className="text-2xl font-bold leading-none text-white">
                        Create an account
                      </h3>
                      <p className="mt-1 text-xs font-medium italic">
                        Create an account with us now to easily place order
                        again and to login at any time.
                      </p>
                      <div className="mt-6 space-y-8">
                        <div>
                          <Input
                            control={control}
                            rules={{
                              required: "Username field is required",
                            }}
                            name="username"
                            defaultValue={FormValue.username}
                            placeholder="Username"
                          />
                        </div>
                        <div>
                          <Input
                            control={control}
                            rules={{
                              required: "Email field is required",
                              pattern: {
                                value: EmailPattern,
                                message:
                                  "Ouch, that doesn't look like an email!",
                              },
                            }}
                            name="email"
                            type="email"
                            defaultValue={FormValue.email}
                            placeholder="Email address"
                          />
                        </div>
                        <div className="flex flex-col gap-6 md:gap-12 md:flex-row">
                          <Input
                            type="password"
                            control={control}
                            name="password"
                            placeholder="Password"
                            defaultValue={FormValue.password}
                            rules={{
                              required: "Password field is required",
                              minLength: {
                                value: 8,
                                message:
                                  "Password must contain the following: <br/> <em> - a <strong>lowercase</strong> letter <br/> - an <strong>uppercase</strong> letter <br/> - a <strong>number</strong> <br/> - Minimum of 8 characters </em> ",
                              },
                              pattern: {
                                value: PasswordPattern,
                                message:
                                  "Password must contain the following: <br/> <em> - a <strong>lowercase</strong> letter <br/> - an <strong>uppercase</strong> letter <br/> - a <strong>number</strong> <br/> - Minimum of 8 characters </em> ",
                              },
                            }}
                          />

                          <Input
                            type="password"
                            control={control}
                            name="confirm_password"
                            placeholder="Confirm Password"
                            defaultValue={FormValue.confirm_password}
                            rules={{
                              required: "Password field is required",
                              validate: (value) =>
                                value === FormValue.password
                                  ? true
                                  : "Password is mismatch. Enter the right password",
                              pattern: {
                                value: PasswordPattern,
                                message:
                                  "Password must contain the following: <br/> <em> - a <strong>lowercase</strong> letter <br/> - an <strong>uppercase</strong> letter <br/> - a <strong>number</strong> <br/> - Minimum of 8 characters </em> ",
                              },
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="mt-5 flex justify-end">
                    <button
                      type="submit"
                      className="undefined inline-flex items-center px-4 py-0.5 text-base font-medium text-center rounded-lg bg-zenos-700 hover:bg-zenos-800 border-4 border-transparent hover:border-gray-800 hover:ring-2 hover:outline-none hover:ring-zenos-600"
                    >
                      Next Step: Payment and Billing
                    </button>
                  </div>
                </div>
              )}
              {/* Payment & Billing */}
              {isForm == 2 && (
                <div className="pb-32">
                  <h3 className="text-2xl font-bold leading-none text-white">
                    Payment & Billing
                  </h3>
                  <p className="mt-1 text-xs font-medium italic">
                    To complete and make payment reach out to our customer
                    support to receive logistic support and track your order.
                  </p>
                  <div className="mt-5">
                    <p className="text-base font-medium">Billing Address:</p>
                    <div className="mt-2 border border-gray-2 py-3 px-5 rounded-lg space-y-4">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-sm tracking-tight">
                            {FormValue.first_name} {FormValue.last_name}
                            <br />
                            {FormValue.street_address}
                            <br />
                            {FormValue?.state?.value}, {FormValue.postal_code}
                            <br />
                            Nigeria
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z" />
                        </svg>
                        <p className="text-sm tracking-tight">
                          {FormValue.phone_number}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap items-stretch gap-4">
                    <Button
                      className="gap-2"
                      onClick={() => {
                        newOrderQuery(
                          {
                            reference,
                            amount: TotalProductPrice,
                            status: "pending",
                          },
                          carts,
                          FormValue
                        ).then(() => {
                          reset();
                          navigate("/user/inbox");
                        });
                      }}
                    >
                      Chat with{" "}
                      <svg
                        className="w-6 h-6 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2a7 7 0 0 0-7 7 3 3 0 0 0-3 3v2a3 3 0 0 0 3 3h1a1 1 0 0 0 1-1V9a5 5 0 1 1 10 0v7.083A2.919 2.919 0 0 1 14.083 19H14a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 1.732-1h.351a4.917 4.917 0 0 0 4.83-4H19a3 3 0 0 0 3-3v-2a3 3 0 0 0-3-3 7 7 0 0 0-7-7Zm1.45 3.275a4 4 0 0 0-4.352.976 1 1 0 0 0 1.452 1.376 2.001 2.001 0 0 1 2.836-.067 1 1 0 1 0 1.386-1.442 4 4 0 0 0-1.321-.843Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </form>
          {/* Order summary */}
          <div className="w-full top-[12%] right-0 h-auto bg-gray-600 px-2 pt-5 pb-5 md:fixed lg:px-5 md:pt-20 md:w-[25%] md:min-h-screen md:h-full">
            <div className="bg-gray-800 px-4 py-3">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <Link
                  to="/user/carts"
                  className="text-sm text-zenos-600 underline underline-offset-4 decoration-zenos-600 decoration-dotted"
                >
                  Edit cart
                </Link>
              </div>
              <div className="space-y-1 mt-4 mb-5">
                {carts.map((item, index) => {
                  const product = item.metadata;
                  return (
                    <div
                      key={index}
                      className="flex items-start justify-between"
                    >
                      <p className="text-sm font-medium">{product?.name}:</p>
                      <div>
                        {price(
                          (product?.price || 1) * (product?.cartQuantity || 1),
                          "currency",
                          0
                        )}
                        {item.discount && (
                          <span
                            className="ml-1 text-xs"
                            dangerouslySetInnerHTML={{
                              __html: `-${item.discount.value}%`,
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <hr />
              <div className="mt-5 flex items-center justify-between">
                <p className="text-base font-medium">Order Total:</p>
                <p className="text-lg font-extrabold">
                  {price(TotalProductPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageMeta>
    </MainLayout>
  );
};
export default Checkout;
