import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div>
            <Header />
            <main className='min-h-screen w-full'>{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;