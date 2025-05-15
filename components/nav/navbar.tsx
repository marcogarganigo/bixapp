import React, { useMemo, useContext, useState, useEffect } from 'react';
import GenericComponent from '../genericComponent';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { LogOut, User, Lock } from 'lucide-react';
import { useRecordsStore } from '@/utils/stores/store';
import { useRouter } from 'next/navigation';

const isDev = false;
    interface PropsInterface {
        exampleVaue?: string;
    }

    interface ResponseInterface {
      responseExampleValue: string;
    }

export default function NavBar() {
    //
    const responseDataDEV: ResponseInterface = {
    responseExampleValue: "Example"
    };

    const responseDataDEFAULT: ResponseInterface = {
    responseExampleValue: "Default"
    };

    const { user, handleLogout } = useRecordsStore()

    interface NavigationItem {
        name: string;
        href: string;
        current: boolean;
    }
    
    const navigation: NavigationItem[] = [
        //{ name: 'Dashboard', href: '#', current: true },
        //{ name: 'Team', href: '#', current: false },
        //{ name: 'Projects', href: '#', current: false },
        //{ name: 'Calendar', href: '#', current: false },
    ]
    
    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    }                    

    const [responseData, setResponseData] = useState<ResponseInterface>(isDev ? responseDataDEV : responseDataDEFAULT);

    const { response, loading, error } = { response: null, loading: false, error: null };

    const router = useRouter();

    const LogoutFunction = async () => {      
        await handleLogout();
        router.push('/login');
    }


    return (
        <GenericComponent response={responseData} loading={loading} error={error}> 
            {(data: ResponseInterface) => (
                <div>
                    
        <Disclosure id="navbar" as="nav" className="relative bg-navbar shadow-black w-full h-16" data-headless-ui-state="">
            <div className="relative mx-auto w-full px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        aria-current={item.current ? 'page' : undefined}
                                        className={classNames(
                                            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute z-90 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                    <span className="absolute -inset-1.5" />
                                    <span className="sr-only">Open user menu</span>
                                    <User className="w-8 h-8 text-gray-700" />
                                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-gradient-to-br from-indigo-200 to-green-500 rounded-full border-2 border-gray-800 shadow-lg"></div>
                                </MenuButton>
                            </div>
                            <MenuItems
                                transition
                                className="absolute right-0  mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                            >
                                <MenuItem>
                                    <div className="px-4 py-3 border-b border-gray-700/50">
                                        <p className="text-sm font-medium text-black">{user}</p>
                                        <p className="text-xs text-gray-7000">Utente attivo</p>
                                    </div>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                                        onClick={() => router.push('/changePassword')}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Lock className="w-4 h-4" />
                                            <span>Cambia password</span>
                                        </div>
                                    </a>
                                </MenuItem>
                                <MenuItem>
                                    <a
                                        onClick={() => LogoutFunction()}
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                                    >
                                        <div className="flex items-center gap-2">
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </div>
                                    </a>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                        
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={item.current ? 'page' : undefined}
                            className={classNames(
                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
                    
                </div>
            )}
        </GenericComponent>
    );
};
