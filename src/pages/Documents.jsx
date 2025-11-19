import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { useState, useRef } from "react";
import { 
  FaSearch, 
  FaUpload, 
  FaDownload, 
  FaTrash, 
  FaEye, 
  FaShare, 
  FaEdit,
  FaTh, 
  FaList, 
  FaFilter,
  FaFilePdf,
  FaFileWord,
  FaFileArchive,
  FaFileImage,
  FaFileExcel,
  FaFilePowerpoint,
  FaFile,
  FaFolder,
  FaStar,
  FaRegStar,
  FaSort,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";

const Documents = () => {
  const [documents, setDocuments] = useState([
    { 
      id: 1, 
      name: "Contract Agreement", 
      type: "PDF", 
      size: "2.4 MB",
      uploadDate: "2024-10-15",
      modifiedDate: "2024-10-15",
      category: "Contracts",
      status: "Verified",
      favorite: true,
      shared: true,
      tags: ["contract", "legal", "agreement"],
      description: "Client service agreement document"
    },
    { 
      id: 2, 
      name: "Legal Notice Draft", 
      type: "DOCX", 
      size: "1.1 MB",
      uploadDate: "2024-10-14",
      modifiedDate: "2024-10-14",
      category: "Legal",
      status: "Pending",
      favorite: false,
      shared: false,
      tags: ["draft", "notice"],
      description: "Initial draft of legal notice"
    },
    { 
      id: 3, 
      name: "Evidence Photos", 
      type: "ZIP", 
      size: "15.7 MB",
      uploadDate: "2024-10-10",
      modifiedDate: "2024-10-10",
      category: "Evidence",
      status: "Verified",
      favorite: true,
      shared: true,
      tags: ["evidence", "photos", "case-123"],
      description: "Compressed evidence photo collection"
    },
    { 
      id: 4, 
      name: "Court Order Copy", 
      type: "PDF", 
      size: "3.2 MB",
      uploadDate: "2024-10-08",
      modifiedDate: "2024-10-08",
      category: "Court Documents",
      status: "Verified",
      favorite: false,
      shared: false,
      tags: ["court", "order"],
      description: "Official court order document"
    },
    { 
      id: 5, 
      name: "Financial Statements", 
      type: "XLSX", 
      size: "4.8 MB",
      uploadDate: "2024-10-05",
      modifiedDate: "2024-10-06",
      category: "Financial",
      status: "Verified",
      favorite: false,
      shared: true,
      tags: ["financial", "statements", "audit"],
      description: "Quarterly financial statements"
    },
    { 
      id: 6, 
      name: "Case Presentation", 
      type: "PPTX", 
      size: "8.3 MB",
      uploadDate: "2024-10-01",
      modifiedDate: "2024-10-02",
      category: "Presentations",
      status: "Pending",
      favorite: false,
      shared: false,
      tags: ["presentation", "case"],
      description: "Client case presentation slides"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const categories = ["All", "Contracts", "Legal", "Evidence", "Court Documents", "Financial", "Presentations"];
  const statuses = ["All", "Verified", "Pending", "Rejected"];

  // Enhanced filtering and sorting
  const filteredDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
      const matchesStatus = selectedStatus === "All" || doc.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "size") {
        aValue = parseFloat(a.size);
        bValue = parseFloat(b.size);
      } else if (sortBy === "uploadDate" || sortBy === "modifiedDate") {
        aValue = new Date(a[sortBy]);
        bValue = new Date(b[sortBy]);
      }
      
      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const getStatusColor = (status) => {
    const colors = {
      "Verified": "bg-green-100 text-green-800 border-green-200",
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Rejected": "bg-red-100 text-red-800 border-red-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getFileIcon = (type) => {
    const iconConfig = {
      "PDF": { icon: FaFilePdf, color: "text-red-600 bg-red-100" },
      "DOCX": { icon: FaFileWord, color: "text-blue-600 bg-blue-100" },
      "ZIP": { icon: FaFileArchive, color: "text-purple-600 bg-purple-100" },
      "XLSX": { icon: FaFileExcel, color: "text-green-600 bg-green-100" },
      "PPTX": { icon: FaFilePowerpoint, color: "text-orange-600 bg-orange-100" },
      "JPG": { icon: FaFileImage, color: "text-pink-600 bg-pink-100" },
      "PNG": { icon: FaFileImage, color: "text-pink-600 bg-pink-100" }
    };

    const config = iconConfig[type] || { icon: FaFile, color: "text-gray-600 bg-gray-100" };
    const IconComponent = config.icon;

    return (
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}>
        <IconComponent size={20} />
      </div>
    );
  };

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      simulateUpload(files);
    }
  };

  const simulateUpload = (files) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          files.forEach((file, index) => {
            const newDocument = {
              id: documents.length + index + 1,
              name: file.name,
              type: file.name.split('.').pop().toUpperCase(),
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              uploadDate: new Date().toISOString().split('T')[0],
              modifiedDate: new Date().toISOString().split('T')[0],
              category: "Legal",
              status: "Pending",
              favorite: false,
              shared: false,
              tags: ["new"],
              description: "Newly uploaded document"
            };
            setDocuments(prev => [newDocument, ...prev]);
          });
          setShowUploadModal(false);
          setUploadProgress(0);
        }, 500);
      }
    }, 100);
  };

  const handleDelete = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleBulkDelete = () => {
    setDocuments(documents.filter(doc => !selectedDocuments.has(doc.id)));
    setSelectedDocuments(new Set());
  };

  const handleDownload = (doc) => {
    // Simulate download
    console.log("Downloading:", doc.name);
  };

  const handleShare = (doc) => {
    // Simulate share
    console.log("Sharing:", doc.name);
  };

  const handleFavorite = (id) => {
    setDocuments(documents.map(doc => 
      doc.id === id ? { ...doc, favorite: !doc.favorite } : doc
    ));
  };

  const toggleSelectDocument = (id) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedDocuments.size === filteredDocuments.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(filteredDocuments.map(doc => doc.id)));
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return FaSort;
    return sortOrder === "asc" ? FaSortUp : FaSortDown;
  };

  const SortIcon = ({ column }) => {
    const IconComponent = getSortIcon(column);
    return <IconComponent className="ml-1" size={12} />;
  };

  return (
    <DashboardLayout>
      <div className="m-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
            <p className="text-gray-600 mt-2">Manage and organize your legal documents</p>
          </div>
          <div className="flex gap-3">
            {selectedDocuments.size > 0 && (
              <Button 
                onClick={handleBulkDelete}
                variant="danger"
                className="flex items-center gap-2"
              >
                <FaTrash size={14} />
                Delete Selected ({selectedDocuments.size})
              </Button>
            )}
            <Button 
              onClick={handleUpload}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <FaUpload size={14} />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents, tags, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <FaTh size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <FaList size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaFilter size={12} />
              <span>{filteredDocuments.length} documents</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaStar className="text-yellow-500" size={12} />
              <span>{documents.filter(d => d.favorite).length} favorites</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaShare className="text-green-500" size={12} />
              <span>{documents.filter(d => d.shared).length} shared</span>
            </div>
          </div>
        </Card>

        {/* Documents Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <Card 
                key={doc.id} 
                className={`hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                  selectedDocuments.has(doc.id) ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.has(doc.id)}
                      onChange={() => toggleSelectDocument(doc.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {getFileIcon(doc.type)}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleFavorite(doc.id)}
                      className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      {doc.favorite ? <FaStar className="text-yellow-500" /> : <FaRegStar />}
                    </button>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{doc.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{doc.category}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{doc.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {doc.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{doc.tags.length - 2}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{doc.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaDownload size={12} />
                    Download
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleShare(doc)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                    >
                      <FaShare size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Documents List View */}
        {viewMode === "list" && (
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.size === filteredDocuments.length && filteredDocuments.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        <SortIcon column="name" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center gap-1">
                        Category
                        <SortIcon column="category" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("size")}
                    >
                      <div className="flex items-center gap-1">
                        Size
                        <SortIcon column="size" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("uploadDate")}
                    >
                      <div className="flex items-center gap-1">
                        Upload Date
                        <SortIcon column="uploadDate" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr 
                      key={doc.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedDocuments.has(doc.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.has(doc.id)}
                          onChange={() => toggleSelectDocument(doc.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getFileIcon(doc.type)}
                          <div className="ml-4">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              {doc.favorite && <FaStar className="text-yellow-500" size={12} />}
                              {doc.shared && <FaShare className="text-green-500" size={12} />}
                            </div>
                            <div className="text-sm text-gray-500">{doc.description}</div>
                            <div className="flex gap-1 mt-1">
                              {doc.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <FaDownload size={14} />
                          </button>
                          <button
                            onClick={() => handleShare(doc)}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Share"
                          >
                            <FaShare size={14} />
                          </button>
                          <button
                            onClick={() => handleFavorite(doc.id)}
                            className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Favorite"
                          >
                            {doc.favorite ? <FaStar size={14} /> : <FaRegStar size={14} />}
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <Card className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <FaFolder size={80} className="mx-auto opacity-50" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No documents found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory !== "All" || selectedStatus !== "All"
                ? "No documents match your search criteria. Try adjusting your filters."
                : "Get started by uploading your first document to organize your legal files."
              }
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleUpload}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <FaUpload size={14} />
                Upload Files
              </Button>
              {(searchTerm || selectedCategory !== "All" || selectedStatus !== "All") && (
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedStatus("All");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Documents</h3>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaUpload className="text-gray-400 text-3xl mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Click to select files or drag and drop</p>
                <p className="text-sm text-gray-500">PDF, DOCX, XLSX, PPTX, Images (Max: 50MB)</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                />
              </div>
              
              {uploadProgress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 justify-end">
                <Button 
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadProgress(0);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadProgress > 0}
                >
                  Select Files
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Documents;