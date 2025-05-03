import Link from "next/link";
import { ArrowLeft, ArrowDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AboutSection from "./components/about-section";
import GuidelinesSection from "./components/guidelines-section";
import FaqSection from "./components/faq-section";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 -ml-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
          asChild
        >
          <Link href="/community">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 sm:text-4xl">
            About{" "}
            <span className="text-[#5B9AFF] dark:text-[#7BABFF]">Luminae</span>
            <div className="mt-2 h-1 w-48 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
          </h1>
          <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-300">
            Learn more about our community, guidelines, and frequently asked
            questions.
          </p>
        </div>

        {/* Navigation Links */}
        <Card className="mb-8 overflow-hidden bg-white dark:bg-gray-800 shadow-soft">
          <CardContent className="p-6">
            <nav className="flex flex-wrap gap-4 sm:gap-6">
              <a
                href="#about"
                className="flex items-center gap-1 text-primary dark:text-primary-light hover:underline"
              >
                <ArrowDown className="h-4 w-4" />
                About Us
              </a>
              <a
                href="#guidelines"
                className="flex items-center gap-1 text-primary dark:text-primary-light hover:underline"
              >
                <ArrowDown className="h-4 w-4" />
                Community Guidelines
              </a>
              <a
                href="#faq"
                className="flex items-center gap-1 text-primary dark:text-primary-light hover:underline"
              >
                <ArrowDown className="h-4 w-4" />
                FAQs
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-1 text-primary dark:text-primary-light hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Contact Us
              </Link>
            </nav>
          </CardContent>
        </Card>

        {/* About Section */}
        <section id="about" className="scroll-mt-20 mb-12">
          <AboutSection />
        </section>

        <Separator className="my-12 bg-gray-200 dark:bg-gray-700" />

        {/* Guidelines Section */}
        <section id="guidelines" className="scroll-mt-20 mb-12">
          <GuidelinesSection />
        </section>

        <Separator className="my-12 bg-gray-200 dark:bg-gray-700" />

        {/* FAQ Section */}
        <section id="faq" className="scroll-mt-20 mb-12">
          <FaqSection />
        </section>

        {/* Bottom Navigation */}
        <Card className="mt-12 overflow-hidden bg-white dark:bg-gray-800 shadow-soft">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Need more information?
              </h2>
              <nav className="flex flex-wrap justify-center gap-6">
                <a
                  href="#about"
                  className="text-primary dark:text-primary-light hover:underline"
                >
                  About Us
                </a>
                <a
                  href="#guidelines"
                  className="text-primary dark:text-primary-light hover:underline"
                >
                  Community Guidelines
                </a>
                <a
                  href="#faq"
                  className="text-primary dark:text-primary-light hover:underline"
                >
                  FAQs
                </a>
                <Link
                  href="/contact"
                  className="text-primary dark:text-primary-light hover:underline"
                >
                  Contact Us
                </Link>
              </nav>
              <Button
                className="mt-2 bg-primary hover:bg-primary/90 dark:bg-primary-light dark:text-gray-900 dark:hover:bg-primary-light/90"
                asChild
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
