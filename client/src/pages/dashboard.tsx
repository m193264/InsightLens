import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import { Mail, CheckCircle, Clock, Users, TrendingUp, FileText, Send } from "lucide-react";

export default function Dashboard() {
  const params = useParams();
  const surveyId = parseInt(params.id || "0");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: survey, isLoading } = useQuery({
    queryKey: ["/api/surveys", surveyId],
    enabled: !!surveyId,
  });

  const generateReportMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/surveys/${surveyId}/generate-report`),
    onSuccess: () => {
      toast({
        title: "Report Generated!",
        description: "Your 360° insight report is ready",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/surveys", surveyId] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      });
    },
  });

  const sendReminderMutation = useMutation({
    mutationFn: (invitationId: number) => 
      apiRequest("POST", `/api/invitations/${invitationId}/remind`),
    onSuccess: () => {
      toast({
        title: "Reminder Sent",
        description: "Reminder email has been sent",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Survey not found</h1>
            <Link href="/onboarding">
              <Button>Create New Survey</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedResponses = survey.invitations?.filter((inv: any) => inv.status === "completed").length || 0;
  const totalInvitations = survey.invitations?.length || 0;
  const completionRate = totalInvitations > 0 ? Math.round((completedResponses / totalInvitations) * 100) : 0;
  const canGenerateReport = completedResponses >= 3;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      default:
        return <Badge variant="secondary"><Mail className="w-3 h-3 mr-1" />Invited</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "in_progress": return "text-yellow-600"; 
      default: return "text-neutral-500";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Survey Progress</h1>
          <p className="text-neutral-500">Track responses and manage your 360° feedback collection</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="gradient-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Invitations</p>
                  <p className="text-3xl font-bold">{totalInvitations}</p>
                </div>
                <Send className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-accent text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Responses Received</p>
                  <p className="text-3xl font-bold">{completedResponses}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-secondary to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold">{completionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Individual Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Individual Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {survey.invitations?.map((invitation: any) => (
                <div key={invitation.id} className="flex items-center justify-between py-4 border-b border-neutral-200 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{invitation.name}</p>
                      <p className="text-sm text-neutral-500 capitalize">{invitation.relationship.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(invitation.status)}
                    {invitation.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendReminderMutation.mutate(invitation.id)}
                        disabled={sendReminderMutation.isPending}
                      >
                        Send Reminder
                      </Button>
                    )}
                    <span className="text-sm text-neutral-500">
                      {invitation.completedAt 
                        ? new Date(invitation.completedAt).toLocaleDateString()
                        : invitation.sentAt 
                          ? `Sent ${new Date(invitation.sentAt).toLocaleDateString()}`
                          : "Not sent"
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Insight Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {survey.status === "completed" && survey.reportData ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Your Report is Ready!</h3>
                <p className="text-neutral-500 mb-6">Your comprehensive 360° insight report has been generated.</p>
                <div className="flex gap-4 justify-center">
                  <Link href={`/report/${surveyId}`}>
                    <Button className="bg-primary hover:bg-primary/90">
                      View Report
                    </Button>
                  </Link>
                  <Button variant="outline" asChild>
                    <a href={`/api/surveys/${surveyId}/report/pdf`} download>
                      Download PDF
                    </a>
                  </Button>
                </div>
              </div>
            ) : canGenerateReport ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Ready to Generate Report</h3>
                <p className="text-neutral-500 mb-6">
                  You have {completedResponses} responses. Generate your AI-powered insight report now.
                </p>
                <Button 
                  onClick={() => generateReportMutation.mutate()}
                  disabled={generateReportMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {generateReportMutation.isPending ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-neutral-500" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Collecting Responses</h3>
                <p className="text-neutral-500 mb-4">
                  Need at least 3 responses to generate your insight report.
                </p>
                <Progress value={(completedResponses / 3) * 100} className="max-w-sm mx-auto mb-4" />
                <p className="text-sm text-neutral-500">
                  {completedResponses} of 3 minimum responses received
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
