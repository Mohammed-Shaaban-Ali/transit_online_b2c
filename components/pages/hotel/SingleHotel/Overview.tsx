const Overview = ({
  descriptions,
}: {
  descriptions?: {
    title: string;
    description: string;
    language: string;
    line: number;
  }[];
}) => {
  if (!descriptions || descriptions.length === 0) return null;

  return (
    <>
      <h3 className="text-2xl font-medium mb-6">Overview</h3>
      <div className="space-y-3">
        {descriptions.map((des) => (
          <div key={des.line} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm leading-relaxed">{des.description}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Overview;
