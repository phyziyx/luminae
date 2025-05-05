import Image, { ImageProps } from "next/image";

export type ThemeImageProps = Omit<ImageProps, "src"> & {
  srcLight: ImageProps["src"];
  srcDark: ImageProps["src"];
  priority?: boolean;
  loading?: "lazy" | "eager";
};

export const ThemedImage = ({
  srcLight,
  srcDark,
  alt,
  className,
  priority = false,
  loading,
  ...rest
}: ThemeImageProps) => {
  // Only set `loading` if `priority` is false
  const commonProps = {
    className,
    alt,
    priority,
    ...(priority ? {} : { loading: loading ?? "lazy" }),
    ...rest,
  };

  return (
    <>
      <Image
        src={srcLight}
        {...commonProps}
        className={`dark:hidden ${className}`}
        alt="Light Mode Dashboard Preview"
      />
      <Image
        src={srcDark}
        {...commonProps}
        className={`hidden dark:block ${className}`}
        alt="Dark Mode Dashboard Preview"
      />
    </>
  );
};

export default ThemedImage;
