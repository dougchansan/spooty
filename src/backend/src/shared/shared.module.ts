import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { ConfigModule } from '@nestjs/config';
import { StreamingService } from './streaming.service';
import { YoutubeService } from './youtube.service';
import { StreamingApiService } from './streaming-api.service';

@Module({
  imports: [ConfigModule],
  providers: [UtilsService, StreamingService, YoutubeService, StreamingApiService],
  controllers: [],
  exports: [UtilsService, StreamingService, YoutubeService, StreamingApiService],
})
export class SharedModule {}
