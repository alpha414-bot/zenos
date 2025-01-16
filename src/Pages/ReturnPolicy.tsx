
import MainLayout from "@/Layouts/MainLayout";

const ReturnPolicyPage = () => {
  return (
    <MainLayout>
      <div className="bg-gray-900 text-white min-h-screen py-10">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-orange-500 mb-10">Zenos Return Policy</h1>
          <div className="mb-8">
            <p className="text-lg mb-4">
              At Zenos, we prioritize customer satisfaction and are committed to providing a seamless shopping experience. Please note that <span className="font-bold">all sales are final</span>, and goods purchased on our platform are generally not eligible for return.
            </p>
            <p className="text-lg mb-4">
              However, we understand that unique circumstances may arise. In such cases, we encourage you to contact our <span className="font-bold">Customer Support Team</span> to discuss potential solutions. While returns are not guaranteed, we will do our best to address your concerns and find an appropriate resolution.
            </p>
            <p className="text-lg mb-4">
              To reach our Customer Support Team, please contact us via:
            </p>
            <p className="text-lg mb-4">
              <span className="font-bold">Email:</span> Zenosmarketplace@gmail.com
            </p>
            <p className="text-lg mb-4">
              Thank you for choosing Zenos. We appreciate your understanding and support.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ReturnPolicyPage;