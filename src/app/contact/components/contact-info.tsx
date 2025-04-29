import Link from "next/link"
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ContactInfo() {
  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-soft">
      <CardContent className="p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-100">Contact Information</h2>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary dark:text-primary-light" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Email</p>
                <a href="mailto:support@luminae.com" className="text-primary dark:text-primary-light hover:underline">
                  support@luminae.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary dark:text-primary-light" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Phone</p>
                <a href="tel:+1-555-123-4567" className="text-primary dark:text-primary-light hover:underline">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary dark:text-primary-light" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Address</p>
                <p className="text-gray-600 dark:text-gray-300">
                  123 Tech Plaza, Suite 400
                  <br />
                  San Francisco, CA 94107
                  <br />
                  United States
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary dark:text-primary-light" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">Hours</p>
                <p className="text-gray-600 dark:text-gray-300">
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
            <h3 className="mb-2 font-medium text-gray-800 dark:text-gray-200">Need Help?</h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
              Check our FAQ section for quick answers to common questions.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-primary text-primary dark:border-primary-light dark:text-primary-light hover:bg-primary/5 dark:hover:bg-primary-light/10"
              asChild
            >
              <Link href="/about#faq" className="flex items-center justify-center gap-1">
                View FAQs
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div>
            <h3 className="mb-3 font-medium text-gray-800 dark:text-gray-200">Connect With Us</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:border-primary-light dark:hover:text-primary-light"
                asChild
              >
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:border-primary-light dark:hover:text-primary-light"
                asChild
              >
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-linkedin"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:border-primary-light dark:hover:text-primary-light"
                asChild
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-github"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

