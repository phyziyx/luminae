"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { useTranslations } from "next-intl";
import Heading from "./heading";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const Testimonials = () => {
  const t = useTranslations();

  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  const TestimonyCard = ({
    text,
    imageSrc,
    username,
    name,
  }: {
    text: string;
    imageSrc: string;
    username: string;
    name: string;
  }) => (
    <Card className="p-2 rounded-3xl max-w-sm w-full bg-muted border-0">
      <CardHeader />
      <CardContent className="-mt-6">{text}</CardContent>
      <CardFooter className="flex items-center gap-2 mt-5">
        <Image src={imageSrc} alt={name} width={40} height={40} />
        <div className="flex flex-col">
          <div className="font-medium tracking-tight leading-5">{name}</div>
          <div className="leading-5 tracking-tight">{username}</div>
        </div>
      </CardFooter>
    </Card>
  );

  const TestimonialsColumn = (props: {
    className?: string;
    testimonials: typeof testimonials;
    duration?: number;
  }) => (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, outerIndex) => (
          <React.Fragment key={outerIndex}>
            {props.testimonials.map((data, innerIndex) => (
              <TestimonyCard key={`${data.username}-${innerIndex}`} {...data} />
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );

  return (
    <section className="bg-white dark:bg-black">
      <div className="max-w-[540px] mx-auto">
        <div className="flex justify-center">
          <Badge className="mt-5" variant="secondary">
            {t("TESTIMONIALS_HEADING")}
          </Badge>
        </div>
        <Heading>{t("TESTIMONIALS_TAGLINE")}</Heading>
        <p className="mt-5 text-center text-base dark:text-white text-black leading-[30px] tracking-tight text-normal md:text-lg">
          {t("TESTIMONIALS_DESCRIPTION")}
        </p>
      </div>
      <div className="flex justify-center gap-6 mt-10 max-h-[738px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
        <TestimonialsColumn testimonials={firstColumn} duration={15} />
        <TestimonialsColumn
          testimonials={secondColumn}
          className="hidden md:block"
          duration={19}
        />
        <TestimonialsColumn
          testimonials={thirdColumn}
          className="hidden lg:block"
          duration={17}
        />
      </div>
    </section>
  );
};

export default Testimonials;
