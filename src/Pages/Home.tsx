import Anime from "@/Components/Anime";
import Button from "@/Components/Button";
import ButtonAsLink from "@/Components/ButtonAsLink";
import Filter from "@/Components/Filter";
import Input from "@/Components/Input";
import ProductList from "@/Components/ProductList";
import SliderArrow from "@/Components/SliderArrow";
import Spinner from "@/Components/Spinner";
import Title from "@/Components/Title";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useProductsData } from "@/Services/Hooks";
import { EmailPattern } from "@/System/function";
import { notify } from "@/notify";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import Slider from "react-slick";

const Home = () => {
  const { data, isLoading, isFetching } = useProductsData<ProductItemType[]>({
    limit: 12,
  });
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
        <div className="space-y-7">
          <div className="grid grid-cols-1 items-stretch gap-x-14 py-8 px-2 md:py-8 md:px-12 lg:grid-cols-[69%_auto]">
            <Slider
              {...{
                fade: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: 5500,
                adaptiveHeight: true,
                arrows: !false,
                // infinite: false,
                swipe: true,
                dots: true,
                dotsClass: "absolute bottom-2 w-full block !px-6 !py-4",
                nextArrow: (
                  <SliderArrow
                    type="next"
                    arrowClassName="!right-2 md:!right-4 animate-slideright bg-zenos-600 p-1.5 !rounded-full !shadow-none md:!hidden group-hover:!block"
                    iconClassName="!w-6 !h-6"
                    // iconClassName="!w-8 !h-8 md:!w-6 md:!h-6"
                  />
                ),
                prevArrow: (
                  <SliderArrow
                    type="prev"
                    arrowClassName="!left-2 md:!left-4 animate-slideleft bg-zenos-600 p-1.5 !rounded-full !shadow-none md:!hidden group-hover:!block"
                    iconClassName="!w-6 !h-6"
                  />
                ),
                customPaging: () => <></>,
                appendDots: (dots) => (
                  <div>
                    <ul className="custom-slick-dot">{dots}</ul>
                  </div>
                ),
              }}
              className="group"
            >
              {[
                {
                  lg_image: "OraimoBannerB.jpg",
                  sm_image: "BannerG.jpg",
                },
                { lg_image: "BannerB.png", sm_image: "BannerB_2.png" },
                {
                  lg_image: "BannerC.png",
                  sm_image: "newage-flyer.jpg",
                },
                {
                  lg_image: "BannerH.jpg",
                  sm_image: "oraimo-flyer.jpg",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={classNames("relative w-full !h-auto md:!h-[75vh]")}
                >
                  {/* Large Screen */}
                  <div
                    className={classNames(
                      "!hidden w-full min-h-96 h-full bg-no-repeat bg-center bg-cover rounded-lg md:rounded-3xl md:!block"
                    )}
                    style={{
                      backgroundImage: `url('/assets/images/${item.lg_image}')`,
                    }}
                  />
                  {/* Small Screen */}
                  <div
                    className={classNames(
                      "!block w-full min-h-96 h-full bg-no-repeat bg-center bg-cover rounded-xl md:rounded-3xl md:!hidden"
                    )}
                    style={{
                      backgroundImage: `url('/assets/images/${item.sm_image}')`,
                    }}
                  />
                </div>
              ))}
            </Slider>
            <div className="font-roboto grid md:grid-rows-2 gap-8 py-6 px-2">
              {/* Oraimo Flyer */}
              {[
                {
                  placeholder: "oraimo-flyer.jpg",
                  title: "Oraimo",
                  link: "/products/oraimo",
                },
                {
                  placeholder: "newage-flyer.jpg",
                  title: "New Age",
                  link: "/products/new-age",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="h-auto relative bg-gray-800 rounded-lg gap-8 overflow-hidden md:h-full md:rounded-3xl"
                >
                  <div className="relative z-10 w-full inset-0 py-4 px-8 bg-gray-800/75 flex flex-col items-center text-center justify-start gap-y-3 md:py-2 md:justify-center md:h-full">
                    <h2 className="text-2xl font-bold text-gray-200 underline underline-offset-4 decoration-dotted md:text-4xl md:leading-[3rem]">
                      Shop for <br className="hidden md:block" />
                      {item.title} Gadgets
                    </h2>
                    <ButtonAsLink
                      to={item.link}
                      className="whitespace-nowrap !m-0"
                    >
                      Shop Now
                    </ButtonAsLink>
                  </div>
                  <div
                    className="absolute inset-0 z-0 w-full h-full bg-red-500 bg-cover bg-top bg-no-repeat"
                    style={{
                      backgroundImage: `url("/assets/images/${item.placeholder}")`,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          {/* Quick About Us */}
          <Slider
            {...{
              slidesToShow: 5,
              autoplay: true,
              autoplaySpeed: 900,
              infinite: true,
              arrows: false,
              dots: false,
              responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  },
                },
              ],
            }}
            className="quick-us px-5"
          >
            {[
              {
                icon: "fa-solid fa-headset",
                title: "24/7 Support",
                subtitle: "Support every time",
              },
              {
                icon: "fa-solid fa-credit-card",
                title: "Accept Payment",
                subtitle: "Verve, Bank Transfer",
              },
              {
                icon: "fa-solid fa-shield",
                title: "Secure Payment",
                subtitle: "100% Secured",
              },
              {
                icon: "fa-solid fa-truck",
                title: "Free Shipping",
                subtitle: "Across Nigeria",
              },
              {
                icon: "fa-solid fa-calendar",
                title: "30 days return",
                subtitle: "Get 30 days guarantee",
              },
            ].map((item, index) => {
              return (
                <div key={index}>
                  <div
                    className={classNames(
                      "w-full px-6 !flex flex-nowrap !flex-row items-center justify-center gap-4 group"
                    )}
                  >
                    <i
                      className={classNames(
                        "fa-2x text-zenos-500 group-hover:text-zenos-700",
                        item.icon
                      )}
                    ></i>
                    <div className="space-y-1">
                      <p className="font-sans whitespace-nowrap text-xl leading-none font-semibold uppercase">
                        {item.title}
                      </p>
                      <p className="text-sm leading-5 ">{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
          <div className="py-10 px-3 md:px-10 space-y-10">
            <div id="shop">
              <div className="flex flex-col text-center gap-y-4 items-center justify-between md:flex-row md:text-left md:justify-between">
                <div>
                  <Title>Best Selling Products</Title>
                  <p className="text-sm font-semibold py-1 px-2">
                    Products with a lot of sale this month and last. Browse
                    through and enjoy.
                  </p>
                </div>
                <div>
                  <ButtonAsLink to="/products">See More</ButtonAsLink>
                </div>
              </div>
              <hr className="mt-3 border-gray-300" />
              <div className="mt-6 py-8 grid grid-cols-1 sm:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr] gap-10">
                <div className="grow">
                  <Filter products={data || []} paginateLimit={6} />
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
                        <div className="no-container-products">
                          <p className="no-product-data">No Product found!</p>
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
