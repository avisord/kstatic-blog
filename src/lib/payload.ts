import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';

export const payload = async () => getPayload({ config });
