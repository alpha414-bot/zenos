import Button from "@/Components/Button";
import Input from "@/Components/Input";
import MainLayout from "@/Layouts/MainLayout";
import { createUser, loginUser } from "@/Services/Query";
import {
  EmailPattern,
  NumberPattern,
  PasswordPattern,
} from "@/System/function";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const { control: SignInControl, handleSubmit: SignInHandleSubmit } =
    useForm<UserSignInFormInput>({
      mode: "all",
    });
  const { control: SignUpControl, handleSubmit: SignUpHandleSubmit } =
    useForm<UserSignUpFormInput>({
      mode: "all",
    });
  const onSignUpFormSubmit: SubmitHandler<UserSignUpFormInput> = (data) => {
    createUser(data).then(() => navigate("/"));
  };
  const onSignInFormSubmit: SubmitHandler<UserSignInFormInput> = (data) => {
    loginUser(data).then(() => navigate("/"));
  };
  return (
    <MainLayout
      title="Login to your dashboard"
      description="Login to your account to view and track your order"
    >
      <div className="px-6 py-12 flex flex-col items-start gap-12 md:flex-row">
        {/* SignIn Section */}
        <form
          onSubmit={SignInHandleSubmit(onSignInFormSubmit)}
          className="border-2 border-gray-200 rounded-lg px-6 py-5 w-full md:w-1/2"
        >
          <p className="text-3xl font-extrabold tracking-wider">Sign In</p>
          <p className="text-xs">
            Login to your account to explore and track your orders in realtime
          </p>
          <div className="pt-4 pb-3 space-y-7">
            <div>
              <Input
                control={SignInControl}
                rules={{
                  required: "Email field is required",
                  pattern: {
                    value: EmailPattern,
                    message: "Ouch, that doesn't look like an email!",
                  },
                }}
                name="email"
                type="email"
                placeholder="Email address"
              />
            </div>
            <div>
              <Input
                control={SignInControl}
                rules={{ required: "Password field is required" }}
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>
          </div>
          <Link
            to="/forgot-password"
            className="text-base tracking-wide underline underline-offset-1 decoration-dotted"
          >
            Forgot password?
          </Link>
          <div className="flex flex-col items-end">
            <Button>Sign In</Button>
          </div>
        </form>
        {/* SignUp Section */}
        <form
          onSubmit={SignUpHandleSubmit(onSignUpFormSubmit)}
          className="border-2 border-gray-200 rounded-lg px-6 py-5 w-full md:w-1/2"
        >
          <p className="text-3xl font-extrabold tracking-wider">Sign Up</p>
          <p className="text-xs">
            Join us today and get to implement our app full feature
          </p>
          <div className="pt-4 pb-3 space-y-5">
            <div>
              <Input
                control={SignUpControl}
                rules={{
                  required: "First Name field is required",
                }}
                name="first_name"
                placeholder="First Name"
              />
            </div>
            <div>
              <Input
                control={SignUpControl}
                rules={{
                  required: "Last Name field is required",
                }}
                name="last_name"
                placeholder="Last Name"
              />
            </div>
            <div>
              <Input
                control={SignUpControl}
                name="username"
                placeholder="Username"
                rules={{
                  required: "Username field is required",
                }}
                // updateOnChange={(e: BaseSyntheticEvent) => {
                //   return { ...e, ...{ value: "ola" } };
                // }}
              />
            </div>
            <div>
              <Input
                control={SignUpControl}
                rules={{
                  required: "Phone field is required",
                  pattern: {
                    value: NumberPattern,
                    message: "Phone number can't contain letters",
                  },
                }}
                name="phone"
                placeholder="Phone"
              />
            </div>
            <div>
              <Input
                control={SignUpControl}
                rules={{
                  required: "Email field is required",
                  pattern: {
                    value: EmailPattern,
                    message: "Ouch, that doesn't look like an email!",
                  },
                }}
                name="email"
                type="email"
                placeholder="Email address"
              />
            </div>
            <div>
              <Input
                control={SignUpControl}
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
                name="password"
                type="password"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Button type="submit">Sign Up</Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default AuthPage;
