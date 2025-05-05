import Image from "next/image";

const logos = [
  // "/trustedby/logo1.png",
  "/assets/trustedby/logo2.png",
  //   "/assets/trustedby/logo3.png",
  "/assets/trustedby/logo4.png",
  //   "/assets/trustedby/logo5.png",
  "/assets/trustedby/logo6.png",
  "/assets/trustedby/logo7.png",
  //   "/assets/trustedby/logo8.png",
  // "/trustedby/logo9.png",
  "/assets/trustedby/logo10.png",
  //   "/assets/trustedby/logo11.png",
  "/assets/trustedby/logo12.png",
  "/assets/trustedby/logo13.png",
  //   "/assets/trustedby/logo14.png",
  //   "/assets/trustedby/logo15.png",
  //   "/assets/trustedby/logo16.png",
  //   "/assets/trustedby/logo17.webp",
];

const TrustedBy = () => {
  return (
    <section className="py-10 relative bg-[#f5f9ff] dark:bg-[#000] transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-screen-md relative">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8">
          Trusted by{" "}
          <span className="text-[#3b82f6]">Leading Agencies and Brands </span>
          <br />
          You may have heard of them…
        </h2>

        <div className="relative overflow-hidden h-32 flex items-center">
          {/* Left Overlay */}
          <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#f9fafb] dark:from-[#000] to-transparent z-10 transition-colors duration-300"></div>

          {/* Carousel */}
          <div className="flex animate-carousel">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 mx-4 flex items-center justify-center"
              >
                <Image
                  src={logo}
                  alt={`Client logo ${index + 1}`}
                  width={128}
                  height={64}
                  className="object-contain h-16 md:h-20 lg:h-24 mx-auto"
                />
              </div>
            ))}
          </div>

          {/* Right Overlay */}
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#f9fafb] dark:from-[#000] to-transparent z-10 transition-colors duration-300"></div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
