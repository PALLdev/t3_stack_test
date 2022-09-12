import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Loader } from "..";
import { trpc } from "../../utils/trpc";

const QuestionDetailPage: NextPage = () => {
  const { query } = useRouter();
  const { id } = query;

  const { data, isLoading } = trpc.useQuery([
    "question.get-by-id",
    { id: id as string },
  ]);

  if (!data && !isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="text-xl">Pregunta no encontrada</div>
        <Link href={"/"}>
          <button className="bg-purple-300 text-gray-700 ring-1 ring-purple-300 text-lg px-6 py-1 mt-2 rounded-md shadow-sm hover:opacity-80">
            Inicio
          </button>
        </Link>
      </div>
    );
  }

  if (!data || isLoading) return <Loader />;

  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/5 bg-gray-800">
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {data.isOwner && (
            <div className="bg-purple-700 p-3 text-white rounded-md">
              Creaste esta pregunta!
            </div>
          )}
          <p className="text-white">Total de votos: 0</p>
        </div>
      </div>
      <div className="flex-auto p-6">
        <header className="bg-white space-y-4 p-4">
          <div>
            <h2 className="font-semibold text-lg text-slate-900">
              {data.question.question}
            </h2>
          </div>
          <div>
            {(data.question.options as string[]).map((opt, i) => (
              <OptionsComponent key={i} str={opt} />
            ))}
          </div>
        </header>
      </div>
    </div>
  );
};

type OptionsProps = {
  str: string;
};

const OptionsComponent = ({ str }: OptionsProps) => (
  <ul className="flex flex-col gap-1 mt-2">
    <div>{str}</div>
    <div className="flex gap-2">
      <div className="w-full text-sm text-slate-900 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm">
        <p>0 %</p>
      </div>
      <a className="hover:bg-purple-400 cursor-pointer flex items-center rounded-md bg-purple-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm">
        <svg
          width="20"
          height="20"
          fill="currentColor"
          className="mr-1"
          aria-hidden="true"
        >
          <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
        </svg>
        1
      </a>
    </div>
  </ul>
);

export default QuestionDetailPage;
