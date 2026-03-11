export const BLOG_QUEUE = 'blog-processing';
export const NOTIFICATION_QUEUE = 'notifications';

export enum BlogJobType {
  GENERATE_SUMMARY = 'generate-summary',
}

export enum NotificationJobType {
  NEW_COMMENT = 'new-comment',
  NEW_LIKE = 'new-like',
}
