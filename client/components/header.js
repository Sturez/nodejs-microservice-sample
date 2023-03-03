import Link from 'next/link';

const Header = ({ currenUser: currentUser }) => {

    const links = [
        !currentUser && { label: "Sign Up", href: '/auth/signup' },
        !currentUser && { label: "Sign In", href: '/auth/signin' },
        currentUser && { label: "Sign Out", href: '/auth/signout' },
    ].filter(links => links)
        .map(({ label, href }) => {
            return (
                <Link href={href}>
                    <li key={href} >{label}</li>
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