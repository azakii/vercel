import { useRouter } from 'next/router';
import Link from 'next/link';

const NavLink = ({
    href,
    exact,
    children,
    sameWindow = false,
    type,
    className = '',
    ...props
}) => {
    const { pathname } = useRouter();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    if (isActive) {
        className += ' pointer-events-none select-none';
    }
    return isActive ? (
        <div {...props} className={className}>
            {children(isActive)}
        </div>
    ) : type === 'url' ? (
        <a
            href={href}
            {...props}
            className={className}
            target={sameWindow ? '_self' : '_blank'}>
            {children(isActive)}
        </a>
    ) : (
        (<Link href={href} {...props} className={className}>

            {children(isActive)}

        </Link>)
    );
};

export default NavLink;
