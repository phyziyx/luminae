import Image, { ImageProps } from "next/image";

export type ThemeImageProps = Omit<
  ImageProps,
  // Lazy loading is required, otherwise, both images will be loaded
  "src" | "priority" | "loading"
> & {
  srcLight: ImageProps["src"];
  srcDark: ImageProps["src"];
};

export const ThemedImage = ({
  srcLight,
  srcDark,
  alt,
  className,
  ...rest
}: ThemeImageProps) => {
  return (
    <>
      <Image
        src={srcLight}
        alt={`${alt} (light)`}
        className={`dark:hidden ${className}`}
        {...rest}
      />
      <Image
        src={srcDark}
        alt={`${alt} (dark)`}
        className={`hidden dark:block ${className}`}
        {...rest}
      />
    </>
  );
};

export default ThemedImage;
