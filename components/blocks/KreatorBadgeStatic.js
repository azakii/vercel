import React from 'react';

import Link from 'next/link';

import KreatorBadgeStaticFlat from './KreatorBadgeStaticFlat';
import classNames from 'classnames';

const KreatorBadgeStatic = (props) => {
    const {
        author,
        author: { username },
        avatarOnly
    } = props;
    return <>
        {author && (
            <>
                <Link href={`/experiences/user/${username}/all`}>

                    <KreatorBadgeStaticFlat {...props} />

                </Link>
            </>
        )}
    </>;
};

export default KreatorBadgeStatic;
