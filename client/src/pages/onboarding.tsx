import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ProgressIndicator from "@/components/progress-indicator";
import MentorSelection from "@/components/mentor-selection";
import Header from "@/components/header";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";

const steps = [
  { id: 1, title: "Focus Areas", description: "Select insight areas" },
  { id: 2, title: "Self-Assessment", description: "Quick self-evaluation" },
  { id: 3, title: "AI Mentor", description: "Choose your guide" },
  { id: 4, title: "Your Circle", description: "Add contacts" }
];

const focusAreas = [
  { id: "leadership", label: "Leadership Style", description: "How you influence and guide others" },
  { id: "communication", label: "Communication", description: "How you express ideas and listen" },
  { id: "emotional_intelligence", label: "Emotional Intelligence", description: "How you manage emotions and relationships" },
  { id: "problem_solving", label: "Problem Solving", description: "How you approach challenges and decisions" },
  { id: "collaboration", label: "Collaboration", description: "How you work with teams and build trust" },
  { id: "character", label: "Character & Values", description: "Your core principles and integrity" }
];

const selfAssessmentQuestions = [
  {
    id: "confidence_level",
    question: "How confident are you in your current leadership abilities?",
    type: "radio",
    options: ["Very confident", "Somewhat confident", "Neutral", "Somewhat unsure", "Very unsure"]
  },
  {
    id: "feedback_openness", 
    question: "How open are you to receiving constructive feedback?",
    type: "radio",
    options: ["Extremely open", "Very open", "Somewhat open", "Slightly open", "Not open"]
  },
  {
    id: "growth_mindset",
    question: "I believe my abilities can be developed through dedication and hard work",
    type: "radio", 
    options: ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"]
  },
  {
    id: "self_awareness",
    question: "I have a clear understanding of my strengths and weaknesses",
    type: "radio",
    options: ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree"] 
  },
  {
    id: "goals",
    question: "What are your top 3 professional development goals?",
    type: "textarea"
  }
];

// Form schemas
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address")
});

const focusAreasSchema = z.object({
  focusAreas: z.array(z.string()).min(1, "Please select at least one focus area")
});

const selfAssessmentSchema = z.object({
  confidence_level: z.string(),
  feedback_openness: z.string(), 
  growth_mindset: z.string(),
  self_awareness: z.string(),
  goals: z.string().optional()
});

const mentorSchema = z.object({
  aiMentor: z.string().min(1, "Please select an AI mentor")
});

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  relationship: z.string().min(1, "Relationship is required")
});

const contactsSchema = z.object({
  contacts: z.array(contactSchema).min(2, "Please add at least 2 contacts").max(10, "Maximum 10 contacts allowed")
});

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<any>({});
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Step 1: User info form
  const userForm = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "" }
  });

  // Step 2: Focus areas form  
  const focusForm = useForm({
    resolver: zodResolver(focusAreasSchema),
    defaultValues: { focusAreas: [] }
  });

  // Step 3: Self-assessment form
  const assessmentForm = useForm({
    resolver: zodResolver(selfAssessmentSchema),
    defaultValues: {
      confidence_level: "",
      feedback_openness: "",
      growth_mindset: "",
      self_awareness: "",
      goals: ""
    }
  });

  // Step 4: Mentor selection form
  const mentorForm = useForm({
    resolver: zodResolver(mentorSchema),
    defaultValues: { aiMentor: "" }
  });

  // Step 5: Contacts form
  const contactsForm = useForm({
    resolver: zodResolver(contactsSchema),
    defaultValues: {
      contacts: [
        { name: "", email: "", relationship: "" },
        { name: "", email: "", relationship: "" }
      ]
    }
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/users", data),
    onSuccess: async (response) => {
      const user = await response.json();
      setUserData(prev => ({ ...prev, userId: user.id }));
      setCurrentStep(2);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create user account",
        variant: "destructive"
      });
    }
  });

  const createSurveyMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/surveys", data),
    onSuccess: async (response) => {
      const survey = await response.json();
      setUserData(prev => ({ ...prev, surveyId: survey.id }));
      queryClient.invalidateQueries({ queryKey: ["/api/users", userData.userId, "surveys"] });
      setLocation(`/dashboard/${survey.id}`);
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to create survey",
        variant: "destructive"
      });
    }
  });

  const createInvitationsMutation = useMutation({
    mutationFn: ({ surveyId, contacts }: any) => 
      apiRequest("POST", `/api/surveys/${surveyId}/invitations`, contacts),
    onSuccess: async (_, variables) => {
      // Send invitations immediately using the surveyId from the mutation variables
      console.log('Invitations created, now sending emails for survey:', variables.surveyId);
      try {
        await apiRequest("POST", `/api/surveys/${variables.surveyId}/send-invitations`);
        toast({
          title: "Success!",
          description: "Survey created and invitations sent!"
        });
        setLocation(`/dashboard/${variables.surveyId}`);
      } catch (error) {
        console.error('Failed to send invitations:', error);
        toast({
          title: "Partial Success",
          description: "Survey created but failed to send invitations. You can send them from the dashboard.",
          variant: "destructive"
        });
        setLocation(`/dashboard/${variables.surveyId}`);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create invitations",
        variant: "destructive"
      });
    }
  });

  const handleUserSubmit = userForm.handleSubmit((data) => {
    setUserData(prev => ({ ...prev, ...data }));
    createUserMutation.mutate(data);
  });

  const handleFocusSubmit = focusForm.handleSubmit((data) => {
    setUserData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  });

  const handleAssessmentSubmit = assessmentForm.handleSubmit((data) => {
    setUserData(prev => ({ ...prev, selfAssessment: data }));
    setCurrentStep(4);
  });

  const handleMentorSubmit = mentorForm.handleSubmit((data) => {
    setUserData(prev => ({ ...prev, ...data }));
    setCurrentStep(5);
  });

  const handleContactsSubmit = contactsForm.handleSubmit((data) => {
    // Store contacts data for later use
    const contactsData = data.contacts;
    
    // Create survey first
    const surveyData = {
      userId: userData.userId,
      title: `${userData.name}'s 360° Feedback Survey`,
      focusAreas: userData.focusAreas,
      aiMentor: userData.aiMentor,
      selfAssessment: userData.selfAssessment,
      status: "setup"
    };

    console.log('Creating survey and then invitations...');
    createSurveyMutation.mutate(surveyData, {
      onSuccess: (createdSurvey) => {
        console.log('Survey created with ID:', createdSurvey.id);
        // Now create invitations with the actual survey ID
        createInvitationsMutation.mutate({
          surveyId: createdSurvey.id,
          contacts: contactsData
        });
      }
    });
  });

  const addContact = () => {
    const currentContacts = contactsForm.getValues("contacts");
    if (currentContacts.length < 10) {
      contactsForm.setValue("contacts", [
        ...currentContacts,
        { name: "", email: "", relationship: "" }
      ]);
    }
  };

  const removeContact = (index: number) => {
    const currentContacts = contactsForm.getValues("contacts");
    if (currentContacts.length > 2) {
      contactsForm.setValue("contacts", currentContacts.filter((_, i) => i !== index));
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Set Up Your 360° Survey</h1>
          <ProgressIndicator steps={steps} currentStep={currentStep} />
        </div>

        <Card className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle>Let's start with your information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...userForm}>
                  <form onSubmit={handleUserSubmit} className="space-y-6">
                    <FormField
                      control={userForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={userForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={createUserMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle>Select Your Insight Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...focusForm}>
                  <form onSubmit={handleFocusSubmit} className="space-y-6">
                    <FormField
                      control={focusForm.control}
                      name="focusAreas"
                      render={() => (
                        <FormItem>
                          <div className="grid gap-4">
                            {focusAreas.map((area) => (
                              <FormField
                                key={area.id}
                                control={focusForm.control}
                                name="focusAreas"
                                render={({ field }) => (
                                  <FormItem className="flex items-start space-x-3 space-y-0 p-4 bg-neutral-50 rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(area.id)}
                                        onCheckedChange={(checked) => {
                                          const value = field.value || [];
                                          if (checked) {
                                            field.onChange([...value, area.id]);
                                          } else {
                                            field.onChange(value.filter((v) => v !== area.id));
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <div className="flex-1">
                                      <FormLabel className="font-medium cursor-pointer">
                                        {area.label}
                                      </FormLabel>
                                      <p className="text-sm text-neutral-500 mt-1">
                                        {area.description}
                                      </p>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goBack}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle>Quick Self-Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...assessmentForm}>
                  <form onSubmit={handleAssessmentSubmit} className="space-y-8">
                    {selfAssessmentQuestions.map((q) => (
                      <FormField
                        key={q.id}
                        control={assessmentForm.control}
                        name={q.id as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-medium">
                              {q.question}
                            </FormLabel>
                            <FormControl>
                              {q.type === "radio" ? (
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="space-y-2"
                                >
                                  {q.options?.map((option) => (
                                    <div key={option} className="flex items-center space-x-2">
                                      <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                                      <Label htmlFor={`${q.id}-${option}`} className="cursor-pointer">
                                        {option}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              ) : (
                                <Textarea
                                  placeholder="Share your thoughts..."
                                  {...field}
                                  rows={3}
                                />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goBack}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </>
          )}

          {currentStep === 4 && (
            <>
              <CardHeader>
                <CardTitle>Choose Your AI Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...mentorForm}>
                  <form onSubmit={handleMentorSubmit} className="space-y-6">
                    <FormField
                      control={mentorForm.control}
                      name="aiMentor"
                      render={({ field }) => (
                        <FormItem>
                          <MentorSelection
                            value={field.value}
                            onChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goBack}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Continue
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </>
          )}

          {currentStep === 5 && (
            <>
              <CardHeader>
                <CardTitle>Invite Your Circle</CardTitle>
                <p className="text-neutral-500">Add 2-10 people who know you well in different contexts</p>
              </CardHeader>
              <CardContent>
                <Form {...contactsForm}>
                  <form onSubmit={handleContactsSubmit} className="space-y-6">
                    <div className="space-y-4">
                      {contactsForm.watch("contacts").map((_, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-medium">{index + 1}</span>
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={contactsForm.control}
                              name={`contacts.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={contactsForm.control}
                              name={`contacts.${index}.email`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Email" type="email" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={contactsForm.control}
                              name={`contacts.${index}.relationship`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <select
                                      {...field}
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <option value="">Relationship</option>
                                      <option value="coworker">Coworker</option>
                                      <option value="manager">Manager</option>
                                      <option value="direct_report">Direct Report</option>
                                      <option value="friend">Friend</option>
                                      <option value="family">Family</option>
                                      <option value="client">Client</option>
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          {contactsForm.watch("contacts").length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeContact(index)}
                              className="text-neutral-400 hover:text-red-500"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {contactsForm.watch("contacts").length < 10 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addContact}
                        className="w-full border-2 border-dashed border-neutral-300 hover:border-primary hover:text-primary"
                      >
                        + Add Another Person
                      </Button>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="text-blue-600 w-5 h-5 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-1">Privacy & Anonymity</h4>
                          <p className="text-sm text-blue-700">
                            Your contacts will receive anonymous survey invitations. They won't see each other's responses, and you won't know who said what.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={goBack}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createSurveyMutation.isPending || createInvitationsMutation.isPending}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Send Invitations
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
