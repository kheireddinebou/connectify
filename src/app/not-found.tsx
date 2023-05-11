export default function NotFound() {
  return (
    <div className="flex h-screen w-screen  flex-col items-center text-blue-light text-3xl gap-y-3 font-semibold pt-8">
      <span className="text-9xl">404.</span>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </div>
  );
}
