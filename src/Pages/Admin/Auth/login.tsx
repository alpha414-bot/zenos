import Button from "@/Components/Button";
import Input from "@/Components/Input";
import PageMeta from "@/Layouts/PageMeta";
import { queryToLoginUser } from "@/Services/Queries/AuthQuery";
import { EmailPattern } from "@/System/function";
import { SubmitHandler, useForm } from "react-hook-form";

const AdminLogin = () => {
  const { control: SignInControl, handleSubmit: SignInHandleSubmit } =
    useForm<UserSignInFormInput>({
      mode: "all",
    });
  const onSignInFormSubmit: SubmitHandler<UserSignInFormInput> = (data) => {
    queryToLoginUser({ ...data, ...{ admin: true } });
  };
  return (
    <PageMeta
      title="Administrator Login Page"
      description="Administrator Login Page"
    >
      <div className="flex items-center py-12 px-4 justify-center md:py-0 min-h-screen">
        <form
          onSubmit={SignInHandleSubmit(onSignInFormSubmit)}
          className="border-2 border-gray-200 rounded-xl max-w-lg w-full px-3 py-12"
        >
          <p className="text-3xl font-extrabold tracking-wider text-center">
            Administrator Access Page
          </p>
          <p className="text-xs text-center">
            Login to your admin dashboard to start tracking web app activities
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
          <div className="flex flex-col items-end">
            <Button>Sign In</Button>
          </div>
        </form>
      </div>
    </PageMeta>
  );
};

export default AdminLogin;
