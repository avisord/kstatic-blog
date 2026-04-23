import { fields } from '@keystatic/core';
import { wrapper, block } from '@keystatic/core/content-components';

export const componentBlocks = {
  callout: wrapper({
    label: 'Callout',
    schema: {
      intent: fields.select({
        label: 'Intent',
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Warning', value: 'warning' },
          { label: 'Danger', value: 'danger' },
        ],
        defaultValue: 'info',
      }),
    },
  }),
  youtube: block({
    label: 'YouTube video',
    schema: {
      url: fields.text({
        label: 'YouTube URL',
        validation: { length: { min: 1 } },
      }),
      caption: fields.text({ label: 'Caption (optional)' }),
    },
  }),
  gallery: block({
    label: 'Gallery',
    schema: {
      images: fields.array(
        fields.object({
          image: fields.image({
            label: 'Image',
            directory: 'public/images/posts',
            publicPath: '/images/posts/',
            validation: { isRequired: true },
          }),
          alt: fields.text({ label: 'Alt text' }),
          caption: fields.text({ label: 'Caption (optional)' }),
        }),
        {
          label: 'Images',
          itemLabel: (props) => props.fields.alt.value || 'Image',
          validation: { length: { min: 1 } },
        }
      ),
      columns: fields.select({
        label: 'Columns',
        options: [
          { label: '2 columns', value: '2' },
          { label: '3 columns', value: '3' },
          { label: '4 columns', value: '4' },
        ],
        defaultValue: '3',
      }),
    },
  }),
};
