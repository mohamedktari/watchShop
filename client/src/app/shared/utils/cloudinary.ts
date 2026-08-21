/**
 * Inserts a Cloudinary delivery transformation into an already-uploaded image URL,
 * e.g. https://res.cloudinary.com/xxx/image/upload/v123/watchshop/products/abc.jpg
 *   -> https://res.cloudinary.com/xxx/image/upload/f_auto,q_auto:best,e_sharpen,e_improve,w_1200,c_limit/v123/watchshop/products/abc.jpg
 * f_auto/q_auto:best let Cloudinary pick the best format/quality per browser without
 * re-uploading anything; e_sharpen/e_improve are free-tier Cloudinary effects that add
 * real sharpness/contrast/color correction (not AI upscaling - can't invent detail that
 * isn't in the source photo); w_/c_limit caps the delivered size so large screens get a
 * sharp image without shipping more bytes than needed on small ones.
 */
export function cloudinaryOptimize(url: string | undefined | null, width: number): string {
  if (!url || !url.includes('/upload/')) return url ?? '';
  const transformation = `f_auto,q_auto:best,e_sharpen,e_improve,w_${width},c_limit`;
  return url.replace('/upload/', `/upload/${transformation}/`);
}
