import { Card, CardContent } from "@/components/ui/card"

export default function AboutSection() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
        About Us
        <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
      </h2>

      <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-soft">
        <CardContent className="p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Luminae is a community forum dedicated to connecting professionals, enthusiasts, and learners in the
                fields of design, development, marketing, and technology. Our mission is to create a space where
                knowledge is shared freely, questions are answered thoughtfully, and connections are made that help
                everyone grow.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">Our Story</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Founded in 2023, Luminae began as a small discussion group for designers and developers looking to share
                insights and solve problems together. As our community grew, we expanded to include more disciplines and
                formalized our platform to better serve our members&apos; needs.
              </p>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                Today, Luminae hosts thousands of discussions across multiple categories, with members from around the
                world contributing their expertise and experiences. We&apos;re proud to have built a community that values
                quality content, respectful discourse, and continuous learning.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">Our Values</h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Knowledge Sharing</span> - We believe
                  in the free exchange of ideas and information.
                </li>
                <li>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Respect</span> - We foster an
                  environment where all members are treated with dignity and courtesy.
                </li>
                <li>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Quality</span> - We prioritize
                  thoughtful, well-crafted content over quantity.
                </li>
                <li>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Inclusivity</span> - We welcome diverse
                  perspectives and backgrounds.
                </li>
                <li>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Growth</span> - We encourage continuous
                  learning and professional development.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">Join Our Community</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Whether you&apos;re here to share your expertise, ask questions, or simply learn from others, we&apos;re glad to
                have you. Create an account to start participating in discussions, or browse our existing content to see
                what Luminae has to offer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

