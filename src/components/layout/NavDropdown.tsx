import { Link } from "react-router-dom";
import type { SubMenuItem } from "@/data/navigationData";

interface NavDropdownProps {
  subItems: SubMenuItem[];
  isHovered?: boolean;
}

export function NavDropdown({ subItems, isHovered = false }: NavDropdownProps) {
  if (subItems.length === 0) return null;

  return (
    <div className="absolute left-0 top-full z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto py-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="block p-3 text-gray-700 hover:text-brandGreen hover:bg-gray-50 rounded"
            >
              <div className="font-medium">{item.title}</div>
              {item.description && (
                <div className="text-sm text-gray-500 mt-1">
                  {item.description}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
