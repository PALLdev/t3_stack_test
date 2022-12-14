import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import QuestionForm from "../components/question/question-form";
import Loader from "../components/ui/loader";

type QuestionCardProps = {
  id: string;
  question: string;
};

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["question.get-all-mine"]);

  if (isLoading || !data) return <Loader />;

  return (
    <>
      <Head>
        <title>Testing Create T3 App</title>
        <meta
          name="description"
          content="Polls app testing the stack generated by create-t3-app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          <span className="text-purple-300">Polls</span> App
        </h1>
        <div className="grid gap-3 my-6 text-center md:grid-cols-2 lg:w-2/3">
          {data.length === 0 ? (
            <div className="text-2xl text-gray-700 block">
              <p className="text-center">Aún no has creado votaciones.</p>
            </div>
          ) : (
            data.map((q, i) => (
              <QuestionCard key={i} id={q.id} question={q.question} />
            ))
          )}
        </div>
        <div className="py-4 mt-3 w-full rounded-3xl bg-slate-300">
          <p className="text-2xl text-gray-700 text-center font-extrabold">
            Nueva votación
          </p>
          <QuestionForm />
        </div>
      </main>
    </>
  );
};

const QuestionCard = ({ id, question }: QuestionCardProps) => {
  return (
    <article className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
      <Link href={`/question/${id}`}>
        <a>
          <h2 className="text-lg text-violet-500 cursor-pointer">{question}</h2>
        </a>
      </Link>
    </article>
  );
};

export default Home;
