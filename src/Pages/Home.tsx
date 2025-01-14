
import ButtonAsLink from "@/Components/ButtonAsLink";
import ProductList from "@/Components/ProductList";
import SliderArrow from "@/Components/SliderArrow";
import Spinner from "@/Components/Spinner";
import Title from "@/Components/Title";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useProductsData } from "@/Services/Hooks";
import Slider from "react-slick";
import classNames from "classnames";

const Home = () => {
  const { data, isLoading, isFetching } = useProductsData<ProductItemType[]>({
    limit: 12,
  });

  const banners = [
    {
      lg_image: "OraimoBannerB.jpg",
      sm_image: "BannerG.jpg",
      title: "Shop for Oraimo Gadgets",
      link: "/products/oraimo",
    },
    {
      lg_image: "BannerB.png",
      sm_image: "BannerB_2.png",
      title: "Shop for New Age Gadgets",
      link: "/products/new-age",
    },
    {
      lg_image: "BannerC.png",
      sm_image: "newage-flyer.jpg",
      title: "Shop for Itel Gadgets",
      link: "/products/itel",
    },
    {
      lg_image: "BannerH.jpg",
      sm_image: "oraimo-flyer.jpg",
      title: "Buy & Sell Used Products",
      link: "/products/oraimo",
    },
  ];

  const sliderSettings = {
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5500,
    adaptiveHeight: true,
    arrows: true,
    swipe: true,
    dots: true,
    dotsClass: "absolute bottom-2 w-full block !px-6 !py-4",
    nextArrow: (
      <SliderArrow
        type="next"
        arrowClassName="!right-2 md:!right-4 animate-slideright bg-orange-600 p-1.5 !rounded-full !shadow-none md:!hidden group-hover:!block"
        iconClassName="!w-6 !h-6"
      />
    ),
    prevArrow: (
      <SliderArrow
        type="prev"
        arrowClassName="!left-2 md:!left-4 animate-slideleft bg-orange-600 p-1.5 !rounded-full !shadow-none md:!hidden group-hover:!block"
        iconClassName="!w-6 !h-6"
      />
    ),
    customPaging: () => <></>,
    // Add the correct type for the dots parameter
    appendDots: (dots: React.ReactNode[]) => (
      <div>
        <ul className="custom-slick-dot">{dots}</ul>
      </div>
    ),
  };

  return (
    <MainLayout>
      <PageMeta
        title="Gadget Ecommerce"
        description="The ecommerce with the latest in laptops, mobile and gadgets"
      >
        <div className="space-y-7">
          <div className="w-full py-8 px-2 md:py-8 md:px-12">
            <Slider {...sliderSettings} className="group">
              {banners.map((item, index) => (
                <div key={index} className="relative w-full !h-auto md:!h-[75vh]">
                  <div
                    className="!hidden w-full min-h-96 h-full bg-no-repeat bg-center bg-cover rounded-lg md:rounded-3xl md:!block relative"
                    style={{
                      backgroundImage: `url('/assets/images/${item.lg_image}')`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col gap-4 rounded-3xl">
                      <h2 className="text-4xl font-bold text-white text-center">
                        {item.title}
                      </h2>
                      <ButtonAsLink
                        to={item.link}
                        className="!bg-white !text-black hover:!bg-gray-100"
                      >
                        Shop Now
                      </ButtonAsLink>
                    </div>
                  </div>
                  <div
                    className="!block w-full min-h-96 h-full bg-no-repeat bg-center bg-cover rounded-xl md:rounded-3xl md:!hidden relative"
                    style={{
                      backgroundImage: `url('/assets/images/${item.sm_image}')`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center flex-col gap-4 rounded-xl">
                      <h2 className="text-2xl font-bold text-white text-center">
                        {item.title}
                      </h2>
                      <ButtonAsLink
                        to={item.link}
                        className="!bg-white !text-black hover:!bg-gray-100"
                      >
                        Shop Now
                      </ButtonAsLink>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

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
            ].map((item, index) => (
              <div key={index}>
                <div className="w-full px-6 !flex flex-nowrap !flex-row items-center justify-center gap-4 group">
                  <i className={classNames("fa-2x text-orange-500 group-hover:text-orange-700", item.icon)}></i>
                  <div className="space-y-1">
                    <p className="font-sans whitespace-nowrap text-xl leading-none font-semibold uppercase">
                      {item.title}
                    </p>
                    <p className="text-sm leading-5">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <div className="py-10 px-3 md:px-10 space-y-10">
            <div id="shop">
              <div className="flex flex-col text-center gap-y-4 items-center justify-between md:flex-row md:text-left md:justify-between">
                <div>
                  <Title>Best Selling Products</Title>
                  <p className="text-sm font-semibold py-1 px-2">
                    Products with a lot of sales this month and last. Browse through and enjoy.
                  </p>
                </div>
                <div>
                  <ButtonAsLink to="/products">See More</ButtonAsLink>
                </div>
              </div>
              <hr className="mt-3 border-gray-300" />
              <div className="mt-6 py-8">
                {isLoading || isFetching ? (
                  <Spinner
                    className="w-20 h-20"
                    text="Loading Products.."
                    textClassName="text-xl"
                  />
                ) : (
                  data && (
                    data.length > 0 ? (
                      <ProductList products={data} />
                    ) : (
                      <div className="no-container-products">
                        <p className="no-product-data">No Product found!</p>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </PageMeta>
    </MainLayout>
  );
};

export default Home;
