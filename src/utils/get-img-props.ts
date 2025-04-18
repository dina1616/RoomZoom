import { ImageProps } from 'next/image';

/**
 * Interface for static imported image
 */
interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
}

/**
 * Interface for require'd image module
 */
interface RequiredImageModule {
  default: StaticImageData;
}

/**
 * Type for the image source - could be a URL string, a static import, or a require statement
 */
export type ImageSource = string | StaticImageData | RequiredImageModule | null | undefined;

/**
 * Interface for getImgProps options
 */
interface GetImgPropsOptions {
  src: ImageSource;
  alt?: string;
  props?: Partial<ImageProps>;
}

/**
 * Determines if the image source is a static import
 * @param src - The image source
 * @returns Whether the source is a static import
 */
export const isStaticImport = (src: ImageSource): src is StaticImageData => {
  return !!src && typeof src === 'object' && 'src' in src;
};

/**
 * Determines if the image source is a require'd image
 * @param src - The image source
 * @returns Whether the source is a required image
 */
export const isStaticRequire = (src: ImageSource): src is RequiredImageModule => {
  return (
    !!src && 
    typeof src === 'object' && 
    'default' in src && 
    typeof src.default === 'object' && 
    'src' in src.default
  );
};

/**
 * Generates proper image props for Next.js Image component
 * @param options - Options for generating image props
 * @returns Props for the Next.js Image component
 */
export const getImgProps = ({ 
  src, 
  alt = '', 
  props = {} 
}: GetImgPropsOptions): Partial<ImageProps> => {
  if (!src) {
    // Return default fallback image props
    return {
      src: '/images/placeholder-property.jpg',
      alt,
      ...props,
    };
  }

  // Handle static imports
  if (isStaticImport(src)) {
    return {
      src: src.src,
      width: src.width,
      height: src.height,
      blurDataURL: src.blurDataURL,
      alt,
      ...props,
    };
  }

  // Handle require statements
  if (isStaticRequire(src)) {
    return {
      src: src.default.src,
      width: src.default.width,
      height: src.default.height,
      blurDataURL: src.default.blurDataURL,
      alt,
      ...props,
    };
  }

  // Handle string URLs or other formats
  return {
    src,
    alt,
    ...props,
  };
};

export default getImgProps; 