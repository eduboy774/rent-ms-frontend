import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation } from "react-router";

import {
  ChevronDownIcon,
  GridIcon,
  BoxCubeIcon,
  FileIcon,
  CalenderIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useUserContext } from "../store/userContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/home",
  },
  {
    name: "Management",
    icon: <BoxCubeIcon />,
    subItems: [
      { name: "Houses", path: "/houses" },
      { name: "Tenants", path: "/renters" },
    ],
  },
  {
    name: "Rental",
    icon: <FileIcon />,
    subItems: [
      { name: "House Rentals", path: "/house-rentals" },
      { name: "Payments", path: "/payments" },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
  {
    name: "Administration",
    icon: <UserCircleIcon />,
    subItems: [
      { name: "Houses owner", path: "/users" },
      { name: "My Profile", path: "/profile" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { userProfileAndRoleData } = useUserContext();
  
  const isAdmin = userProfileAndRoleData?.data?.userProfile?.profileType === 'ADMIN_PROFILE';

  const filteredNavItems = useMemo(() => {
    return navItems.map(item => {
      if (item.name === 'Administration') {
        return {
          ...item,
          subItems: item.subItems?.filter(sub => 
            sub.path !== '/users' || isAdmin
          )
        };
      }
      return item;
    });
  }, [isAdmin]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === "main" && prev.index === index) {
        return null;
      }
      return { type: "main", index };
    });
  };

  const sidebarOpen = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900
        ${
          isExpanded || isMobileOpen
            ? "w-[280px]"
            : isHovered
            ? "w-[280px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo / Brand */}
      <div className="flex h-[72px] items-center border-b border-gray-200 px-5 dark:border-gray-800">
        <Link to="/home" className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          {sidebarOpen && (
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              Rent<span className="text-orange-500">MS</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5 no-scrollbar">

        <ul className="flex flex-col gap-1">
          {filteredNavItems.map((nav, index) => (
            <li key={nav.name}>
              {nav.subItems ? (
                /* Collapsible parent */
                <button
                  onClick={() => handleSubmenuToggle(index)}
                  className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    openSubmenu?.type === "main" && openSubmenu?.index === index
                      ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  } ${!isExpanded && !isHovered ? "lg:justify-center" : ""}`}
                >
                  <span
                    className={`shrink-0 [&>svg]:!size-5 ${
                      openSubmenu?.type === "main" &&
                      openSubmenu?.index === index
                        ? "text-orange-500 dark:text-orange-400"
                        : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{nav.name}</span>
                      <ChevronDownIcon
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          openSubmenu?.type === "main" &&
                          openSubmenu?.index === index
                            ? "rotate-180 text-orange-500"
                            : "text-gray-400"
                        }`}
                      />
                    </>
                  )}
                </button>
              ) : (
                /* Direct link */
                nav.path && (
                  <Link
                    to={nav.path}
                    className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive(nav.path)
                        ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                    } ${!isExpanded && !isHovered ? "lg:justify-center" : ""}`}
                  >
                    <span
                      className={`shrink-0 [&>svg]:!size-5 ${
                        isActive(nav.path)
                          ? "text-orange-500 dark:text-orange-400"
                          : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {sidebarOpen && <span>{nav.name}</span>}
                  </Link>
                )
              )}

              {/* Sub-menu */}
              {nav.subItems && sidebarOpen && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[`main-${index}`] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu?.type === "main" &&
                      openSubmenu?.index === index
                        ? `${subMenuHeight[`main-${index}`]}px`
                        : "0px",
                  }}
                >
                  <ul className="mt-1 ml-5 space-y-0.5 border-l-2 border-gray-200 pl-4 dark:border-gray-700">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                            isActive(subItem.path)
                              ? "bg-orange-50 font-medium text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      {sidebarOpen && (
        <div className="border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Rental MS
          </p>
        </div>
      )}
    </aside>
  );
};

export default AppSidebar;
