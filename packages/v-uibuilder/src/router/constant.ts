export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const EXCEPTION_COMPONENT = () => import('@/pages/sys/exception/Exception.vue');

/**
 * @description: default layout
 */
export const LAYOUT = () => import('@/layout/page/index.vue');