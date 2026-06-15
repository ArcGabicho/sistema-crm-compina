import { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';

function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/50 backdrop-blur-md shadow-md border-b border-white/20' 
                : 'bg-white border-b border-gray-200'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    {/* Logo */}
                    <div className="shrink-0">
                        <a href="/" className="flex items-center">
                            <img 
                                src="/images/logonavbar.webp" 
                                alt="Logo" 
                                className="h-8 w-auto"
                            />
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            <a href="/" className="text-gray-600 hover:text-orange-500 px-2 py-1 text-sm font-medium transition-colors duration-200">
                                Inicio
                            </a>
                            <a href="/nosotros" className="text-gray-600 hover:text-orange-500 px-2 py-1 text-sm font-medium transition-colors duration-200">
                                Nosotros
                            </a>
                            <a href="/productos" className="text-gray-600 hover:text-orange-500 px-2 py-1 text-sm font-medium transition-colors duration-200">
                                Productos
                            </a>
                            <a href="/catalogo" className="text-gray-600 hover:text-orange-500 px-2 py-1 text-sm font-medium transition-colors duration-200">
                                Catálogo
                            </a>
                            <a href="/contacto" className="text-gray-600 hover:text-orange-500 px-2 py-1 text-sm font-medium transition-colors duration-200">
                                Contacto
                            </a>
                        </div>
                    </div>

                    {/* Contact Info - Desktop */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <a 
                            href="tel:+51932230880" 
                            className="flex items-center text-gray-800 hover:text-orange-500 text-xs font-medium transition-colors duration-200"
                        >
                            <Phone className="w-3 h-3 mr-2 shrink-0" />
                            (51) 932 230 880
                        </a>
                        <a 
                            href="mailto:ventas@compipro.net" 
                            className="flex items-center text-gray-800 hover:text-orange-500 text-xs font-medium transition-colors duration-200"
                        >
                            <Mail className="w-3 h-3 mr-2 shrink-0" />
                            ventas@compipro.net
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            onClick={toggleMobileMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-orange-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-orange-400 transition-colors duration-200"
                        >
                            {isMobileMenuOpen ? (
                                <X className="block h-5 w-5" />
                            ) : (
                                <Menu className="block h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`lg:hidden transition-all duration-300 ease-in-out ${
                isMobileMenuOpen 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
                <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-gray-200">
                    <a 
                        href="/" 
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Inicio
                    </a>
                    <a 
                        href="/nosotros" 
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Nosotros
                    </a>
                    <a 
                        href="/productos" 
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Productos
                    </a>
                    <a 
                        href="/catalogo" 
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Catálogo
                    </a>
                    <a 
                        href="/contacto" 
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Contacto
                    </a>
                    
                    {/* Contact Info - Mobile */}
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                        <a 
                            href="tel:+51932230880" 
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Phone className="w-4 h-4 mr-3 shrink-0" />
                            (51) 932 230 880
                        </a>
                        <a 
                            href="mailto:ventas@compipro.net" 
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-800 hover:text-orange-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Mail className="w-4 h-4 mr-3 shrink-0" />
                            ventas@compipro.net
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
