import Button from "./Button";

const Cookie = () => {
    
  return (
    <div className="hidden fixed bottom-0 w-full z-50 bg-gray-800 py-6 px-12 shadow-lg shadow-white flex flex-col items-center justify-center gap-x-8 gap-y-4 md:py-4 md:flex-row">
      <p className="text-base font-medium text-center md:text-lg">
        The website uses cookies to ensure you get the best experience on our
        website.
      </p>
      <Button type="button">Accept</Button>
    </div>
  );
};

export default Cookie;
