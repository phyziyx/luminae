// layout.tsx
import Navigation from "./components/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
