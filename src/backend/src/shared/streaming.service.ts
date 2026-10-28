import { Injectable, Logger } from '@nestjs/common';
import { TrackService } from '../track/track.service';
import { StreamingApiService } from './streaming-api.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('isomorphic-unfetch');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDetails } = require('spotify-url-info')(fetch);

@Injectable()
export class StreamingService {
  private readonly logger = new Logger(TrackService.name);

  constructor(private readonly streamingApiService: StreamingApiService) {}

  isTrackUrl(url: string): boolean {
    return this.streamingApiService.isTrackUrl(url);
  }

  async getTrackDetail(
    streamingUrl: string,
  ): Promise<{ name: string; artist: string; image: string }> {
    this.logger.debug(`Get track ${streamingUrl} on the streaming service`);
    try {
      return await this.streamingApiService.getTrackMetadata(streamingUrl);
    } catch (error) {
      this.logger.error(`Error getting track details: ${error.message}`);
      const detail = await getDetails(streamingUrl);
      return {
        name: detail.preview.title,
        artist: detail.preview.artist || 'Unknown Artist',
        image: detail.preview.image,
      };
    }
  }

  async getPlaylistDetail(
    streamingUrl: string,
  ): Promise<{ name: string; tracks: any[]; image: string }> {
    this.logger.debug(`Get playlist ${streamingUrl} on the streaming service`);

    try {
      const metadata =
        await this.streamingApiService.getPlaylistMetadata(streamingUrl);

      const tracks =
        await this.streamingApiService.getAllPlaylistTracks(streamingUrl);

      return {
        name: metadata.name,
        tracks: tracks || [],
        image: metadata.image,
      };
    } catch (error) {
      this.logger.error(`Error getting playlist details: ${error.message}`);
      const detail = await getDetails(streamingUrl);
      return {
        name: detail.preview.title,
        tracks: detail?.tracks ?? [],
        image: detail.preview.image,
      };
    }
  }

  async getPlaylistTracks(streamingUrl: string): Promise<any[]> {
    this.logger.debug(`Get playlist ${streamingUrl} on the streaming service`);
    try {
      return await this.streamingApiService.getAllPlaylistTracks(streamingUrl);
    } catch (error) {
      this.logger.error(`Error getting playlist tracks: ${error.message}`);
      return (await getDetails(streamingUrl)?.tracks) ?? [];
    }
  }
}
