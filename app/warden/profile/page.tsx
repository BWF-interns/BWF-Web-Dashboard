'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/warden/Template/components/ui/card';
import { Button } from '@/app/warden/Template/components/ui/button';
import { Input } from '@/app/warden/Template/components/ui/input';
import { Textarea } from '@/app/warden/Template/components/ui/textarea';
import { Badge } from '@/app/warden/Template/components/ui/badge';
import { FieldGroup, Field, FieldLabel } from '@/app/warden/Template/components/ui/field';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/warden/Template/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/app/warden/Template/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/warden/Template/components/ui/tabs';

export default function ProfilePage() {
  const [warden, setWarden] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:5000/api/warden/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWarden(data);
        setEditedData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = () => {
    // In a real app, you'd send this to the API
    setWarden(editedData);
    setIsEditingProfile(false);
  };

  if (loading) return (
    <div className="p-8 animate-pulse space-y-6">
      <div className="h-10 w-48 bg-muted rounded" />
      <div className="h-4 w-64 bg-muted rounded" />
      <Card className="h-64 bg-muted" />
    </div>
  );

  const activityLog = [
    { id: 1, action: 'LoggedIn', details: 'Successful login from Chrome', date: 'Today' },
    { id: 2, action: 'Updated Profile', details: 'Changed contact information', date: 'Yesterday' },
  ];

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Header Card */}
      <Card className="border border-border animate-scale-in">
        <CardContent className="pt-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-24 h-24 rounded-lg bg-primary/20 flex items-center justify-center text-primary mb-4 overflow-hidden">
                {warden?.profilePic ? (
                  <img src={warden.profilePic} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-foreground">{warden?.name || 'Warden'}</h2>
              <p className="text-sm text-muted-foreground mt-1">Hostel Warden - {warden?.hostelName || 'General'}</p>
              <Badge className="mt-3 bg-primary/10 text-primary">Active</Badge>
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-medium">Email</span>
                  </div>
                  <p className="text-foreground font-medium">{warden?.email || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-medium">Phone</span>
                  </div>
                  <p className="text-foreground font-medium">{warden?.phone || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-medium">Location</span>
                  </div>
                  <p className="text-foreground font-medium">{warden?.hostelName || 'N/A'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <span className="text-xs font-medium">Department</span>
                  </div>
                  <p className="text-foreground font-medium">Student Welfare</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">Bio</p>
                <p className="text-sm text-foreground mt-2">
                  {warden?.bio || 'Dedicated to ensuring student welfare and maintaining a safe hostel environment.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
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
                        value={editedData?.name || ''}
                        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        value={editedData?.email || ''}
                        onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="phone">Phone</FieldLabel>
                      <Input
                        id="phone"
                        value={editedData?.phone || ''}
                        onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="bio">Bio</FieldLabel>
                      <Textarea
                        id="bio"
                        value={editedData?.bio || ''}
                        onChange={(e) => setEditedData({ ...editedData, bio: e.target.value })}
                        rows={3}
                      />
                    </Field>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white"
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

      {/* Tabs */}
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your hostel profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Full Name</p>
                  <p className="text-foreground">{warden?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Position</p>
                  <p className="text-foreground">Hostel Warden</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Hostel</p>
                  <p className="text-foreground">{warden?.hostelName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Join Date</p>
                  <p className="text-foreground">January 15, 2020</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Email</p>
                  <p className="text-foreground">{warden?.email || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
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
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Update Password
                    </Button>
                  </FieldGroup>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log */}
        <TabsContent value="activity" className="space-y-4">
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
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

