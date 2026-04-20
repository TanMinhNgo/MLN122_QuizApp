import { QuestionList } from "@/components/host/QuestionList";
import { QuestionEditor } from "@/components/host/QuestionEditor";
import { Option } from "@/types";

interface QuizEditorProps {
  quizId: string;
}

const demoQuestions = [
  "Đâu là ngôn ngữ chạy trên trình duyệt?",
  "HTTP viết tắt của cụm từ nào?",
  "React thuộc nhóm thư viện hay framework?",
];

const demoOptions: Option[] = [
  { id: "a", text: "JavaScript", color: "#e21b3c" },
  { id: "b", text: "Python", color: "#1368ce" },
  { id: "c", text: "C++", color: "#d89e00" },
  { id: "d", text: "Java", color: "#26890c" },
];

export function QuizEditor({ quizId }: QuizEditorProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
      <QuestionList title="Danh sách câu hỏi" quizId={quizId} questions={demoQuestions} activeIndex={0} />
      <QuestionEditor options={demoOptions} />
    </div>
  );
}
