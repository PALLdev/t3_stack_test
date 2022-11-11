type OptionsProps = {
  text: string;
  onVote: () => void;
  hasVoted: boolean;
};

export default function OptionsComponent({
  text,
  onVote,
  hasVoted,
}: OptionsProps) {
  return (
    <li className="flex justify-between items-center gap-2 mb-4">
      <div className="mb-1">{text}</div>
      <div className="flex flex-1 gap-2">
        <div className="w-full text-sm text-slate-900 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm">
          <p>0 %</p>
        </div>
        {!hasVoted && (
          <button
            onClick={onVote}
            className="hover:bg-purple-400 cursor-pointer rounded-md bg-purple-500 text-white text-sm font-medium pl-2 pr-3 shadow-sm"
          >
            <span className="mr-1">+</span>1
          </button>
        )}
      </div>
    </li>
  );
}
