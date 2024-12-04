import Anime from "@/Components/Anime";
import Button from "@/Components/Button";
import Filter from "@/Components/Filter";
import Input from "@/Components/Input";
import ProductList from "@/Components/ProductList";
import Spinner from "@/Components/Spinner";
import Title from "@/Components/Title";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useProductsData } from "@/Services/Hook";
import { EmailPattern } from "@/System/function";
import { notify } from "@/notify";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import Slider from "react-slick";

const Home = () => {
  const { data, isLoading, isFetching } = useProductsData<ProductItemType[]>();
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
          <div
            className={classNames("relative items-stretch", {
              "min-h-[25rem] md:min-h-screen": true,
            })}
          >
            <Slider
              {...{
                fade: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                // autoplay: true,
                autoplaySpeed: 6000,
                adaptiveHeight: true,
                arrows: false,
                // infinite: false,
                swipe: true,
                dots: true,
              }}
              className=""
            >
              <div
                className={classNames("py-40 h-full relative space-y-6", {
                  "min-h-[25rem] md:min-h-screen": true,
                })}
                data-main
              >
                <div className="flex flex-col items-start">
                  <div className="px-6 py-6 inline-block mx-auto rounded-t-3xl bg-gray-400/40 md:px-4">
                    <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zenos-100/65 via-zenos-300/80 to-zenos-500 md:text-6xl lg:text-9xl">
                      Grooming
                    </p>
                  </div>
                  <div className="px-6 py-6 inline-block mx-auto rounded-3xl bg-gray-400/40 md:px-4">
                    <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-zenos-500 via-zenos-300/80 to-zenos-100/65 md:text-6xl lg:text-9xl">
                      Ultimate . Series
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-center tracking-wide md:text-xl">
                  Power Up Your Life: The Latest in Mobile; Accessories and
                  Gadgets
                </p>
                {/* Animation */}
                <div className="bg-white absolute inset-0 bottom-0 -z-10 w-full flex items-end">
                  <Anime
                    height={25}
                    typeOfCanva="globe"
                    className="w-full h-[40rem] md:h-[40rem]"
                  />
                </div>
              </div>
              <div
                className={classNames("relative h-full bg-red-500", {
                  "min-h-[25rem] md:min-h-screen": true,
                })}
              >
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url("https://cdn-img.oraimo.com/2024/10/24/20241023-185521.jpg")`,
                  }}
                ></div>
              </div>
            </Slider>
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
                    )) ||
                    (data &&
                      ((data?.length > 0 && (
                        <>
                          <ProductList products={data || []} />
                          <div className="mixitup-page-list" />
                        </>
                      )) || (
                        <div className="mixitup-container-failed">
                          <p className="no-product-data">No Product found! Start listing Product</p>
                        </div>
                      )))}
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
              <Anime
                height={25}
                className="w-full h-[25rem] md:h-[30rem]"
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
