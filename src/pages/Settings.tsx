
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Bell, 
  CreditCard, 
  Shield, 
  Users, 
  Globe, 
  MailCheck,
  CloudCog,
  Save
} from "lucide-react";
import { toast } from "sonner";

// Form schemas for different settings sections
const companyFormSchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  taxId: z.string().optional(),
});

const notificationsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  inAppNotifications: z.boolean().default(true),
  dailyDigest: z.boolean().default(false),
  invoiceReminders: z.boolean().default(true),
  projectUpdates: z.boolean().default(true),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;
type NotificationValues = z.infer<typeof notificationsSchema>;

const Settings = () => {
  // Company form
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "Acme Inc.",
      website: "https://acme.example.com",
      address: "123 Business Ave, Suite 200, New York, NY 10001",
      taxId: "12-3456789",
    },
  });

  // Notifications form
  const notificationsForm = useForm<NotificationValues>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      inAppNotifications: true,
      dailyDigest: false,
      invoiceReminders: true,
      projectUpdates: true,
    },
  });

  // Form submission handlers
  const onCompanySubmit = (data: CompanyFormValues) => {
    toast.success("Company information updated successfully");
    console.log("Company data:", data);
  };

  const onNotificationsSubmit = (data: NotificationValues) => {
    toast.success("Notification preferences updated successfully");
    console.log("Notification data:", data);
  };

  return (
    <div className="container mx-auto space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button variant="outline">
          <CloudCog className="mr-2 h-4 w-4" />
          System Status
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Manage your account settings and preferences.
      </p>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and business information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...companyForm}>
                <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-4">
                  <FormField
                    control={companyForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={companyForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax ID / VAT Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Tax ID or VAT number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={companyForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>
                Configure time zone, language and date format preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select defaultValue="america_new_york">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>North America</SelectLabel>
                        <SelectItem value="america_new_york">Eastern Time (ET)</SelectItem>
                        <SelectItem value="america_chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="america_denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="america_los_angeles">Pacific Time (PT)</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Europe</SelectLabel>
                        <SelectItem value="europe_london">London (GMT)</SelectItem>
                        <SelectItem value="europe_paris">Paris (CET)</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Asia</SelectLabel>
                        <SelectItem value="asia_tokyo">Tokyo (JST)</SelectItem>
                        <SelectItem value="asia_shanghai">Shanghai (CST)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue="mdy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive alerts and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Channels</h3>
                    
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="smsNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">SMS Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via SMS
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="inAppNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">In-App Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications within the application
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notification Types</h3>
                    
                    <FormField
                      control={notificationsForm.control}
                      name="dailyDigest"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Daily Digest</FormLabel>
                            <FormDescription>
                              Receive a daily summary of activities
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="invoiceReminders"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Invoice Reminders</FormLabel>
                            <FormDescription>
                              Get reminded about upcoming and overdue invoices
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationsForm.control}
                      name="projectUpdates"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Project Updates</FormLabel>
                            <FormDescription>
                              Receive notifications about project milestones and updates
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit">Save Preferences</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your subscription plan and payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/40 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Current Plan</h3>
                      <p className="text-sm text-muted-foreground">Professional Plan</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Next billing date</p>
                      <p className="font-medium">April 30, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">Change Plan</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 10/2025</p>
                        </div>
                      </div>
                      <Badge>Default</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">+ Add Payment Method</Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Billing History</h3>
                  <p className="text-sm text-muted-foreground mb-4">View and download your past invoices</p>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                      <span>Date</span>
                      <span>Amount</span>
                      <span className="text-right">Invoice</span>
                    </div>
                    <Separator />
                    {[
                      { date: "Mar 1, 2025", amount: "$49.00", id: "INV-0012" },
                      { date: "Feb 1, 2025", amount: "$49.00", id: "INV-0011" },
                      { date: "Jan 1, 2025", amount: "$49.00", id: "INV-0010" },
                    ].map((invoice) => (
                      <div key={invoice.id} className="grid grid-cols-3 py-2 text-sm">
                        <span>{invoice.date}</span>
                        <span>{invoice.amount}</span>
                        <div className="text-right">
                          <Button variant="link" className="h-auto p-0">
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Settings */}
        <TabsContent value="team" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage team members and their access permissions.
                  </CardDescription>
                </div>
                <Button>Invite Team Member</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-4 font-medium text-sm text-muted-foreground">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Role</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <Separator />
                  {[
                    { name: "John Doe", email: "john@example.com", role: "Admin" },
                    { name: "Jane Smith", email: "jane@example.com", role: "Manager" },
                    { name: "Robert Johnson", email: "robert@example.com", role: "Member" },
                    { name: "Emily Williams", email: "emily@example.com", role: "Member" },
                  ].map((member, index) => (
                    <React.Fragment key={index}>
                      <div className="grid grid-cols-4 p-4 items-center">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm">{member.email}</div>
                        <div>
                          <Badge
                            variant={member.role === "Admin" ? "default" : 
                              member.role === "Manager" ? "secondary" : "outline"}
                          >
                            {member.role}
                          </Badge>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                        </div>
                      </div>
                      {index < 3 && <Separator />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>
                Configure user roles and their access levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    name: "Admin", 
                    description: "Full access to all features and settings",
                    permissions: ["View all data", "Edit all data", "Manage users", "Billing access"]
                  },
                  { 
                    name: "Manager", 
                    description: "Access to manage projects and clients",
                    permissions: ["View all data", "Edit projects", "Edit clients", "Limited billing"]
                  },
                  { 
                    name: "Member", 
                    description: "Basic access to assigned projects",
                    permissions: ["View assigned data", "Edit assigned projects", "No billing access"]
                  },
                ].map((role, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{role.name}</h3>
                      <Button variant="outline" size="sm">Edit Role</Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                    <h4 className="text-sm font-medium mb-2">Permissions:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {role.permissions.map((permission, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckIcon className="h-4 w-4 text-green-500" />
                          <span>{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password and account security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Management</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your active sessions and devices
                </p>
                
                <div className="space-y-3">
                  {[
                    { device: "Windows PC", browser: "Chrome", location: "New York, USA", current: true },
                    { device: "iPhone 13", browser: "Safari", location: "Boston, USA", current: false },
                    { device: "MacBook Pro", browser: "Firefox", location: "Chicago, USA", current: false },
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center space-x-3">
                        <div className={`h-2 w-2 rounded-full ${session.current ? "bg-green-500" : "bg-amber-500"}`} />
                        <div>
                          <p className="font-medium">{session.device} • {session.browser}</p>
                          <p className="text-xs text-muted-foreground">{session.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.current && <Badge variant="outline">Current</Badge>}
                        {!session.current && <Button variant="ghost" size="sm">Log out</Button>}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline">Log out of all devices</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage API keys and access tokens for external integrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">API Keys</h3>
                    <p className="text-sm text-muted-foreground">
                      Create and manage API keys for integrations
                    </p>
                  </div>
                  <Button variant="outline">Generate New Key</Button>
                </div>
                
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 p-3 text-sm font-medium text-muted-foreground">
                    <div>Name</div>
                    <div>Created</div>
                    <div>Last Used</div>
                    <div className="text-right">Actions</div>
                  </div>
                  <Separator />
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No API keys created yet
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Missing components to import
const Label = FormLabel;
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
const Badge = ({ children, className, variant = "default" }: { children: React.ReactNode, className?: string, variant?: "default" | "secondary" | "outline" }) => {
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};
const Select = ({ children, defaultValue }: { children: React.ReactNode, defaultValue?: string }) => (
  <div className="relative w-full">
    <select className="w-full h-10 pl-3 pr-10 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
      {children}
    </select>
  </div>
);
const SelectTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SelectValue = ({ placeholder }: { placeholder?: string }) => <div>{placeholder}</div>;
const SelectContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SelectGroup = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SelectLabel = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => <option value={value}>{children}</option>;

export default Settings;
