interface Props {
  loading: boolean;
}

export function Loader({ loading, ...props }: Props) {
  if (!loading) return null;

  return (
    <div className="animate-pulse flex flex-col space-y-4">
      <div className="h-4 bg-gray-500 bg-opacity-25 rounded-lg w-3/6"></div>
      <div className="h-4 bg-gray-500 bg-opacity-25 rounded-lg w-4/6"></div>
      <div className="h-4 bg-gray-500 bg-opacity-25 rounded-lg w-4/6"></div>
    </div>
  );
}
