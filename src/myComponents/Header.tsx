import React from 'react'
import { ModeToggle } from './dark-theme/toggle-mode'
import { FaSearch } from "react-icons/fa";

const Header = () => {
    return (
        <div className='flex justify-between items-center p-4 dark:bg-[#1f1f1f]'>
            <div>
                <div className='flex gap-3 items-center'>
                    <img className='w-12' src="./logo/transparent-logo-header.png" alt="logo" />
                    <h1 className="text-3xl font-bold">
                        Crypto <span className="bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 bg-clip-text text-transparent">Flux</span>
                    </h1>
                </div>
            </div>

            <div>
                <div className="relative">
                    <input type="text" placeholder="Search" className="w-96 dark:text-gray-100 text-gray-500 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-100" />
                </div>
            </div>
            
            <div>
                <ModeToggle />
            </div>
        </div>
    )
}

export default Header