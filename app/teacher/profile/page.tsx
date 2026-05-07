"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Lock, Edit2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/teacher/Template/components/ui/card";
import { Button } from "@/app/teacher/Template/components/ui/button";
import { Input } from "@/app/teacher/Template/components/ui/input";
import { Textarea } from "@/app/teacher/Template/components/ui/textarea";
import { Badge } from "@/app/teacher/Template/components/ui/badge";
import { FieldGroup, Field, FieldLabel } from "@/app/teacher/Template/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/teacher/Template/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/teacher/Template/components/ui/tabs";
import { getTeacherProfile } from "../service";
import type { TeacherProfile } from "../types";

export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedData, setEditedData] = useState<TeacherProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getTeacherProfile();
        if (!cancelled) {
          setTeacher(data);
          setEditedData(data);
        }
      } catch {
        if (!cancelled) {
          const fallback: TeacherProfile = {
            name: "Teacher",
            auth_id: "",
            programName: "General",
          };
          setTeacher(fallback);
          setEditedData(fallback);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = () => {
    if (editedData) {
      setTeacher(editedData);
    }
    setIsEditingProfile(false);
  };

  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-6">
        <div className="h-10 w-48 bg-muted rounded" />
        <div className="h-4 w-64 bg-muted rounded" />
        <Card className="h-64 bg-muted" />
      </div>
    );
  }

  const activityLog = [
    { id: 1, action: "LoggedIn", details: "Successful login from Chrome", date: "Today" },
    { id: 2, action: "Updated Profile", details: "Changed contact information", date: "Yesterday" },
  ];

  const programLabel = teacher?.programName ?? "General";

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Card className="border border-border animate-scale-in">
        <CardContent className="pt-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-24 h-24 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-4 overflow-hidden">
                {teacher?.profilePic ? (
                  <img src={teacher.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {teacher?.name || "Teacher"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Teacher / Mentor — {programLabel}
              </p>
              <Badge className="mt-3 bg-primary/10 text-primary">Active</Badge>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-medium">Email</span>
                  </div>
                  <p className="text-foreground font-medium">{teacher?.email || "N/A"}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-medium">Phone</span>
                  </div>
                  <p className="text-foreground font-medium">{teacher?.phone || "N/A"}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-medium">Program</span>
                  </div>
                  <p className="text-foreground font-medium">{programLabel}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <span className="text-xs font-medium">Department</span>
                  </div>
                  <p className="text-foreground font-medium">Academic Mentorship</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">Bio</p>
                <p className="text-sm text-foreground mt-2">
                  {teacher?.bio ||
                    "Supporting learners with assignments, mentorship, and academic resources."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Update your profile information</DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="name">Full Name</FieldLabel>
                      <Input
                        id="name"
                        value={editedData?.name || ""}
                        onChange={(e) =>
                          setEditedData(
                            editedData ? { ...editedData, name: e.target.value } : editedData
                          )
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        value={editedData?.email || ""}
                        onChange={(e) =>
                          setEditedData(
                            editedData ? { ...editedData, email: e.target.value } : editedData
                          )
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="phone">Phone</FieldLabel>
                      <Input
                        id="phone"
                        value={editedData?.phone || ""}
                        onChange={(e) =>
                          setEditedData(
                            editedData ? { ...editedData, phone: e.target.value } : editedData
                          )
                        }
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="bio">Bio</FieldLabel>
                      <Textarea
                        id="bio"
                        value={editedData?.bio || ""}
                        onChange={(e) =>
                          setEditedData(
                            editedData ? { ...editedData, bio: e.target.value } : editedData
                          )
                        }
                        rows={3}
                      />
                    </Field>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </Button>
                  </FieldGroup>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your teaching profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Full Name</p>
                  <p className="text-foreground">{teacher?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Position</p>
                  <p className="text-foreground">Teacher / Mentor</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Program</p>
                  <p className="text-foreground">{programLabel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Join Date</p>
                  <p className="text-foreground">January 15, 2020</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Auth ID</p>
                  <p className="text-foreground font-mono text-sm">
                    {teacher?.auth_id || "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Email</p>
                  <p className="text-foreground">{teacher?.email || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password regularly for security</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>Create a new password for your account</DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="current">Current Password</FieldLabel>
                      <Input id="current" type="password" placeholder="Enter current password" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="new">New Password</FieldLabel>
                      <Input id="new" type="password" placeholder="Enter new password" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirm">Confirm Password</FieldLabel>
                      <Input id="confirm" type="password" placeholder="Confirm new password" />
                    </Field>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Update Password
                    </Button>
                  </FieldGroup>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{log.action}</p>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{log.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
