type FirestoreDate = { seconds: string; nanoseconds: string };
type MiddlewareItems = "auth" | "guest" | "checkout" | "admin" | "admin_guest";
type QueryUseType = {
  data: any;
  isError: boolean;
  isLoading: boolean;
};
type CartMetaItem = {
  productID: string;
  quantity: number;
  discount?: { name: string; value: number };
  createdAt?: FirestoreDate;
  updatedAt?: FirestoreDate;
  metadata?: ProductItemType;
};
type CartProductItem = {
  products: CartMetaItem[];
};
type DropdownOptionsType = {
  key: string;
  value: string;
  description?: string;
};

type ListingProductType =
  | "carts_listing"
  | "order_listing"
  | "product_listing"
  | "similar_listing";

interface RouteErrorInterface {
  status: string | number;
  statusText: string;
  internal: boolean;
  data: string;
  error?: Object;
}

interface ProtectedRouteProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children?: ReactNode | undefined;
  middlewares?: MiddlewareItems[];
}

interface ProductListInterface {
  products: ProductItemType[];
  type?: ListingProductType;
}

interface VantaEffectOptions {
  el?: HTMLDivElement;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  scale?: number;
  scaleMobile?: number;
  color?: number;
  color1?: number;
  color2?: number;
  backgroundColor?: number;
  amplitudeFactor?: number;
  xOffset?: number;
  yOffset?: number;
  size?: number;
  baseColor?: number;
}

interface ProductItemType {
  id?: string;
  status?: string;
  name: string;
  description: string;
  category: { key: "oraimo" | "new-age" | "uk-used"; value: string };
  subcategory?: { key: string; value: string };
  price: number;
  salesPrice?: number;
  variants?: ProductVariantType[];
  createdBy?: string;
  image?: string | any[];
  createdAt?: FirestoreDate | Date;
  updatedAt?: FirestoreDate | Date;
  weight?: number;
  star?: number;
  cartQuantity?: number;
  discount?: { name: "#chameleon" | "#hackathonchameleon"; value: number };
}

interface PaymentOnSuccessProps {
  reference: string;
  amount: any;
  status: string;
  // message: string;
  // redirecturl: string;
  // trans: string;
  // transaction: string;
  // trxref: string;
}

interface ProductVariantType {
  color?: string;
  size?: string;
  material?: string;
}

interface UserDataLoaderInterface {
  orders?: any;
  carts?: any;
  profile?: any;
}

interface UserSignUpFormInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  username?: string;
  password?: string;
}

interface UserSignInFormInput {
  email?: string;
  password?: string;
  admin?: boolean;
}

interface BillingInputInterface {
  first_name?: string;
  last_name?: string;
  street_address?: string;
  postal_code?: string;
  town?: string;
  phone_number?: string;
  state?: DropdownOptionsType;
  username?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

interface OrderDataInterface {
  id?: string;
  instance: PaymentOnSuccessProps;
  products: CartMetaItem[];
  billing_info: BillingInputInterface;
  user_uid: string;
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
}

interface ProfileDataInterface {
  uid?: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  address: string;
  phone_number: string;
}
