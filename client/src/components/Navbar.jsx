import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import assets from '../assets/assets.js'

const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200/60">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Brand (left) */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center">
                            <img src={assets.Navlogo} alt="FlexiTool Logo" className="h-16 w-auto" />
                        </Link>
                    </div>

                    {/* Primary nav - centered (desktop) */}
                    <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/tools', label: 'Tools' },
                            { to: '/about', label: 'About' },
                            { to: '/contact', label: 'Contact' },
                        ].map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            to="/tools"
                            className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md transition-all"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {/* Primary links */}
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/tools', label: 'Tools' },
                            { to: '/about', label: 'About' },
                            { to: '/contact', label: 'Contact' },
                        ].map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        {/* Get Started */}
                        <Link
                            to="/tools"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar