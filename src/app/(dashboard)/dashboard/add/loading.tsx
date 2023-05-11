import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loading = () => {
  return (
    <div className="w-full flex flex-col">
      <Skeleton className="mb-4" height={60} width={400} />
      <Skeleton height={20} width={200} />
      <Skeleton height={40} width={400} />
    </div>
  );
};

export default Loading;
