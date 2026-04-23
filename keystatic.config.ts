import { config, fields, collection } from '@keystatic/core';
import { componentBlocks } from './src/keystatic/components';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishedDate: fields.date({ label: 'Published Date' }),
        summary: fields.text({
          label: 'Summary',
          multiline: true,
          validation: { length: { min: 1, max: 240 } },
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
          validation: { isRequired: true },
        }),
        content: fields.markdoc({
          label: 'Content',
          components: componentBlocks,
          options: {
            image: {
              directory: 'public/images/posts',
              publicPath: '/images/posts/',
            },
          },
        }),
      },
    }),
  },
});
