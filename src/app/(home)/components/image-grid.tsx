import Image from "next/image";

const images = [
  {
    src: "/assets/TrustedAgencies/Overheadoptimised.png",
    alt: "",
    heading: "Overhead Optimize",
  },
  {
    src: "/assets/TrustedAgencies/bamdig-panda.png",
    alt: "",
    heading: "Bamdig",
  },
  {
    src: "/assets/TrustedAgencies/CreatorFlight.png",
    alt: "",
    heading: "Creator Flight",
  },
  {
    src: "/assets/TrustedAgencies/Wakato.png",
    alt: "",
    heading: "Wakato",
  },
];

export default function ImageGrid() {
  return (
    <div className="grid grid-cols-2 place-items-center md:grid-cols-4 content-center items-center gap-6 md:gap-16">
      {images.map((image, index) => (
        <div key={index} className="flex flex-col items-center">
          <Image src={image.src} alt={image.alt} width={150} height={150} />
          {image.heading && (
            <p className="mt-5 text-center text-2xl font-semibold">
              {image.heading}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
