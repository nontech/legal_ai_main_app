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

interface CaseTypeData {
  id: string;
  country_id: string;
  case_types: any;
  created_at: string | null;
  updated_at?: string | null;
  countries?: { name: string } | null;
}

const CaseTypesManager = () => {
  const [caseTypeData, setCaseTypeData] = useState<CaseTypeData[]>(
    []
  );
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<CaseTypeData | null>(
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
    fetchCaseTypes();
  }, []);

  useEffect(() => {
    fetchCaseTypes();
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

  const fetchCaseTypes = async () => {
    try {
      let query = supabase
        .from("case_type")
        .select("*, countries(name)")
        .order("created_at", { ascending: false });

      if (selectedCountry !== "all") {
        query = query.eq("country_id", selectedCountry);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCaseTypeData(data || []);
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

  const handleEdit = (data: CaseTypeData) => {
    setEditingData(data);
    setDialogCountryId(data.country_id);
    setJsonInput(JSON.stringify(data.case_types, null, 2));
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
          .from("case_type")
          .update({
            country_id: dialogCountryId,
            case_types: parsedJson,
          })
          .eq("id", editingData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Case types updated successfully",
        });
      } else {
        const { error } = await supabase.from("case_type").insert([
          {
            country_id: dialogCountryId,
            case_types: parsedJson,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Case types created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingData(null);
      setDialogCountryId("");
      setJsonInput("");
      fetchCaseTypes();
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
  "civil": {
    "code": "civil",
    "name": "Civil Law",
    "description": "Private disputes between parties",
    "icon": "Scale",
    "typical_cases": [
      "Personal Injury & Negligence Claims",
      "Contract Disputes"
    ],
    "standard_of_proof": "Preponderance of evidence"
  }
}`);
    setJsonError("");
    setIsDialogOpen(true);
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
          <h2 className="text-2xl font-semibold">Case Types</h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage legal case type definitions (JSONB)
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
                Add Case Types
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingData
                    ? "Edit Case Types"
                    : "Add New Case Types"}
                </DialogTitle>
                <DialogDescription>
                  Edit the JSONB structure for case types. Each case
                  type should have: code, name, description, icon,
                  typical_cases (array), and standard_of_proof.
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
                  <Label htmlFor="json">Case Types JSON</Label>
                  <Textarea
                    id="json"
                    value={jsonInput}
                    onChange={(e) => {
                      setJsonInput(e.target.value);
                      validateJSON(e.target.value);
                    }}
                    className="font-mono text-sm min-h-[400px]"
                    placeholder='{"civil": {...}, "criminal": {...}}'
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
        {caseTypeData.length === 0 ? (
          <Card>
            <CardContent className="text-center text-slate-500 py-12">
              No case types found. Add case types for a country to get
              started.
            </CardContent>
          </Card>
        ) : (
          caseTypeData.map((data) => (
            <Card key={data.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{data.countries?.name}</CardTitle>
                    <CardDescription>
                      {Object.keys(data.case_types || {}).length} case
                      type(s) defined
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(data.case_types || {}).map(
                    ([key, value]: [string, any]) => (
                      <div
                        key={key}
                        className="border rounded-lg p-3 bg-slate-50"
                      >
                        <h4 className="font-semibold text-sm">
                          {value.name || key}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          {value.description || "No description"}
                        </p>
                        {value.typical_cases && (
                          <p className="text-xs text-slate-500 mt-2">
                            {value.typical_cases.length} typical
                            case(s)
                          </p>
                        )}
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

export default CaseTypesManager;
