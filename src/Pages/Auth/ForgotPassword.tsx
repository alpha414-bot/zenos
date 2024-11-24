import Button from "@/Components/Button";
import Input from "@/Components/Input";
import MainLayout from "@/Layouts/MainLayout";
import { resetPasswordStepA } from "@/Services/Query";
import { EmailPattern } from "@/System/function";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface ForgotPasswordFormInput {
  email?: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<ForgotPasswordFormInput>({
    mode: "all",
  });
  const resetPassword = (data: ForgotPasswordFormInput) => {
    resetPasswordStepA(data.email as string).then(() => {
      navigate("/");
    });
  };
  return (
    <MainLayout title="Forgot Password">
      <div className="px-6 py-12 flex flex-col items-start gap-12 md:flex-row">
        {/* SignIn Section */}
        <form
          onSubmit={handleSubmit(resetPassword)}
          className="border-2 border-gray-200 rounded-lg px-6 py-5 w-full"
        >
          <p className="text-3xl font-extrabold tracking-wider">
            Forgot Password
          </p>
          <p className="text-xs mt-1">
            Reset your password to gain access to your account
          </p>
          <div className="pt-4 pb-3 space-y-7">
            <div>
              <Input
                control={control}
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
          </div>
          <div className="flex flex-col items-end">
            <Button>Reset Password</Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
