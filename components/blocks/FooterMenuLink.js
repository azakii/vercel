import Link from 'next/link';
const FooterMenuLink = ({ url, label }) => {
    return (
        <li className="list-none">
            <Link href={url} className="hover:underline">
                {label}
            </Link>
        </li>
    );
};

export default FooterMenuLink;
