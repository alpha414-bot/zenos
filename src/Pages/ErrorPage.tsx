// ErrorPage: Page responsible for handling any thrown error in the web app;
import MainLayout from "@/Layouts/MainLayout";
import { getErrorMessageViaStatus } from "@/System/function";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError() as RouteErrorInterface;
  const { shortMessage: statusText, longMessage: message } =
    getErrorMessageViaStatus(error);
  return (
    <MainLayout title={statusText} description={message}>
      <div className="p-12">
        <div className="space-y-9">
          <h1 className="text-6xl font-extrabold">Whoops!</h1>
          <div className="row">
            <div className="col-md-12 manuals">
              <h2 className="font-bold text-lg">{statusText}</h2>
              <p className="text-sm">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ErrorPage;
