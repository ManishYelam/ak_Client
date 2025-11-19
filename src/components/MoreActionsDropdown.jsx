import { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiTrash2, FiCopy, FiArchive, FiShare2, FiDownload } from "react-icons/fi";

const MoreActionsDropdown = ({ caseItem, onDelete, onClone, onArchive, onShare, onExport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action) => {
    switch (action) {
      case 'delete':
        if (window.confirm(`Are you sure you want to delete case ${caseItem.id}?`)) {
          onDelete([caseItem.id]);
        }
        break;
      case 'clone':
        onClone(caseItem);
        break;
      case 'archive':
        onArchive(caseItem.id);
        break;
      case 'share':
        onShare(caseItem);
        break;
      case 'export':
        onExport(caseItem);
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: FiCopy,
      label: "Clone Case",
      action: "clone",
      color: "text-gray-700 hover:bg-gray-100"
    },
    {
      icon: FiArchive,
      label: "Archive",
      action: "archive", 
      color: "text-gray-700 hover:bg-gray-100"
    },
    {
      icon: FiShare2,
      label: "Share",
      action: "share",
      color: "text-gray-700 hover:bg-gray-100"
    },
    {
      icon: FiDownload,
      label: "Export",
      action: "export",
      color: "text-gray-700 hover:bg-gray-100"
    },
    {
      icon: FiTrash2,
      label: "Delete",
      action: "delete",
      color: "text-red-600 hover:bg-red-50"
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-700 focus:outline-none p-1 rounded hover:bg-gray-100"
        aria-label="More options"
      >
        <FiMoreVertical size={14} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 py-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => handleAction(item.action)}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm ${item.color} transition-colors`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MoreActionsDropdown;