import React from "react";
import ButtonAsLink from "@/Components/ButtonAsLink";
import ProductList from "@/Components/ProductList";
import Spinner from "@/Components/Spinner";
import Title from "@/Components/Title";
import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useProductsData } from "@/Services/Hooks";
import Slider from "react-slick";

const Home = () => {
  const { data, isLoading, isFetching } = useProductsData<ProductItemType[]>({
    limit: 12,
  });

  // Image-only slider content
  const imageSlides = [
    {
      lg_image: "OraimoBannerB.jpg",
      sm_image: "BannerG.jpg",
    },
    {
      lg_image: "BannerH.png",
      sm_image: "oraimo-flyer.jpg",
    },
  ];

  // Content slider with text overlays
  const contentSlides = [
    {
      lg_image: "BannerH.jpg",
      sm_image: "oraimo-flyer.jpg",
      title: "Shop for Oraimo Gadgets",
      link: "/products/oraimo",
    },
    {
      lg_image: "BannerC.png",
      sm_image: "BannerB_2.png",
      title: "Shop for Itel Gadgets",
      link: "/products/itel",
    },
  ];

  const sliderSettings = {
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    adaptiveHeight: true,
    arrows: true,
    swipe: true,
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
          {/* Image-only Slider */}
          <div className="w-full py-8 px-2 md:py-8 md:px-12">
            <Slider {...sliderSettings} className="group">
              {imageSlides.map((item, index) => (
                <div
                  key={index}
                  className="relative w-full !h-auto md:!h-[75vh]"
                >
                  <div
                    className="!hidden w-full min-h-96 h-full bg-no-repeat bg-center bg-cover rounded-lg md:rounded-3xl md:!block"
                    style={{
                      backgroundImage: `url('/assets/images/${item.lg_image}')`,
                    }}
                  />
                  <div
                    className="!block w-full min-h-96 h-full bg-no-repeat bg-center bg-cover rounded-xl md:rounded-3xl md:!hidden"
                    style={{
                      backgroundImage: `url('/assets/images/${item.sm_image}')`,
                    }}
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Content Slider with Text Overlay */}
          <div className="w-full py-8 px-2 md:py-8 md:px-12">
            <Slider {...sliderSettings} className="group">
              {contentSlides.map((item, index) => (
                <div
                  key={index}
                  className="relative w-full !h-auto md:!h-[75vh]"
                >
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
                    <ProductList products={data} />
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
