// ErrorPage: Page responsible for handling any thrown error in the web app;
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { getErrorMessageViaStatus } from "@/System/function";
import { FC } from "react";
import { useRouteError } from "react-router-dom";

interface ErrorPageInterface {}

const ErrorPage: FC<ErrorPageInterface> = () => {
  const error = useRouteError() as RouteErrorInterface;
  const { shortMessage: statusText, longMessage: message } =
    getErrorMessageViaStatus(error);
  return (
    <MainLayout no_footer>
      <PageMeta title={statusText} description={message}>
        <div className="p-12 min-h-[50vh] flex items-center">
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
      </PageMeta>
    </MainLayout>
  );
};

export default ErrorPage;
