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

  return <div>{data.question}</div>;
};

export default QuestionDetailPage;
