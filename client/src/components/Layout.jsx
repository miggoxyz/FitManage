import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  WrenchIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { jwtDecode as decode } from "jwt-decode";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useNavigate, useLocation } from "react-router-dom";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Team", href: "/team", icon: UserGroupIcon },
  { name: "Jobs", href: "/jobs", icon: BriefcaseIcon },
  { name: "Remedials", href: "/remedials", icon: WrenchIcon },
  { name: "Calendar", href: "/calendar", icon: CalendarIcon },
  { name: "Customers", href: "/customers", icon: CalendarIcon },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decode(token);
      if (decoded.name) {
        setUserName(decoded.name);
        setUserInitial(decoded.name.charAt(0).toUpperCase());
      } else {
        setUserName("Unknown User");
        setUserInitial("?");
      }
    }
  }, []);

  const currentNavItem = navigationItems.find(
    (item) => item.href === location.pathname
  );

  return (
    <>
      <div>
        {/* Mobile Header */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-indigo-600 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-indigo-200"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            {currentNavItem ? currentNavItem.name : "Dashboard"}
          </div>
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-700 text-white">
            {userInitial}
          </div>
        </div>

        {/* Mobile Sidebar */}
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />
          <div className="fixed inset-0 flex">
            <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out bg-indigo-600">
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2">
                <div className="flex h-16 shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus/img/logos/mark.svg?color=white"
                    className="h-8 w-auto"
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigationItems.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(item.href);
                                setSidebarOpen(false);
                              }}
                              className={classNames(
                                item.href === location.pathname
                                  ? "bg-indigo-700 text-white"
                                  : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  item.href === location.pathname
                                    ? "text-white"
                                    : "text-indigo-200 group-hover:text-white",
                                  "h-6 w-6 shrink-0"
                                )}
                              />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Desktop Sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600">
            {/* User Profile Section */}
            <div className="flex items-center px-6 py-4">
              <a
                href="/settings"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/settings");
                }}
                className="flex items-center gap-x-4 px-4 py-2 text-sm font-semibold leading-6 text-white hover:bg-indigo-700 w-full rounded-lg"
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-800 text-white">
                  {userInitial}
                </div>
                <span aria-hidden="true">{userName}</span>
              </a>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-2 px-2">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.href);
                      }}
                      className={classNames(
                        item.href === location.pathname
                          ? "bg-indigo-700 text-white"
                          : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          item.href === location.pathname
                            ? "text-white"
                            : "text-indigo-200 group-hover:text-white",
                          "h-6 w-6 shrink-0"
                        )}
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:pl-72">
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
