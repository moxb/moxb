import * as React from 'react';
import type { CSSProperties } from 'react';

import { useMirroredFile } from './hook';

interface MirroredImageLinkProps {
    /**
     * Where is the original image?
     *
     * (We will use this URL to identify our mirrored copy)
     */
    originalUrl: string;

    // ========= Standard image attributes ======
    width?: number | string;
    height?: number | string;
    alt?: string;
    title?: string;
    className?: string;
    style?: CSSProperties;

    /**
     * Why do we need this image?
     *
     * (This is only used for debugging.)
     */
    reason: string;

    /**
     * Optional: what spinner to use while waiting for info about the image?
     *
     * If not specified, we will simply use a ...
     */
    spinner?: JSX.Element;
}

/**
 * Widget for displaying a mirrored image
 */
export const MirroredImage = (props: MirroredImageLinkProps): JSX.Element => {
    const { originalUrl, reason, spinner, ...rest } = props;
    const [pending, error, info] = useMirroredFile(originalUrl);
    if (pending) {
        return spinner || <span>...</span>;
    } else {
        if (error) {
            return <span className={'error-flag'}>{error}</span>;
        } else if (!info) {
            return <span className={'error-flag'}>Image not found</span>;
        } else {
            return <img src={info.link} {...rest} />;
        }
    }
};
