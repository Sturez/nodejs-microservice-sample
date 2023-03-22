import Link from 'next/link';

const Header = ({ currentUser }) => {

    const links = [
        !currentUser && { label: "Sign Up", href: '/auth/signup' },
        !currentUser && { label: "Sign In", href: '/auth/signin' },
        currentUser && { label: "Sign Out", href: '/auth/signout' },
    ].filter(links => links)
        .map(({ label, href }) => {
            return (
                <Link key={href} href={href}>
                    <li>{label}</li>
                </Link>
            )
        });


    return (
        <nav className='navbar navbar-light bg-light'>
            <Link className='navbar-brand' href='/'>
                <span>GitTix</span>
            </Link>

            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>
                    {links}
                </ul>
            </div>
        </nav>
    );

};

export default Header;