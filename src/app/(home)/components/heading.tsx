const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-center text-3xl md:text-[54px] md:leading-[70px] font-bold tracking-tight bg-gradient-to-b dark:from-white from-black to-blue-500 dark:to-blue-500 text-transparent bg-clip-text section-title">
    {children}
  </h2>
);

export default Heading;
