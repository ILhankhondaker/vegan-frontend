import Image from "next/image";
import MerchantSearch from "./MerchantSearch";

export default function HeroSection() {
  return (
    <div
      className={
        "hero-section relative h-screen w-screen bg-[url('https://res.cloudinary.com/dgnustmny/image/upload/v1738650556/hero-img_h42gjh.png')] bg-cover bg-no-repeat"
      }
    >
      <div className="bg-opacity absolute z-10 flex h-full w-full flex-col items-center justify-center bg-black/40 bg-[url('https://res.cloudinary.com/dgnustmny/image/upload/v1738649859/logo_white_zsmua3.png')] bg-center bg-no-repeat text-center backdrop:blur-md" />
      {/* hero content  */}
      <div className="absolute z-20 flex h-full w-full flex-col items-center justify-center bg-black/60 backdrop:blur-sm">
        <div className="container flex max-w-[792px] flex-col items-center">
          <h1 className="hero-title text-center text-[40px] font-semibold leading-[50px] text-white md:mx-8 md:tracking-[-4px] lg:text-[64px]">
            The World&apos;s First All Vegan Marketplace
          </h1>
          <Image
            src={
              "https://res.cloudinary.com/dgnustmny/image/upload/v1738650639/hero-Vector_fuaygl.png"
            }
            alt=""
            width={500}
            height={500}
            className="h-auto w-[558px]"
          />
          <p className="my-10 text-center text-[22px] leading-[33px] text-white">
            Book vegan professionals, shop cruelty-free products, connect with
            charity organizations.
          </p>
          <MerchantSearch />
        </div>
      </div>
    </div>
  );
}
