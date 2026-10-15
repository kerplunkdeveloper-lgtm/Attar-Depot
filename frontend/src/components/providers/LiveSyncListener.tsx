'use client';

import { useGlobalDataSync } from '@/lib/dataSync';

export default function LiveSyncListener() {
  useGlobalDataSync();
  return null;
}
