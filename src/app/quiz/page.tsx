import StyleQuiz from "@/components/StyleQuiz";
import { getQuiz } from "@/actions/quiz";

export const metadata = {
  title: "Trouvez votre style | IAMYOKA",
  description: "Quiz immersif pour découvrir le style photographique parfait pour votre mariage.",
};

export default async function QuizPage() {
  const quizData = await getQuiz();

  return (
    <main className="w-full min-h-screen bg-brand-ink">
      <StyleQuiz questions={quizData.questions} />
    </main>
  );
}
