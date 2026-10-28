[![GitHub License](https://img.shields.io/github/license/dougchansan/spooty)](https://github.com/dougchansan/spooty/blob/main/LICENSE.md)
[![GitHub Repo stars](https://img.shields.io/github/stars/dougchansan/spooty)](https://github.com/dougchansan/spooty)
[![GitHub last commit](https://img.shields.io/github/last-commit/dougchansan/spooty)](https://github.com/dougchansan/spooty/commits/main)

# Spooty - selfhosted music downloader
> [!WARNING]
> **Disclaimer:** Spooty is an independent, unofficial project. It is not affiliated with, endorsed by, sponsored by, or in any way connected to Spotify AB or any of its subsidiaries or affiliates. "Spotify" is a registered trademark of Spotify AB and is not used here to indicate any association.

Spooty is a self-hosted music downloader.
It allows download track/playlist/album from a streaming-service URL.
It can also subscribe to a playlist or author page and download new songs upon release.
Spooty does not download anything from the streaming service itself; it only reads track information and then finds relevant music on Youtube.
The project is based on NestJS and Angular.

> [!IMPORTANT]
> Please do not use this tool for piracy! Download only music you own rights! Use this tool only on your responsibility.

### Content
- [🚀 Installation](#-installation)
  - [Docker](#docker)
    - [Docker command](#docker-command)
    - [Docker compose](#docker-compose)
  - [Build from source](#build-from-source)
    - [Process](#requirements)
    - [Requirements](#process)
  - [Environment variables](#environment-variables)
- [⚖️ License](#-license)

## 🚀 Installation
Recommended and the easiest way how to start to use of Spooty is using docker.

> [!NOTE]
> This fork does not require a developer application or API credentials. It reads playlist
> metadata anonymously, so there is nothing to configure.

### Docker

This fork does not publish an image to Docker Hub, so build it locally first:

```shell
git clone https://github.com/dougchansan/spooty.git
cd spooty
docker build -t spooty .
```

For detailed configuration, see available [environment variables](#environment-variables).

#### Docker command
```shell
docker run -d -p 3000:3000 \
  -v /path/to/downloads:/spooty/backend/downloads \
  -v /path/to/cookies.txt:/spooty/cookies.txt:ro \
  spooty
```

#### Docker compose
```yaml
services:
  spooty:
    image: spooty
    container_name: spooty
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - /path/to/downloads:/spooty/backend/downloads
      - /path/to/cookies.txt:/spooty/cookies.txt:ro
    environment:
      # Configure other environment variables if needed
      - DOWNLOAD_CONCURRENCY=2
```

### Build from source

Spooty can be also build from source files on your own.

#### Requirements
- Node v20.20.0 (it is recommended to use `nvm` node version manager to install proper version of node)
- Redis in memory cache
- Ffmpeg
- Python3

#### Process
- install Node v20.20.0 using `nvm install` and use that node version `nvm use`
- from project root install all dependencies using `npm install`
- copy `.env.default` as `.env` in `src/backend` folder and modify desired environment properties (see [environment variables](#environment-variables))
- build source files `npm run build`
    - built project will be stored in `dist` folder
- start server `npm run start`

### Environment variables

Some behaviour and settings of Spooty can be configured using environment variables and `.env` file.

> [!IMPORTANT]
> `DOWNLOAD_CONCURRENCY`, `DOWNLOAD_GAP_MS` and `SEARCH_CONCURRENCY` are the
> exception: they are read at module-import time, before the `.env` file is
> loaded, so putting them in `.env` has no effect. Pass them as real environment
> variables (`docker run -e ...`, compose `environment:`, or `export`). All
> other variables in this table work in `.env` as usual.

 Name                 | Default                                     | Description                                                                                                                                   |
----------------------|---------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
 DB_PATH              | `./config/db.sqlite` (relative to backend)  | Path where Spooty database will be stored                                                                                                     |
 FE_PATH              | `../frontend/browser` (relative to backend) | Path to frontend part of application                                                                                                          |
 DOWNLOADS_PATH       | `./downloads` (relative to backend)         | Path where downaloded files will be stored                                                                                                    |
 FORMAT               | `mp3`                                       | Format of downloaded files ('aac', 'flac', 'mp3', 'm4a', 'opus', 'vorbis', 'wav', 'alac')                                                     |
 QUALITY              | undefined                                   | Audio quality (0-9 VBR or specific bitrate) of downloaded files                                                                               |
 PORT                 | 3000                                        | Port of Spooty server                                                                                                                         |
 REDIS_PORT           | 6379                                        | Port of Redis server                                                                                                                          |
 REDIS_HOST           | localhost                                   | Host of Redis server                                                                                                                          |
 REDIS_RUN            | false                                       | Whenever Redis server should be started from backend (recommended for Docker environment)                                                     |
 DOWNLOAD_CONCURRENCY | 2                                           | How many downloads may run at once. Raising this makes YouTube rate limiting much more likely.                                                 |
 DOWNLOAD_GAP_MS      | 3000                                        | Minimum milliseconds between the start of one download and the next. Together with the above this caps throughput at ~20 downloads/min.        |
 SEARCH_CONCURRENCY   | 3                                           | How many YouTube searches may run at once.                                                                                                    |

> [!WARNING]
> YouTube rate-limits a session for up to an hour after roughly 100 rapid
> downloads, and tracks that fail this way stay in an error state until they are
> retried. The defaults above are deliberately conservative for that reason.
> Raise them only if you are willing to trade stalled downloads for speed.

### How to supply your YouTube cookies

Some downloads are restricted unless the request is authenticated. Spooty passes
a cookies file straight to `yt-dlp`, which expects **Netscape format** — not the
`name=value; name=value` string used by older versions of these instructions.

1. Install a "cookies.txt" browser extension that exports in Netscape format.
2. Go to https://www.youtube.com and log in if needed.
3. Export the cookies for that domain to a file named `cookies.txt`.
4. Mount that file into the container at `/spooty/cookies.txt`, as shown in the
   [Docker](#docker) examples above.

> [!CAUTION]
> This file contains live Google account session cookies, not just YouTube ones.
> Anyone who obtains it can access your Google account without a password.
> Store it outside your repository, never commit it, never paste its contents
> into a chat, issue, or web form, and mount it read-only (`:ro`) so the
> container cannot modify it. Prefer exporting from a throwaway Google account.
> Bake it into an image only if you are certain that image will never be shared —
> image layers preserve it even if a later layer deletes the file.

# ⚖️ License
[MIT](https://choosealicense.com/licenses/mit/)
