import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black text-[#BCBCBC] text-sm py-10 text-center">
      <div className="containter">
        <div className="inline-flex relative before:content-[''] before:top-2 before:bottom-0 before:blur before:w-full before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
          <Image
            src="/assets/bulb.png"
            height={40}
            width={40}
            alt="Logo"
            className="relative"
          />
        </div>
        <nav className="flex flex-col md:flex-row md:justify-center gap-6 mt-6">
          <a href="#">Pricing</a>
          <a href="#">Documnetation</a>
          <a href="#">Support</a>
        </nav>
        <p className="mt-6">&copy; 2024 Luminae, All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
