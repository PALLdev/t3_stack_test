import { trpc } from "../../utils/trpc";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "../../utils/shared/create-question-validator";
import { useRouter } from "next/router";

export default function QuestionForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
    defaultValues: {
      options: [{ text: "Si" }, { text: "No" }],
    },
  });

  const { mutate, isLoading, data } = trpc.useMutation("question.create", {
    onSuccess(addedQuestion) {
      router.push(`/question/${addedQuestion.id}`);
    },
  });

  const submitQuestionHandler: SubmitHandler<CreateQuestionInputType> = (
    formData
  ) => {
    mutate(formData);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  if (isLoading || data)
    return (
      <div className="py-10 grid place-items-center">
        <div role="status">
          <svg
            className="mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit(submitQuestionHandler)}
      className="py-4 w-full "
    >
      <div className="flex flex-col px-12">
        <label htmlFor="question" className="text-lg mb-2">
          Tu pregunta:
        </label>
        <input
          {...register("question")}
          className="border-2 px-2 py-1 text-lg focus:outline-violet-500"
        />
        {errors.question && (
          <span className="text-red-700 text-sm mb-1">
            {errors.question.message}
          </span>
        )}

        <label htmlFor="options" className="text-lg mb-2">
          Opciones:
        </label>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={index} className="flex gap-6 items-center">
              <input
                className="px-2 py-1 rounded-md"
                key={field.id} // important to include key with field's id
                {...register(`options.${index}.text`)}
              />
              {fields.length > 2 && (
                <button
                  type="button"
                  className="bg-red-300 px-6 py-1 rounded-md"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 2}
                >
                  Quitar
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="bg-purple-300 px-2 py-1 mb-2 rounded-md"
            onClick={() => append({ text: "nueva" })}
          >
            Agregar opción
          </button>
        </div>
      </div>

      <div className="container text-center">
        <input
          disabled={isLoading}
          type={"submit"}
          value="Crear"
          className="cursor-pointer bg-purple-300 text-gray-700 font-semibold ring-1 ring-purple-300 text-lg px-6 py-1 mt-2 rounded-md shadow-sm hover:opacity-80"
        />
      </div>
    </form>
  );
}
