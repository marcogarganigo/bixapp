import React, { useMemo, useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { useApi } from '@/utils/useApi';
import GenericComponent from '../genericComponent';
import { Home, Package, Mail, ChevronDown, ChevronUp, HelpCircle, Menu, X, LucideIcon } from 'lucide-react';
import { useRecordsStore } from '@/utils/stores/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// FLAG PER LO SVILUPPO
const isDev = false;

// INTERFACCE
interface PropsInterface {
}

interface ResponseInterface {
    menuItems: Record<string, MenuItem>;
    otherItems: SubItem[];
}

interface SubItem{
    id: string;
    title: string;
    href: string;
}

interface MenuItem {
    id: string;
    title: string;
    icon: string;
    href?: string;
    subItems?: SubItem[];
}

// Mappa delle icone
const iconMap: Record<string, LucideIcon> = {
    'Home': Home,
    'Package': Package,
    'Mail': Mail,
};

export default function Sidebar({  }: PropsInterface) {
    const devPropExampleValue = isDev ? "" : "";

    const responseDataDEFAULT: ResponseInterface = {
        menuItems: {},
        otherItems: []
    };

    const responseDataDEV: ResponseInterface = {
        menuItems: {
            home: {
                id: "home",
                title: "Home",
                icon: "Home",
                href: "#",
                subItems: [],
            },
            prodotti: {
                id: "prodotti",
                title: "Prodotti",
                icon: "Package",
                subItems: [
                    { id: "cat1", title: "Categoria 1", href: "#" },
                    { id: "cat2", title: "Categoria 2", href: "#" },
                    { id: "cat3", title: "Categoria 3", href: "#" },
                    { id: "cat4", title: "Categoria 4", href: "#" },
                ],
            },
            contatti: {
                id: "contatti",
                title: "Contatti",
                icon: "Mail",
                href: "#",
                subItems: [],
            },
        },
        otherItems: []
    };

    const [openDropdown, setOpenDropdown] = useState('');
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const {setSelectedMenu, activeServer} = useRecordsStore();

    const {  } = useRecordsStore();

    const handleMouseEnter = (section: string) => {
        setActiveTooltip(section);
    };

    const handleMouseLeave = () => {
        setActiveTooltip(null);
    };

    const handleMenuClick = (item: string) => {
        setSelectedMenu(item);
        setIsSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [responseData, setResponseData] = useState<ResponseInterface>(isDev ? responseDataDEV : responseDataDEFAULT);

    const payload = useMemo(() => {
        if (isDev) return null;
        return {
            apiRoute: 'get_sidebarmenu_items',
        };
    }, []);
    
    const { response, loading, error, elapsedTime  } = !isDev && payload ? useApi<ResponseInterface>(payload) : { response: null, loading: false, error: null, elapsedTime: null };

    useEffect(() => {
        if (!isDev && response && JSON.stringify(response) !== JSON.stringify(responseData)) {
            setResponseData(response);
        }
    }, [response, responseData]);

    return (
        <GenericComponent response={responseData} loading={loading} error={error} title="Sidebar" elapsedTime={elapsedTime}> 
            {(data) => (
                <>
                    <button 
                        onClick={toggleSidebar} 
                        className="fixed top-4 left-4 z-110 p-2 bg-black text-white rounded-md shadow-lg hover:bg-gray-700 transition-all duration-300 sm:block cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        <div className="relative w-6 h-6">
                            <Menu 
                                size={24} 
                                className={`absolute top-0 left-0 transition-all duration-300 ${isSidebarOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} 
                            />
                            <X 
                                size={24} 
                                className={`absolute top-0 left-0 transition-all duration-300 ${isSidebarOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`} 
                            />
                        </div>
                    </button>

                    {/* Overlay for closing sidebar when clicking outside (mobile only) */}
                    {isSidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-transparent bg-opacity-50 z-40 lg:hidden"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    <div 
                        id="sidebar" 
                        className={`overflow-auto fixed top-0 left-0 bg-black text-white h-full w-64 transition-all duration-300 rounded-r-xl shadow-lg z-100 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <div className="py-6 px-4">
                            <Image 
                                src={`/imgs/bixdata.png`}
                                alt={activeServer ?? ''}
                                width={1000}
                                height={1000}
                                className="h-16 w-auto m-auto hover:cursor-pointer hover:scale-105 hover:translate-y-1 transition-all ease-in-out duration-150"
                                onClick={() => window.location.reload()}
                            />
                        </div>

                        <ul className="list-none p-0 m-0">
                            {Object.entries(data['menuItems']).map(([key, item]) => {
                                const Icon = iconMap[item.icon] || HelpCircle;
                                return (
                                    <li key={item.id} className="px-4 py-2">
                                        {item.subItems ? (
                                            // Dropdown section
                                            <div>
                                                <button 
                                                    onClick={() => setOpenDropdown(openDropdown === item.id ? '' : item.id)} 
                                                    className="w-full text-md flex items-center justify-between px-6 py-2 hover:bg-gray-700 rounded-md transition-colors"
                                                >
                                                    <div className="flex items-center">
                                                        <Icon className="w-5 h-5" />
                                                        <span className="text-md ml-3">{item.title}</span>
                                                    </div>
                                                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openDropdown === item.id ? '-rotate-180' : ''}`} />
                                                </button>

                                                {/* Dropdown menu */}
                                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openDropdown === item.id ? 'max-h-96' : 'max-h-0'}`}>
                                                    <ul className="py-1 ml-6">
                                                        {item.subItems.map((subItem) => (
                                                            <li key={subItem.id} className='cursor-pointer'>
                                                                <span 
                                                                    className="text-gray-200 text-sm block px-6 py-2 hover:bg-gray-700 rounded-md transition-colors ml-2" 
                                                                    onClick={() => handleMenuClick(subItem.id)}
                                                                >
                                                                    {subItem.title}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <a 
                                                href={item.href} 
                                                className="flex items-center px-6 py-2 hover:bg-gray-700 rounded-md transition-colors"
                                                onClick={() => item.id && handleMenuClick(item.id)}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="ml-3">{item.title}</span>
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </>
            )}
        </GenericComponent>
    );
}