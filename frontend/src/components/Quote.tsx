const Quote = () => {
  return (
    <div className="bg-slate-200 h-screen flex flex-col justify-center">
      <div className="flex justify-center">
        <div className="max-w-lg">
          <div className="text-3xl font-bold">
            "Our greatest weakness lies in giving up. The most certain way to
            succeed is always to try just one more time"
          </div>

          <div className="max-w-md text-xl font-semibold text-left mt-4 text-gray-500">
            Thomas Edison
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
