export const NEXT_PUBLIC_ITEMS_PER_PAGE = process.env.NEXT_PUBLIC_ITEMS_PER_PAGE;
export const NEXT_PUBLIC_LATEST_PER_PAGE = process.env.NEXT_PUBLIC_LATEST_PER_PAGE;
export const NEXT_PUBLIC_TRENDING_PER_PAGE = process.env.NEXT_PUBLIC_TRENDING_PER_PAGE;
export const NEXT_PUBLIC_KREATOR_BASE_URL = process.env.NEXT_PUBLIC_KREATOR_BASE_URL;
export const NEXT_PUBLIC_DIGITAL_ONLY = process.env.NEXT_PUBLIC_DIGITAL_ONLY.toLowerCase() === 'true' ? true : false;
export const NEXT_PUBLIC_SOCIAL_MEDIA = process.env.NEXT_PUBLIC_SOCIAL_MEDIA.split(',').filter(x => x !== '');
export const NEXT_PUBLIC_BYPASS = process.env.NEXT_PUBLIC_BYPASS.toLowerCase() === 'true' ? true : false;
export const NEXT_PUBLIC_BYPASS_LIST = process.env.NEXT_PUBLIC_BYPASS_LIST.split(',').filter(x => x !== '');
