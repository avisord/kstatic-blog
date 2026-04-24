import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types';
import { v2 as cloudinary, type UploadApiOptions } from 'cloudinary';
import { Readable } from 'node:stream';

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  folder?: string;
};

// Minimal Cloudinary adapter for @payloadcms/plugin-cloud-storage.
// - Uploads via upload_stream (no temp file, works on serverless)
// - Deletes by filename, stripping the file extension for the public_id
// - Serves bytes by redirecting to the Cloudinary secure_url
export const cloudinaryAdapter = (config: CloudinaryConfig): Adapter => {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });

  const folder = config.folder ?? 'payload';

  // urlAnalytics: false — the Cloudinary SDK reads its own package.json via
  // fs.readFileSync for analytics, which fails when the module is bundled by
  // webpack (throws "Must supply sdk_semver"). We don't need the param anyway.
  const urlOpts = { secure: true, urlAnalytics: false } as const;

  return (): GeneratedAdapter => ({
    name: 'cloudinary',
    generateURL: ({ filename }) =>
      cloudinary.url(`${folder}/${stripExt(filename)}`, urlOpts),
    handleUpload: async ({ file }) => {
      await new Promise<void>((resolve, reject) => {
        const options: UploadApiOptions = {
          folder,
          public_id: stripExt(file.filename),
          resource_type: 'auto',
          overwrite: true,
          unique_filename: false,
          use_filename: false,
        };
        const stream = cloudinary.uploader.upload_stream(options, (err) => {
          if (err) reject(err);
          else resolve();
        });
        Readable.from(file.buffer).pipe(stream);
      });
      return {};
    },
    handleDelete: async ({ filename }) => {
      await cloudinary.uploader.destroy(`${folder}/${stripExt(filename)}`, {
        invalidate: true,
      });
    },
    staticHandler: async (_req, { params }) => {
      const url = cloudinary.url(`${folder}/${stripExt(params.filename)}`, urlOpts);
      return Response.redirect(url, 302);
    },
  });
};

function stripExt(filename: string): string {
  return filename.replace(/\.[^.]+$/, '');
}
