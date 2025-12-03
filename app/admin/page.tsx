"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Shield,
  Globe,
  Scale,
  Users,
  Gavel,
  FileText,
  UserCog,
  UsersRound,
  Lock,
  LogOut,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../../hooks/use-toast";
import CountriesManager from "../components/admin/CountriesManager";
import JurisdictionsManager from "../components/admin/JurisdictionsManager";
import CaseTypesManager from "../components/admin/CaseTypesManager";
import RolesManager from "../components/admin/RolesManager";
import ChargesManager from "../components/admin/ChargesManager";
import JudgesManager from "../components/admin/JudgesManager";
import JuryManager from "../components/admin/JuryManager";

// Simple credentials (In production, this should be in environment variables)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("countries");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authToken = sessionStorage.getItem("admin_auth");
    if (authToken === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "authenticated");
      toast({
        title: "Success",
        description: "Welcome to Admin Panel",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    setUsername("");
    setPassword("");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-slate-900">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="bg-white border-slate-300 text-slate-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-white border-slate-300 text-slate-900"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Lock className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </form>
            <div className="mt-4 p-3 bg-slate-100 rounded text-xs text-slate-600 text-center">
              <strong>Default Credentials:</strong>
              <br />
              Username: admin | Password: admin123
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Panel (authenticated users only)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1
                className="text-3xl font-bold text-slate-900"
                style={{ color: "#0f172a" }}
              >
                Admin Panel
              </h1>
            </div>
            <p
              className="text-slate-700"
              style={{ color: "#334155" }}
            >
              Manage legal CRM data across all countries and
              jurisdictions
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Main Content */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-7 gap-2 h-auto p-1 bg-slate-100">
              <TabsTrigger
                value="countries"
                className="flex items-center gap-2 py-3"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Countries</span>
              </TabsTrigger>
              <TabsTrigger
                value="jurisdictions"
                className="flex items-center gap-2 py-3"
              >
                <Scale className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Jurisdictions
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="case-types"
                className="flex items-center gap-2 py-3"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Case Types</span>
              </TabsTrigger>
              <TabsTrigger
                value="roles"
                className="flex items-center gap-2 py-3"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Roles</span>
              </TabsTrigger>
              <TabsTrigger
                value="charges"
                className="flex items-center gap-2 py-3"
              >
                <Gavel className="w-4 h-4" />
                <span className="hidden sm:inline">Charges</span>
              </TabsTrigger>
              <TabsTrigger
                value="judges"
                className="flex items-center gap-2 py-3"
              >
                <UserCog className="w-4 h-4" />
                <span className="hidden sm:inline">Judges</span>
              </TabsTrigger>
              <TabsTrigger
                value="jury"
                className="flex items-center gap-2 py-3"
              >
                <UsersRound className="w-4 h-4" />
                <span className="hidden sm:inline">Jury</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="countries" className="m-0">
                <CountriesManager />
              </TabsContent>

              <TabsContent value="jurisdictions" className="m-0">
                <JurisdictionsManager />
              </TabsContent>

              <TabsContent value="case-types" className="m-0">
                <CaseTypesManager />
              </TabsContent>

              <TabsContent value="roles" className="m-0">
                <RolesManager />
              </TabsContent>

              <TabsContent value="charges" className="m-0">
                <ChargesManager />
              </TabsContent>

              <TabsContent value="judges" className="m-0">
                <JudgesManager />
              </TabsContent>

              <TabsContent value="jury" className="m-0">
                <JuryManager />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
