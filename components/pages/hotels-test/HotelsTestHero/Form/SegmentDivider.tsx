function SegmentDivider() {
  return (
    <>
      <div className="h-px w-full shrink-0 bg-gray-300 lg:hidden" aria-hidden />
      <div
        className="hidden shrink-0 self-stretch lg:flex lg:flex-col lg:items-center lg:justify-center mx-2"
        aria-hidden
      >
        <div className="h-[50%] min-h-7 w-px bg-gray-300" />
      </div>
    </>
  );
}

export default SegmentDivider;
