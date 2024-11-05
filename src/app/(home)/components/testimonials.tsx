import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

const testimonials = [
  {
    text: "Luminae has revolutionized the way our agency manages client projects. The collaborative tools are a game-changer!",
    imageSrc: "/assets/Testimonials/avatar-1.png",
    name: "Alex Morgan",
    username: "@alexcreative",
  },
  {
    text: "Switching to Luminae has increased our team’s productivity by 40%. It's intuitive and easy to use.",
    imageSrc: "/assets/Testimonials/avatar-1.png",
    name: "Taylor Green",
    username: "@taylorgreenbiz",
  },
  {
    text: "The client management features have helped us deliver faster and maintain client satisfaction. Highly recommend Luminae!",
    imageSrc: "/assets/Testimonials/avatar-1.png",
    name: "Jordan Lee",
    username: "@jlee_agency",
  },
  {
    text: "As an agency owner, Luminae’s performance tracking is invaluable. It’s the best tool for scaling our operations.",
    imageSrc: "/assets/Testimonials/avatar-1.png",
    name: "Samantha Ray",
    username: "@samraygrowth",
  },
  {
    text: "Luminae has streamlined our communication and made multi-account management effortless.",
    imageSrc: "/assets/Testimonials/avatar-1.png",
    name: "Chris Patton",
    username: "@cp_creatives",
  },
  {
    text: "Finally, a tool that brings all our agency’s needs under one roof! Luminae is essential for managing complex projects.",
    imageSrc: "/assets/Testimonials/avatar-1.png",
    name: "Jamie Brooks",
    username: "@jamieb_digital",
  },
  {
    text: "Our team is more organized and efficient than ever. Luminae keeps us on track with deadlines and client needs.",
    imageSrc: "/assets/Testimonials/avatar-1.png",
    name: "Patricia Chen",
    username: "@patriciachen_",
  },
  {
    text: "We’ve saved countless hours with Luminae’s task management. It’s now our go-to tool for agency workflows.",
    imageSrc: "/assets/Testimonials/avatar-1.png",
    name: "David Allen",
    username: "@davidallenco",
  },
  {
    text: "Luminae’s community features have improved team collaboration and engagement. Our projects run smoother than ever.",
    imageSrc: "/assets/Testimonials/avatar-1.png",
    name: "Lisa Turner",
    username: "@lisa_t_creates",
  },
];

const Testimonials = async () => {
  const t = await getTranslations();

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  const TestimonialsColumn = (props: {
    className?: string;
    testimonials: typeof testimonials;
  }) => (
    <div
      className={cn(
        "flex flex-col gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]",
        props.className
      )}
    >
      {props.testimonials.map(({ text, imageSrc, name, username }) => (
        <div className="card">
          <div>{text}</div>
          <div className="flex items-center gap-2 mt-5">
            <Image src={imageSrc} alt={name} width={40} height={40} />
            <div className="flex flex-col">
              <div className="font-medium tracking-tight leading-5">{name}</div>
              <div className="leading-5 tracking-tight">{username}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="bg-white">
      <div className="container">
        <div className="max-w-[540px] mx-auto">
          <div className="flex justify-center">
            <div className="tag">{t("TESTIMONIALS_HEADING")}</div>
          </div>
          <h2 className="section-title mt-5">{t("TESTIMONIALS_TAGLINE")}</h2>
          <p className="section-description mt-5">
            {t("TESTIMONIALS_DESCRIPTION")}
          </p>
        </div>
        <div className="flex justify-center gap-6">
          <TestimonialsColumn testimonials={firstColumn} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:flex"
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:flex"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
