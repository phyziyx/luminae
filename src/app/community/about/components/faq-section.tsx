"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

// FAQ data
const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. You'll need to provide a valid email address, choose a username, and create a password. Once you've completed the registration form, you'll receive a verification email. Click the link in the email to verify your account, and you'll be ready to start participating in the community.",
  },
  {
    question: "How do I create a new post?",
    answer:
      "To create a new post, log in to your account and click on the 'Create Post' button in the navigation bar or on the homepage. Select the appropriate category for your post, add a clear title, and write your content using the markdown editor. You can also add tags to help others find your post. Once you're satisfied with your post, click 'Create Post' to publish it to the community.",
  },
  {
    question: "Can I edit or delete my posts?",
    answer:
      "Yes, you can edit or delete your own posts. To edit a post, navigate to the post and click the 'Edit' button (pencil icon) near the post title. Make your changes and click 'Save Changes' to update your post. To delete a post, click the 'Delete' option in the same menu. Please note that editing is available for 7 days after posting, and deleting a post with responses may affect the conversation flow.",
  },
  {
    question: "How does the reputation system work?",
    answer:
      "Our reputation system rewards quality contributions to the community. You earn reputation points when your posts or comments receive upvotes, when your answers are marked as solutions, and when you participate regularly. Higher reputation unlocks additional privileges, such as the ability to moderate content, access to exclusive categories, and higher visibility for your posts. You can view your current reputation and progress on your profile page.",
  },
  {
    question: "How do I report inappropriate content?",
    answer:
      "If you encounter content that violates our community guidelines, please report it by clicking the 'Report' option available on all posts and comments. Select the reason for reporting from the dropdown menu and provide any additional context that might help our moderators understand the issue. Reports are reviewed by our moderation team, who will take appropriate action based on our community guidelines. You'll be notified when your report has been reviewed.",
  },
  {
    question: "How do I format my posts with markdown?",
    answer:
      "We support markdown formatting to help you create well-structured, readable posts. You can use **bold** for emphasis, *italics* for subtle emphasis, create lists with bullet points or numbers, add links with [text](url), insert images, and format code with backticks. When creating a post, you'll see a formatting toolbar above the editor with buttons for common markdown elements. You can also preview your post before publishing to ensure it looks as intended.",
  },
  {
    question: "Can I follow specific topics or users?",
    answer:
      "Yes, you can follow both topics and users to customize your feed. To follow a topic, visit any category page and click the 'Follow' button. To follow a user, visit their profile and click 'Follow'. Once you're following topics or users, you'll see their new posts in your personalized feed on the homepage. You can manage your followed topics and users in your account settings.",
  },
  {
    question: "How do I change my profile settings?",
    answer:
      "To change your profile settings, click on your profile picture in the top right corner and select 'Settings' from the dropdown menu. From there, you can update your profile information, change your password, adjust notification preferences, manage privacy settings, and customize your profile appearance. Don't forget to click 'Save Changes' after making any updates.",
  },
]

export default function FaqSection() {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Frequently Asked Questions
        <div className="mt-1 h-1 w-24 bg-[#5B9AFF] dark:bg-[#7BABFF]"></div>
      </h2>

      <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-soft">
        <CardContent className="p-6 sm:p-8">
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Find answers to common questions about using Luminae. If you can&apos;t find what you&apos;re looking for, feel free
            to contact us.
          </p>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <AccordionTrigger className="text-left font-medium text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-primary-light py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-300 pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

