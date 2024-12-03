import Button from "@/Components/Button";
import Filter from "@/Components/Filter";
import {
  default as AwsImage,
  default as ImageAnime,
} from "@/Components/ImageAnime";
import Input from "@/Components/Input";
import ProductList from "@/Components/ProductList";
import Spinner from "@/Components/Spinner";
import Title from "@/Components/Title";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useProductsData } from "@/Services/Hook";
import { EmailPattern } from "@/System/function";
import { notify } from "@/notify";
import { useForm } from "react-hook-form";
import Slider from "react-slick";

const Home = () => {
  const {
    data,
    isLoading,
    isFetching,
  } = useProductsData<ProductItemType[]>();
  const { control, handleSubmit } = useForm();
  const JoinNewsletter = () => {
    notify.success({
      text: "You have successfully being added to our newsletter",
    });
  };

  return (
    <MainLayout>
      <PageMeta
        title="Gadget Ecommerce"
        description="The ecommerce with the latest in laptops, mobile and gadgets"
      >
        <div className="space-y-0">
          <div className="relative flex flex-col items- justify-between py-20 gap-8 min-h-[25rem] md:flex-row md:min-h-[30rem] md:px-6 md:py-28">
            <div className="relative z-50 px-2 space-y-2 w-full md:w-auto md:px-2">
              {/* Text overlay */}
              <div className="flex flex-col items-start">
                <p className="p-4 inline-block text-4xl font-extrabold md:text-6xl lg:text-8xl rounded-t-xl bg-gray-400/25">
                  Laptop .
                </p>
                <p className="p-4 inline-block text-3xl font-extrabold md:text-6xl lg:text-8xl rounded-es-xl rounded-e-xl bg-gray-400/25 md:whitespace-nowrap">
                  Mobile . Gadgets .
                </p>
              </div>
              <p className="text-sm font-semibold md:text-base">
                Power Up Your Life: The Latest in Laptops, Mobile, and Gadgets
              </p>
            </div>
            <div className="w-1/2 h-full">
              <p className="text-2xl font-bold">Featuring</p>
              <Slider>
                <div></div>
                <div></div>
                <div></div>
              </Slider>
            </div>
            <div className="absolute inset-0 bottom-0 -z-10 w-full flex items-end">
              <ImageAnime
                // path="hero.svg"
                height={25}
                typeOfCanva="globe"
                className="w-full h-[40rem] md:h-[40rem]"
                displayCanva
              />
            </div>
          </div>
          <div className="py-6 relative">
            <img
              src="/assets/images/Banner.svg"
              alt="Banner Zenos"
              className="w-full"
            />
          </div>
          <div className="py-10 px-3 md:px-10 space-y-10">
            <div id="shop">
              <Title>Best Selling Products</Title>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr] gap-10">
                <div className="grow">
                  <Filter products={data} />
                </div>
                <div className="">
                  {isLoading ||
                    (isFetching && (
                      <Spinner
                        className="w-20 h-20"
                        text="Loading Products.."
                        textClassName="text-xl"
                      />
                    )) || (
                      <>
                        <ProductList products={data || []} />
                        <>
                          {/* <div className="container">
                            <div className="mix" />
                            <div className="mix" />
                          </div> */}
                          <div className="mixitup-page-list" />
                        </>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
          {/* newsletter */}
          <div className="flex items-center justify-center relative py-24 px-3 md:px-10 space-y-0 bg-transparent h-[25rem] overflow-hidden">
            <div className="relative z-40">
              <form
                onSubmit={handleSubmit(JoinNewsletter)}
                className="mt-8 px-7 py-4 flex flex-col items-center justify-center gap-4"
              >
                <p className="text-6xl font-extrabold text-center tracking-wide">
                  Join Our Newsletter
                </p>
                <div className="w-1/2">
                  <Input
                    control={control}
                    name="email"
                    className="py-12 text-center"
                    placeholder="Enter your email address"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: EmailPattern,
                        message: "Ouch, that doesn't look like an email!",
                      },
                    }}
                  />
                </div>
                <Button type="submit">Join Now</Button>
              </form>
            </div>
            <div className="absolute z-30 overflow-hidden w-full top-0 md:right-0 h-[25rem]">
              <AwsImage
                height={25}
                className="w-full h-[25rem] md:h-[30rem]"
                displayCanva
                typeOfCanva="net"
              />
            </div>
          </div>
        </div>
      </PageMeta>
    </MainLayout>
  );
};
export default Home;
