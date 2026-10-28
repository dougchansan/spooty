export interface Playlist {
  id: number;
  name?: string;
  streamingUrl: string;
  error?: string;
  active: boolean;
  isTrack?: boolean;
  createdAt: number;
}
