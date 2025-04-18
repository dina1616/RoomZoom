/**
 * Utility function to generate Next.js Image props based on source type
 */

/**
 * Determines if the image source is a static import
 * @param {any} src - The image source
 * @returns {boolean} - Whether the source is a static import
 */
export const isStaticImport = (src) => {
  return src && typeof src === 'object' && 'src' in src;
};

/**
 * Determines if the image source is a require'd image
 * @param {any} src - The image source
 * @returns {boolean} - Whether the source is a required image
 */
export const isStaticRequire = (src) => {
  return (
    src && typeof src === 'object' && ('default' in src) && 
    typeof src.default === 'object' && ('src' in src.default)
  );
};

/**
 * Generates proper image props for Next.js Image component
 * @param {Object} options - Options for generating image props
 * @param {string|Object} options.src - The image source (URL, static import, or require)
 * @param {string} options.alt - Alt text for the image
 * @param {Object} [options.props={}] - Additional props to pass to the Image component
 * @returns {Object} - Props for the Next.js Image component
 */
export const getImgProps = ({ src, alt = '', props = {} }) => {
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