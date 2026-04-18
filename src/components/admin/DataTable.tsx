// src/components/admin/DataTable.tsx
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any) => React.ReactNode;
  mobile?: boolean;
  hideMobile?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  searchable?: boolean;
  onSearch?: (query: string) => void;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage = 10,
  searchable = false,
  onSearch
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (onSearch) onSearch(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
            />
          </div>
        </div>
      )}

      {/* Mobile View */}
      <div className="block sm:hidden">
        {paginatedData.map((item, index) => (
          <div key={index} className="p-4 border-b border-gray-100 last:border-0">
            {columns
              .filter(col => col.mobile !== false)
              .map((column) => (
                <div key={String(column.key)} className="flex justify-between py-1">
                  <span className="text-xs text-gray-500">{column.header}</span>
                  <span className="text-xs font-medium text-gray-900">
                    {column.render ? column.render(item[column.key]) : item[column.key]}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.hideMobile ? 'hidden lg:table-cell' : ''
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      column.hideMobile ? 'hidden lg:table-cell' : ''
                    }`}
                  >
                    {column.render ? column.render(item[column.key]) : <span className="text-gray-900">{item[column.key]}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of {data.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;