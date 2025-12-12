export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-pulse">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 rounded-md bg-gray-200 dark:bg-gray-700 p-3 w-12 h-12" />
          <div className="ml-5 w-0 flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden animate-pulse">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden animate-pulse">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {[...Array(4)].map((_, i) => (
              <li key={i} className="pb-8">
                <div className="relative flex space-x-3">
                  <div>
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}