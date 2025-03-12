"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { Separator } from "@/components/ui/separator"

interface Question {
  id: number
  question: string
  answer: string
}

interface MutateBody {
  question: string;
  answer: string;
  userID: string;
}
interface Props {
  userId: string;
}

export default function QAForm({ userId }: Props) {
  const [pendingId, setPendingId] = useState<number | null>(null)

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "",
      answer: "",
    }
  ])

  const { mutate: createMuate, isPending } = useMutation({
    mutationKey: ["forget-password"],
    mutationFn: (data: MutateBody) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/faqs`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      setPendingId(null)

      if (!data.success) {
        toast.error(data.message, {
          position: "top-right",
          richColors: true,
        })
        return
      }

      // Clear input fields after successful API call
      setQuestions(questions.map((q) => ({ ...q, question: "", answer: "" })))

      // handle success
      toast.success(data.message, {
        position: "bottom-right",
        richColors: true,
      })
    },
    onError: (err) => {
      setPendingId(null)
      toast.error(err.message ?? "Something went wrong", {
        position: "top-right",
        richColors: true,
      })
    },
  })

  const handleQuestionChange = (id: number, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, question: value } : q)))
  }

  const handleAnswerChange = (id: number, value: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, answer: value } : q)))
  }

  const handleCreate = (id: number) => {
    const question = questions.find((q) => q.id === id)
    console.log("Form data:", question)

    if (!question?.question || !question?.answer) {
      toast.error("Question and Answer are required", {
        position: "top-right",
        richColors: true,
      })
      return
    }

    const data = {
      question: question?.question,
      answer: question?.answer,
      userID: userId,
    }

    // call API
    setPendingId(question.id)
    createMuate(data)
  }

  const handleDelete = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  return (
    <div className="w-full mt-[48px] bg-[#F8F5F2] p-6 rounded-lg">
      {questions.map((q) => (
        <Card key={q.id} className="mb-6 p-6 bg-white">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium text-gray-900">Question {q.id}</label>
              <span className="text-sm text-gray-500">{q.question.length}/100</span>
            </div>
            <Textarea
              value={q.question}
              onChange={(e) => handleQuestionChange(q.id, e.target.value)}
              placeholder="Enter your question"
              className="w-full p-3 border rounded"
              maxLength={100}
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium text-gray-900">Answer</label>
              <span className="text-sm text-gray-500">{q.answer.length}/200</span>
            </div>
            <Textarea
              value={q.answer}
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              placeholder="Enter your answer"
              className="w-full p-3 border rounded"
              maxLength={200}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 text-red-500" onClick={() => handleDelete(q.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
            <Button
              className="bg-slate-800 text-white hover:bg-slate-700"
              onClick={() => handleCreate(q.id)}
              disabled={pendingId === q.id && isPending}
            >
              Create {pendingId === q.id && isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            </Button>
          </div>
        </Card>
      ))}

      <Separator className="my-6" />
    </div>
  )
}
