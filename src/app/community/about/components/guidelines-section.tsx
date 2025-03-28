import { Card, CardContent } from "@/components/ui/card"

export default function GuidelinesSection() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Community Guidelines
        <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
      </h2>

      <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-soft">
        <CardContent className="p-6 sm:p-8">
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              To ensure Luminae remains a valuable resource and welcoming space for all members, we&apos;ve established the
              following guidelines. By participating in our community, you agree to abide by these principles:
            </p>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">Respectful Communication</h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-300">
                <li>Treat all community members with respect and courtesy.</li>
                <li>Avoid personal attacks, harassment, or discriminatory language.</li>
                <li>Disagree constructively and focus on ideas rather than individuals.</li>
                <li>Be mindful of cultural differences and varying perspectives.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">Quality Content</h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-300">
                <li>Post in the appropriate categories to help others find your content.</li>
                <li>Use clear, descriptive titles for your posts.</li>
                <li>Provide context and details when asking questions.</li>
                <li>
                  Format your posts for readability (use paragraphs, lists, and code formatting when appropriate).
                </li>
                <li>Check for duplicate topics before creating a new post.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">Prohibited Content</h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-300">
                <li>Spam, excessive self-promotion, or irrelevant advertising.</li>
                <li>Content that violates intellectual property rights.</li>
                <li>Explicit, offensive, or inappropriate material.</li>
                <li>Misinformation or deliberately misleading content.</li>
                <li>Personal or confidential information about others.</li>
                <li>Content that promotes illegal activities.</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100">
                Constructive Participation
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-600 dark:text-gray-300">
                <li>Contribute to discussions in a meaningful way.</li>
                <li>Acknowledge helpful responses and mark solutions when appropriate.</li>
                <li>Be open to feedback and different perspectives.</li>
                <li>Help maintain a positive atmosphere by reporting inappropriate content.</li>
              </ul>
            </div>

            <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">Enforcement</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Moderators may remove content that violates these guidelines and take appropriate action, including
                warnings, temporary restrictions, or permanent bans for serious or repeated violations. If you believe
                content violates our guidelines, please use the report feature to bring it to our attention.
              </p>
            </div>

            <p className="text-gray-600 dark:text-gray-300">
              These guidelines may be updated periodically. By continuing to use Luminae, you agree to follow the
              current version of these guidelines. Thank you for helping us maintain a valuable and welcoming community!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

