import ButtonAsLink from "@/Components/ButtonAsLink";
import ProductList from "@/Components/ProductList";
import Spinner from "@/Components/Spinner";
import Title from "@/Components/Title";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useProductsData } from "@/Services/Hooks";
import React from "react";
import Slider from "react-slick";

const Home = () => {
  const { data, isLoading, isFetching } = useProductsData<ProductItemType[]>({
    limit: 12,
  });

  // Updated image slides focusing on used products and accessories
  const imageSlides = [
    {
      lg_image: "OraimoBannerB.jpg",
      sm_image: "BannerG.jpg",
      title: "Used Products",
      link: "/products/used-products",
    },
    {
      lg_image: "BannerF.png", // Replace with actual accessories banner
      sm_image: "BannerF.png",
      title: "Phone Accessories",
      link: "/products/phone-accessories",
    },
    {
      lg_image: "BannerH.jpg",
      sm_image: "BannerB_2.png",
    },
  ];

  // Updated content slides with clear CTAs
  const contentSlides = [
    {
      placeholder: "oraimo-flyer.jpg",
      title: "Quality Used Products at Great Prices",
      link: "/products/used-products",
      buttonText: "Shop Used Products",
    },
    {
      placeholder: "newage-flyer.jpg",
      title: "Browse Phone Accessories",
      link: "/products/phone-accessories",
      buttonText: "Shop Accessories",
    },
  ];

  const heroSliderSettings = {
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    adaptiveHeight: true,
    arrows: false,
    // swipe: true,
    dots: true,
    dotsClass: "absolute bottom-2 w-full block !px-6 !py-4",
    nextArrow: <></>,
    prevArrow: <></>,
    customPaging: () => <></>,
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
          {/* Custom Order Button - Fixed Position */}
          <div className="fixed bottom-6 right-6 z-50">
            <ButtonAsLink
              to="/user/inbox"
              className="!bg-primary !text-white hover:!bg-primary-dark shadow-lg rounded-full px-6 py-3 flex items-center gap-2"
            >
              <i className="fa-solid fa-comments"></i>
              Custom Order
            </ButtonAsLink>
          </div>
          {/* Image-only Slider */}
          <div className="w-full py-8 px-2 md:py-8 md:px-12">
            <Slider {...heroSliderSettings} className="group">
              {imageSlides.map((item, index) => (
                <div
                  key={index}
                  className="relative w-full !h-auto md:!h-[80vh]"
                >
                  <div
                    className="!hidden w-full min-h-96 h-full bg-no-repeat bg-top bg-cover rounded-lg md:rounded-3xl md:!block"
                    style={{
                      backgroundImage: `url('/assets/images/${item.lg_image}')`,
                    }}
                  >
                    {item.title && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <ButtonAsLink
                          to={item.link}
                          className="!bg-white !text-black hover:!bg-gray-100 text-lg font-bold"
                        >
                          {item.title}
                        </ButtonAsLink>
                      </div>
                    )}
                  </div>
                  <div
                    className="!block w-full min-h-96 h-full bg-no-repeat bg-center bg-cover rounded-xl md:rounded-3xl md:!hidden"
                    style={{
                      backgroundImage: `url('/assets/images/${item.sm_image}')`,
                    }}
                  >
                    {item.title && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <ButtonAsLink
                          to={item.link}
                          className="!bg-white !text-black hover:!bg-gray-100 text-lg font-bold"
                        >
                          {item.title}
                        </ButtonAsLink>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Content Slider with Text Overlay */}
          <div className="px-0 md:px-6 bg-gray-800/60 mx-2 md:mx-8 rounded-3xl">
            <Slider
              {...{
                slidesToShow: 2,
                autoplaySpeed: 2500,
                autoplay: true,
                infinite: false,
                arrows: false,
                dots: false,
                adaptiveHeight: true,
                responsive: [
                  {
                    breakpoint: 640,
                    settings: {
                      slidesToShow: 1,
                      autoplaySpeed: 2000,
                    },
                  },
                ],
              }}
              centerMode={false}
              className="group w-full gap-4"
            >
              {contentSlides.map((item, index) => (
                <div key={index} className="p-4">
                  <div className="h-44 relative bg-gray-700 rounded-lg gap-8 overflow-hidden md:rounded-3xl">
                    <div className="relative z-10 w-full inset-0 py-4 px-8 bg-gray-800/75 flex flex-col items-center text-center justify-start gap-y-3 md:py-2 md:justify-center md:h-full">
                      <h2 className="text-2xl font-bold text-gray-200 underline underline-offset-4 decoration-dotted md:text-4xl md:leading-[3rem]">
                        {item.title}
                      </h2>
                      <ButtonAsLink
                        to={item.link}
                        className="whitespace-nowrap !m-0"
                      >
                        {item.buttonText}
                      </ButtonAsLink>
                    </div>
                    <div
                      className="absolute inset-0 z-0 w-full h-full bg-red-500 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url("/assets/images/${item.placeholder}")`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Best Selling Products Section */}
          <div className="py-10 px-3 md:px-10 space-y-10">
            <div id="shop">
              <div className="flex flex-col text-center gap-y-4 items-center justify-between md:flex-row md:text-left md:justify-between">
                <div>
                  <Title>Best Selling Products</Title>
                  <p className="text-sm font-semibold py-1 px-2">
                    Products with a lot of sales this month and last. Browse
                    through and enjoy.
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
                  data &&
                  (data.length > 0 ? (
                    <ProductList
                      products={data}
                      filterContainerEnabled={false}
                    />
                  ) : (
                    <div className="no-container-products">
                      <p className="no-product-data">No Product found!</p>
                    </div>
                  ))
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