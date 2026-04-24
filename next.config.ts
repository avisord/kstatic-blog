import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  // Cloudinary serves media through redirects from /api/media/file/*,
  // so no image domain config is needed.
};

export default withPayload(nextConfig);
