interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="card bg-red-50 border-red-200">
      <div className="flex items-start gap-3">
        <svg
          className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-1">
            Error
          </h3>
          <p className="text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-700 text-white rounded-none border-2 border-black hover:bg-red-800 transition-colors duration-200 font-medium shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
