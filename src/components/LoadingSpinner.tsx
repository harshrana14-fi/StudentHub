interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({
  message = 'Generating lab record...',
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin-custom rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-700"></div>
      <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
      <p className="mt-2 text-sm text-gray-500">This may take a few seconds</p>
    </div>
  );
}
