import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, ArrowRight, Shield, CheckCircle } from "lucide-react";

// Survey questions that adapt based on focus areas
const surveyQuestions = {
  leadership: [
    {
      id: "leadership_effectiveness",
      question: "How effectively does this person lead and inspire others?",
      type: "radio",
      options: [
        "Exceptionally effective - consistently inspires and motivates",
        "Very effective - usually inspires and guides well",
        "Moderately effective - sometimes provides good leadership",
        "Somewhat effective - occasional leadership moments",
        "Ineffective - rarely demonstrates leadership qualities"
      ]
    },
    {
      id: "decision_making",
      question: "How would you rate their decision-making abilities?",
      type: "radio",
      options: [
        "Excellent - makes sound decisions quickly and confidently",
        "Good - generally makes good decisions with consideration",
        "Average - decisions are reasonable but sometimes delayed",
        "Below average - decisions often lack clarity or timing",
        "Poor - frequently makes questionable decisions"
      ]
    }
  ],
  communication: [
    {
      id: "communication_clarity", 
      question: "How effectively does this person communicate complex ideas to different audiences?",
      type: "radio",
      options: [
        "Exceptionally clear - always adapts message to audience",
        "Very clear - usually adapts well to different audiences", 
        "Moderately clear - some adaptation to audience",
        "Sometimes unclear - limited audience adaptation",
        "Often unclear - difficulty adapting to audience"
      ]
    },
    {
      id: "listening_skills",
      question: "How well do they listen and respond to others?",
      type: "radio",
      options: [
        "Excellent listener - always engaged and responsive",
        "Good listener - usually attentive and understanding",
        "Average listener - sometimes distracted but tries",
        "Poor listener - often distracted or dismissive",
        "Very poor listener - rarely pays attention to others"
      ]
    }
  ],
  emotional_intelligence: [
    {
      id: "emotional_awareness",
      question: "How well does this person understand and manage their emotions?",
      type: "radio",
      options: [
        "Excellent - highly self-aware and emotionally regulated",
        "Good - generally manages emotions well",
        "Average - sometimes struggles with emotional control",
        "Below average - often lets emotions drive behavior",
        "Poor - frequently emotionally reactive or unaware"
      ]
    },
    {
      id: "empathy",
      question: "How empathetic and understanding are they towards others?",
      type: "radio",
      options: [
        "Extremely empathetic - always considers others' perspectives",
        "Very empathetic - usually understanding and supportive",
        "Moderately empathetic - sometimes shows understanding",
        "Somewhat empathetic - occasional awareness of others",
        "Not empathetic - rarely considers others' feelings"
      ]
    }
  ],
  problem_solving: [
    {
      id: "analytical_thinking",
      question: "How effectively do they analyze and solve complex problems?",
      type: "radio",
      options: [
        "Exceptional - quickly identifies root causes and solutions",
        "Strong - generally good at breaking down problems",
        "Average - can solve problems with some guidance",
        "Weak - struggles to analyze complex issues",
        "Very weak - needs significant help with problem-solving"
      ]
    }
  ],
  collaboration: [
    {
      id: "teamwork",
      question: "How well do they work with others in team settings?",
      type: "radio",
      options: [
        "Excellent team player - enhances team performance",
        "Good team player - contributes positively to teams",
        "Average - adequate team participation",
        "Below average - sometimes creates team friction",
        "Poor - often disrupts team dynamics"
      ]
    }
  ],
  character: [
    {
      id: "integrity",
      question: "How would you rate their integrity and ethical behavior?",
      type: "radio",
      options: [
        "Extremely high - always acts with integrity",
        "High - consistently ethical and trustworthy",
        "Good - generally acts with good character",
        "Average - sometimes compromises on values",
        "Poor - frequently acts without integrity"
      ]
    }
  ]
};

export default function Survey() {
  const params = useParams();
  const token = params.token || "";
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const { toast } = useToast();

  const { data: surveyData, isLoading } = useQuery({
    queryKey: ["/api/survey", token],
    enabled: !!token,
  });

  const form = useForm({
    defaultValues: {
      answer: "",
      example: ""
    },
    mode: "onChange"
  });

  const saveResponseMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/survey/${token}/responses`, data),
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save response",
        variant: "destructive"
      });
    }
  });

  const completeSurveyMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/survey/${token}/complete`),
    onSuccess: () => {
      setIsCompleted(true);
      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete survey",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">Loading survey...</div>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Survey not found</h1>
          <p className="text-neutral-500">This survey link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Thank You!</h1>
            <p className="text-neutral-500 mb-4">
              Your anonymous feedback for {surveyData.userName} has been submitted successfully.
            </p>
            <p className="text-sm text-neutral-400">
              Your responses will help them gain valuable insights for their personal development.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate questions based on focus areas
  const questions: any[] = [];
  surveyData.survey.focusAreas.forEach((area: string) => {
    if (surveyQuestions[area as keyof typeof surveyQuestions]) {
      questions.push(...surveyQuestions[area as keyof typeof surveyQuestions]);
    }
  });

  // Add example question for each main question
  const allQuestions = questions.flatMap(q => [
    q,
    {
      id: `${q.id}_example`,
      question: "Share a specific example (optional)",
      type: "textarea",
      optional: true
    }
  ]);

  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleNext = async () => {
    const formData = form.getValues();
    const question = allQuestions[currentQuestion];
    
    // Get the correct field value based on question type
    const fieldValue = question.type === "textarea" ? textareaValue : formData.answer;
    
    if (!question.optional && !fieldValue) {
      toast({
        title: "Please provide an answer",
        description: "This question is required",
        variant: "destructive"
      });
      return;
    }

    // Save response
    await saveResponseMutation.mutateAsync({
      questionId: question.id,
      answer: fieldValue
    });

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Reset form values for next question
      form.reset({
        answer: "",
        example: ""
      });
      setTextareaValue("");
    } else {
      // Complete survey
      completeSurveyMutation.mutate();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = allQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            Anonymous Feedback for {surveyData.userName}
          </h1>
          <p className="text-neutral-500">
            Your honest insights will help {surveyData.userName} grow. Your responses are completely anonymous.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Question {currentQuestion + 1} of {totalQuestions}</CardTitle>
              <div className="w-32">
                <Progress value={progress} />
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-neutral-900 mb-6">
                    {currentQ.question}
                  </h3>
                  
                  {currentQ.type === "radio" ? (
                    <FormField
                      control={form.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="space-y-3"
                            >
                              {currentQ.options?.map((option: string) => (
                                <div key={option} className="flex items-center p-4 bg-neutral-50 rounded-lg hover:bg-primary/5 transition-colors">
                                  <RadioGroupItem value={option} id={option} className="mr-3" />
                                  <Label htmlFor={option} className="cursor-pointer flex-1">
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Describe a situation where you observed this behavior..."
                        value={textareaValue}
                        onChange={(e) => setTextareaValue(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" type="button">
                      Save & Continue Later
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={saveResponseMutation.isPending || completeSurveyMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isLastQuestion ? "Complete Survey" : "Next Question"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
