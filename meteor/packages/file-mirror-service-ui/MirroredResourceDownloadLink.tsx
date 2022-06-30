import * as React from 'react';

import { renderUIFragment, UIFragment } from '@moxb/react-html';
import { useMirroredFile } from './hook';

interface MirroredResourceDownloadLinkProps {
    /**
     * What file should we download?
     *
     * (We need this to identify our mirrored copy)
     */
    originalUrl: string;

    /**
     * What to display as part of the link?
     */
    child: UIFragment;

    /**
     * Optional spinner to display while waiting for into
     */
    spinner?: JSX.Element;
}

export const MirroredResourceDownloadLink = (props: MirroredResourceDownloadLinkProps): JSX.Element => {
    const { originalUrl, child, spinner } = props;
    const [pending, error, info] = useMirroredFile(originalUrl);
    if (pending) {
        return <span>{spinner} Preparing download link...</span>;
    } else if (error) {
        return <span className={'error-flag'}>{error}</span>;
    } else if (!info) {
        return <span className={'error-flag'}>File not found</span>;
    }
    const { link } = info;

    return (
        <a target="_blank" href={link}>
            {renderUIFragment(child)}
        </a>
    );
};
