import MainLayout from "@/Layouts/MainLayout";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const About = () => {
  const PartnerSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  } as Settings;
  const PartnerData = [
    { img: "https://learnchameleon.com/assets/text-logo-udJ6imDo.svg" },
  ];
  return (
    <MainLayout title="About Us">
      <div className="px-5 py-10 space-y-12 md:px-10">
        <div>
          <h2 className="text-4xl font-extrabold tracking-wider">About Us</h2>
          <div className="mt-2 font-normal">
            Welcome to <strong> Zenos Tech Store</strong>, your one-stop
            destination for all things tech! Whether you're in the market for a
            new laptop, the latest mobile phone, or cutting-edge gadgets, we've
            got you covered.
            <br />
            <br /> Here, we pride ourselves on offering a seamless shopping
            experience, combining the best products with exceptional customer
            service. Our curated selection of laptops, mobiles, and gadgets
            ensures that you have access to the latest and greatest in
            technology, all at competitive prices.
            <br />
            <br /> This project is a labor of love, dedicated to the{" "}
            <strong className="underline underline-offset-41 decoration-dotted">
              Chameleon Hackathon community
            </strong>
            . Inspired by the innovation and creativity fostered by Chameleon AI building platform,
            we strive to bring those values into our store, providing our
            customers with not just products, but a commitment to quality and
            excellence. Thank you for choosing <strong> Zenos Tech Store</strong>
            . We're here to help you find the perfect tech solutions to meet
            your needs. Happy shopping!
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold tracking-wider">
            Our Partners
          </h2>
          <div className="mt-6 px-18">
            <Slider arrows {...PartnerSliderSettings} className="">
              {PartnerData.map((item, index) => (
                <div key={index} className={"p-4"}>
                  <div
                    className="w-full h-40 bg-no-repeat bg-contain bg-[left_top_50%] rounded-lg"
                    style={{
                      backgroundImage: `url("${item.img}")`,
                    }}
                  ></div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
