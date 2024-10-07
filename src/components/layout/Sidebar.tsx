import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  items: Array<{ label: string; route: string }>
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const location = useLocation()

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav>
        <ul>
          {items.map((item) => (
            <li key={item.route} className="mb-2">
              <Link
                to={item.route}
                className={`block p-2 rounded hover:bg-gray-700 ${
                  location.pathname === item.route ? 'bg-gray-700' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar