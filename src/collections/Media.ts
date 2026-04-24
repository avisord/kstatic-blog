import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    // Lets the cloud-storage plugin own the bytes. Files are streamed to
    // Cloudinary; Payload only keeps the metadata row in Mongo.
    disableLocalStorage: true,
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
};
