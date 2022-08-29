import type { NextPage } from "next";
import Head from "next/head";
import { FormEvent, useRef } from "react";
import { trpc } from "../utils/trpc";

type QuestionCardProps = {
  question: string;
};

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["question.get-all"]);

  if (isLoading || !data) return <div>Cargando...</div>;

  return (
    <>
      <Head>
        <title>Testing Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          <span className="text-purple-300">Polls</span> App
        </h1>
        <p className="text-2xl text-gray-700">Historial de preguntas</p>
        <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-2 lg:w-2/3">
          {data.map((q) => (
            <QuestionCard key={q.id} question={q.question} />
          ))}
        </div>
        <div className="pt-6 w-full">
          <p className="text-2xl text-gray-700 text-center">Nueva pregunta</p>
          <QuestionForm />
        </div>
      </main>
    </>
  );
};

const QuestionForm = () => {
  const questionRef = useRef<HTMLInputElement>(null);
  const client = trpc.useContext();

  const { mutate } = trpc.useMutation("question.create", {
    onSuccess: () => {
      client.invalidateQueries("question.get-all");
    },
  });

  const submitQuestionHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!questionRef.current) return;
    mutate({ question: questionRef.current.value });
    questionRef.current.value = "";
  };

  return (
    <form onSubmit={submitQuestionHandler} className="py-4 w-full">
      <div className="flex flex-col px-12">
        <label htmlFor="question" className="text-lg">
          Tu pregunta:
        </label>
        <input
          ref={questionRef}
          className="border-2 px-2 py-1 text-lg focus:outline-violet-500"
          id="question"
          name="question"
          type="text"
        />
      </div>
      <div className="container text-center">
        <button
          type={"submit"}
          className="bg-purple-300 text-gray-700 ring-1 ring-purple-300 text-lg px-6 py-1 mt-2 rounded-md shadow-sm hover:opacity-80"
        >
          Crear
        </button>
      </div>
    </form>
  );
};

const QuestionCard = ({ question }: QuestionCardProps) => {
  return (
    <section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
      <h2 className="text-lg text-violet-500 cursor-pointer">{question}</h2>
    </section>
  );
};

export default Home;
