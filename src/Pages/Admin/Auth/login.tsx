import Button from "@/Components/Button";
import Input from "@/Components/Input";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { EmailPattern } from "@/System/function";
import { SubmitHandler, useForm } from "react-hook-form";

const AdminLogin = () => {
  const { control: SignInControl, handleSubmit: SignInHandleSubmit } =
    useForm<UserSignInFormInput>({
      mode: "all",
    });
  const onSignInFormSubmit: SubmitHandler<UserSignInFormInput> = (data) => {
    console.log("data is", data)
    // loginUser(data).then(() => navigate("/"));
  };
  return (
    <MainLayout>
      <PageMeta
        title="Administrator Login Page"
        description="Administrator Login Page"
      >
        <div className="flex items-start py-12 px-4 justify-center md:py-0 md:min-h-screen md:items-center">
          <form
            onSubmit={SignInHandleSubmit(onSignInFormSubmit)}
            className="border-2 border-gray-200 rounded-lg px-3 py-12 w-full md:w-1/2 md:px-8"
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
    </MainLayout>
  );
};

export default AdminLogin;
