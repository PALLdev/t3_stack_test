import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import OptionsComponent from "../../components/question/options";
import Loader from "../../components/ui/loader";
import { trpc } from "../../utils/trpc";

const QuestionDetailPage: NextPage = () => {
  const { query } = useRouter();
  const { id } = query;

  const { data, isLoading } = trpc.useQuery([
    "question.get-by-id",
    { id: id as string },
  ]);

  const [voted, setVoted] = useState(data?.vote ? true : false);

  const { mutate, data: voteResponse } = trpc.useMutation([
    "question.vote-on-question",
  ]);

  if (!data || isLoading) return <Loader />;

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

  const handleVote = (index: number) => {
    mutate(
      {
        questionId: data.question.id,
        option: index,
      },
      {
        onSuccess() {
          setVoted(true);
        },
      }
    );
  };

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
          <div>
            <Link href={"/"}>
              <a className="text-purple-400 border border-purple-400 rounded-lg p-2 hover:opacity-90">
                Home
              </a>
            </Link>
          </div>
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
            <ul className="mt-2">
              {(data.question.options as { text: string }[]).map((opt, i) => (
                <OptionsComponent
                  key={i}
                  text={opt.text}
                  onVote={handleVote.bind(null, i)}
                  hasVoted={voted}
                />
              ))}
            </ul>
          </div>
        </header>
      </div>
    </div>
  );
};

export default QuestionDetailPage;
