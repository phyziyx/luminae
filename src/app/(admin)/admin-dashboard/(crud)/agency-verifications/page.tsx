"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VerificationFilters from "./components/verification-filters";
import VerificationRequestList from "./components/verification-request-list";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

// Type definition for a verification request
type VerificationRequest = {
  id: number;
  name: string;
  email: string;
  message: string;
  dateSubmitted: string;
  status: "pending" | "verified" | "rejected";
  attachment: {
    name: string;
    size: number;
    url: string;
  } | null;
};

// Mock data for verification requests
const generateMockRequests = () => {
  const statuses = ["pending", "verified", "rejected"] as const;
  const names = [
    "Stellar Digital Agency",
    "Nexus Creative Studio",
    "Horizon Media Group",
    "Pulse Interactive",
    "Vertex Solutions",
    "Quantum Design Co.",
    "Apex Marketing",
    "Zenith Creative",
    "Prism Digital",
    "Echo Studios",
  ];

  return Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length],
    email: `contact@${names[i % names.length]
      .toLowerCase()
      .replace(/\s+/g, "")}.com`,
    message: `We are ${names[i % names.length]}, a ${
      Math.floor(Math.random() * 10) + 3
    }-year-old digital agency specializing in web design, development, and digital marketing. We have worked with over ${
      Math.floor(Math.random() * 200) + 50
    } clients and would like to get verified on Luminae to showcase our expertise and build trust with potential clients. Our portfolio includes work for Fortune 500 companies and innovative startups across various industries.`,
    dateSubmitted: new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    ).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    attachment:
      Math.random() > 0.3
        ? {
            name: `${names[i % names.length]}_portfolio.pdf`,
            size: Math.floor(Math.random() * 5000) + 1000, // KB
            url: "#",
          }
        : null,
  }));
};

export default function AdminVerificationPage() {
  const [requests, setRequests] = useState(generateMockRequests());
  const [filteredRequests, setFilteredRequests] = useState(requests);

  const pendingCount = requests.filter(
    (req) => req.status === "pending"
  ).length;

  const handleStatusChange = (
    requestId: number,
    newStatus: "verified" | "rejected"
  ) => {
    const updatedRequests = requests.map((req) =>
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    setRequests(updatedRequests);

    const updatedFilteredRequests = filteredRequests.map((req) =>
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    setFilteredRequests(updatedFilteredRequests);
  };

  // ✅ Use useCallback to prevent re-renders
  const handleFilteredRequestsChange = useCallback(
    (filtered: VerificationRequest[]) => {
      setFilteredRequests(filtered);
    },
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <header className="flex items-center justify-between px-4 pb-4 mt-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Agency Verification
          </h1>
          <div className="flex items-center gap-1 ml-4 mt-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Pending:
            </span>
            <Badge
              variant="secondary"
              className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            >
              {pendingCount}
            </Badge>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {/* ✅ Use the memoized function to avoid infinite re-renders */}
        <VerificationFilters
          requests={requests}
          onFilteredRequestsChange={handleFilteredRequestsChange}
        />

        <VerificationRequestList
          requests={filteredRequests}
          onStatusChange={handleStatusChange}
        />
      </main>
    </div>
  );
}
