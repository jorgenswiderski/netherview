import React from 'react';
import axios from 'axios';
import { CONFIG } from '../../models/config';
import { error, log } from '../../models/logger';
import { WeaveBaseRoute } from './weave-route-base';

class WeaveImage extends WeaveBaseRoute {
    constructor() {
        super('/images');
    }

    private imageCache: Record<string, { width: number; preload: boolean }> =
        {};
    private needsSizeUpdate: Record<string, true> = {};

    getPath(imageName: string, width: number): string;
    getPath(
        imageName: string,
        ref: React.RefObject<HTMLElement>,
        cover?: boolean,
        percent?: number,
    ): string;
    getPath(
        imageName: string,
        widthOrRef: number | React.RefObject<HTMLElement>,
        cover: boolean = false,
        percent: number = 100,
    ): string {
        let width: number;

        if (typeof widthOrRef === 'number') {
            width = Math.ceil(widthOrRef);
        } else if (widthOrRef.current) {
            const { offsetWidth, offsetHeight } = widthOrRef.current;

            width = Math.ceil(
                (cover ? Math.max(offsetHeight, offsetWidth) : offsetWidth) *
                    (percent / 100),
            );
        } else {
            return '';
        }

        if (this.needsSizeUpdate[imageName]) {
            this.updateImageSize(imageName, width)
                .then(() => {
                    delete this.needsSizeUpdate[imageName];
                })
                .catch(error);
        }

        const cache = this.imageCache[imageName];

        if (cache?.width && cache.width >= width) {
            if (cache.preload) {
                return `${CONFIG.WEAVE.BASE_IMAGE_URL}/${imageName}?p=post`;
            }

            width = cache.width;
        } else {
            if (cache?.width && cache.preload) {
                // Image was preloaded at the wrong size, tell the server
                this.updateImageSize(imageName, width).catch(error);
            }

            this.imageCache[imageName] = { width, preload: false };
        }

        return `${CONFIG.WEAVE.BASE_IMAGE_URL}/${imageName}?w=${width}`;
    }

    async preloadImage(imageName: string): Promise<void> {
        const url = `${CONFIG.WEAVE.BASE_IMAGE_URL}/${imageName}?p=pre`;

        try {
            // Make "images/preload" response to the server to get the remote URL and the "unknown size" header.
            // Set needsSizeUpdate accordingly, and preload the image with the Image class

            const response = await axios({
                url,
            });

            if (response.status >= 200 && response.status < 300) {
                const { remote, isUnknownSize } = response.data as {
                    remote: string;
                    isUnknownSize: boolean;
                };

                const img = new Image();

                img.onload = () => {
                    if (isUnknownSize) {
                        this.needsSizeUpdate[imageName] = true;
                    }

                    const cache = this.imageCache[imageName];

                    if (!cache || cache.width < img.width) {
                        this.imageCache[imageName] = {
                            width: img.width,
                            preload: true,
                        };
                    }
                };

                img.src = remote;
            } else {
                log(`Failed to preload image ${imageName}`);
            }
        } catch (err) {
            // Failed request will be logged automatically, no need to double log
        }
    }

    async updateImageSize(imageName: string, width: number): Promise<void> {
        try {
            await this.fetchFromApi(`/resize/${imageName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({ width }),
            });
        } catch (err) {
            error('Failed to update image size on server:', err);
        }
    }
}

export const WeaveImages = new WeaveImage();
