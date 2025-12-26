import { useEffect, useState } from "react";
import { supabase } from "../../admin/supabase/client";
import { useToast } from "../../../hooks/use-toast";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  Pencil,
  Loader2,
  Save,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface Country {
  id: string;
  name: string;
}

interface RoleData {
  id: string;
  country_id: string;
  role_types: any;
  created_at: string | null;
  updated_at?: string | null;
  countries?: { name: string } | null;
}

const RolesManager = () => {
  const [roleData, setRoleData] = useState<RoleData[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<RoleData | null>(
    null
  );
  const [selectedCountry, setSelectedCountry] =
    useState<string>("all");
  const [dialogCountryId, setDialogCountryId] = useState<string>("");
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [selectedCountry]);

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from("countries")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      setCountries(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchRoles = async () => {
    try {
      let query = supabase
        .from("role")
        .select("*, countries(name)")
        .order("created_at", { ascending: false });

      if (selectedCountry !== "all") {
        query = query.eq("country_id", selectedCountry);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRoleData(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateJSON = (value: string): boolean => {
    try {
      JSON.parse(value);
      setJsonError("");
      return true;
    } catch (e: any) {
      setJsonError(e.message);
      return false;
    }
  };

  const handleEdit = (data: RoleData) => {
    setEditingData(data);
    setDialogCountryId(data.country_id);
    setJsonInput(JSON.stringify(data.role_types, null, 2));
    setJsonError("");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!dialogCountryId) {
      toast({
        title: "Error",
        description: "Please select a country",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    if (!validateJSON(jsonInput)) {
      setSubmitting(false);
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonInput);

      if (editingData) {
        const { error } = await supabase
          .from("role")
          .update({
            country_id: dialogCountryId,
            role_types: parsedJson,
          })
          .eq("id", editingData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Roles updated successfully",
        });
      } else {
        const { error } = await supabase.from("role").insert([
          {
            country_id: dialogCountryId,
            role_types: parsedJson,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Roles created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingData(null);
      setDialogCountryId("");
      setJsonInput("");
      fetchRoles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateDialog = () => {
    setEditingData(null);
    setDialogCountryId("");
    setJsonInput(`{
  "civil": [
    {
      "code": "plaintiff",
      "title": "Plaintiff",
      "description": "The party who initiates the lawsuit",
      "icon": "User",
      "responsibilities": ["File complaint", "Present evidence"],
      "strategic_focus": "Prove liability and damages"
    }
  ]
}`);
    setJsonError("");
    setIsDialogOpen(true);
  };

  const countTotalRoles = (roleTypes: any): number => {
    if (!roleTypes || typeof roleTypes !== "object") return 0;
    let total = 0;
    Object.values(roleTypes).forEach((roles: any) => {
      if (Array.isArray(roles)) {
        total += roles.length;
      }
    });
    return total;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Roles</h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage role definitions by case type (JSONB)
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedCountry}
            onValueChange={setSelectedCountry}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.id}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Roles
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingData ? "Edit Roles" : "Add New Roles"}
                </DialogTitle>
                <DialogDescription>
                  Edit the JSONB structure for roles organized by case
                  type. Each role should have: code, title,
                  description, icon, responsibilities (array), and
                  strategic_focus.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={dialogCountryId}
                    onValueChange={setDialogCountryId}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="json">Roles JSON</Label>
                  <Textarea
                    id="json"
                    value={jsonInput}
                    onChange={(e) => {
                      setJsonInput(e.target.value);
                      validateJSON(e.target.value);
                    }}
                    className="font-mono text-sm min-h-[400px]"
                    placeholder='{"civil": [...], "criminal": [...]}'
                  />
                  {jsonError && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{jsonError}</AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      submitting || !!jsonError || !dialogCountryId
                    }
                  >
                    {submitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    <Save className="w-4 h-4 mr-2" />
                    {editingData ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {roleData.length === 0 ? (
          <Card>
            <CardContent className="text-center text-slate-500 py-12">
              No roles found. Add roles for a country to get started.
            </CardContent>
          </Card>
        ) : (
          roleData.map((data) => (
            <Card key={data.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{data.countries?.name}</CardTitle>
                    <CardDescription>
                      {countTotalRoles(data.role_types)} role(s)
                      across{" "}
                      {Object.keys(data.role_types || {}).length} case
                      type(s)
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(data)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit JSON
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.role_types || {}).map(
                    ([caseType, roles]: [string, any]) => (
                      <div
                        key={caseType}
                        className="border rounded-lg p-4 bg-slate-50"
                      >
                        <h4 className="font-semibold text-sm mb-3 capitalize">
                          {caseType} Roles
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {Array.isArray(roles) &&
                            roles.map((role: any, idx: number) => (
                              <div
                                key={idx}
                                className="border rounded p-2 bg-white text-xs"
                              >
                                <p className="font-medium">
                                  {role.title || role.code}
                                </p>
                                <p className="text-slate-600 truncate">
                                  {role.description}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RolesManager;
