import { useState } from "react";

const Card = ({ 
  children, 
  className = "", 
  hover = true, 
  padding = "p-6",
  shadow = "shadow-sm",
  border = "border border-gray-200",
  backgroundColor = "bg-white",
  onClick,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    rounded-xl
    ${backgroundColor}
    ${border}
    ${shadow}
    ${padding}
    transition-all
    duration-300
    ${hover ? 'hover:shadow-lg' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div
      className={baseClasses}
      onMouseEnter={() => hover && setIsHovered(true)}
      onMouseLeave={() => hover && setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Specialized Card Variants
export const DocumentCard = ({ 
  document,
  selected = false,
  onSelect,
  onFavorite,
  onDownload,
  onShare,
  onDelete,
  className = "" 
}) => {
  const getFileIcon = (type) => {
    const iconConfig = {
      "PDF": { color: "text-red-600 bg-red-100", label: "PDF" },
      "DOCX": { color: "text-blue-600 bg-blue-100", label: "DOC" },
      "ZIP": { color: "text-purple-600 bg-purple-100", label: "ZIP" },
      "XLSX": { color: "text-green-600 bg-green-100", label: "XLS" },
      "PPTX": { color: "text-orange-600 bg-orange-100", label: "PPT" },
      "JPG": { color: "text-pink-600 bg-pink-100", label: "JPG" },
      "PNG": { color: "text-pink-600 bg-pink-100", label: "PNG" }
    };

    const config = iconConfig[type] || { color: "text-gray-600 bg-gray-100", label: "FILE" };

    return (
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}>
        <span className="font-bold text-sm">{config.label}</span>
      </div>
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      "Verified": "bg-green-100 text-green-800 border-green-200",
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Rejected": "bg-red-100 text-red-800 border-red-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Card 
      className={`
        transform transition-all duration-300
        ${selected ? 'border-blue-500 ring-2 ring-blue-100 scale-[1.02]' : 'border-gray-100'}
        hover:shadow-xl hover:-translate-y-1
        ${className}
      `}
      hover={true}
    >
      {/* Header with selection and actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          {getFileIcon(document.type)}
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.();
            }}
            className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
          >
            {document.favorite ? (
              <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          </button>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(document.status)}`}>
            {document.status}
          </span>
        </div>
      </div>
      
      {/* Document Content */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">
          {document.name}
        </h3>
        <p className="text-sm text-gray-600 mb-1">{document.category}</p>
        {document.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mt-1">
            {document.description}
          </p>
        )}
      </div>

      {/* Tags */}
      {document.tags && document.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {document.tags.slice(0, 2).map((tag, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {document.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
              +{document.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <div className="flex justify-between">
          <span>Size:</span>
          <span className="font-medium">{document.size}</span>
        </div>
        <div className="flex justify-between">
          <span>Uploaded:</span>
          <span>{document.uploadDate}</span>
        </div>
        {document.modifiedDate && document.modifiedDate !== document.uploadDate && (
          <div className="flex justify-between">
            <span>Modified:</span>
            <span>{document.modifiedDate}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload?.();
          }}
          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </button>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare?.();
            }}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
            title="Share"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </Card>
  );
};

// Stats Card Variant
export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  className = "" 
}) => {
  const getTrendColor = (trend) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return "↗";
    if (trend < 0) return "↘";
    return "→";
  };

  return (
    <Card className={`${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 text-xs mt-2 ${getTrendColor(trend)}`}>
              <span>{getTrendIcon(trend)}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-2xl text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

// Empty State Card
export const EmptyStateCard = ({ 
  title, 
  description, 
  icon, 
  action, 
  className = "" 
}) => (
  <Card className={`text-center py-12 ${className}`}>
    <div className="text-gray-400 mb-4 text-6xl">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      {description}
    </p>
    {action}
  </Card>
);

// Loading Card
export const LoadingCard = ({ className = "" }) => (
  <Card className={`animate-pulse ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </Card>
);

export default Card;