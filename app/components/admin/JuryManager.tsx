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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Country {
  id: string;
  name: string;
}

interface JuryData {
  id: string;
  country_id: string;
  demographics: any;
  characteristics: any;
  is_active: boolean | null;
  created_at: string | null;
  updated_at?: string | null;
  countries?: { name: string } | null;
}

const JuryManager = () => {
  const [juryData, setJuryData] = useState<JuryData[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<JuryData | null>(
    null
  );
  const [selectedCountry, setSelectedCountry] =
    useState<string>("all");
  const [dialogCountryId, setDialogCountryId] = useState<string>("");
  const [demographicsInput, setDemographicsInput] = useState("");
  const [characteristicsInput, setCharacteristicsInput] =
    useState("");
  const [jsonErrors, setJsonErrors] = useState({
    demographics: "",
    characteristics: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
    fetchJuryData();
  }, []);

  useEffect(() => {
    fetchJuryData();
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

  const fetchJuryData = async () => {
    try {
      let query = supabase
        .from("jury")
        .select("*, countries(name)")
        .order("created_at", { ascending: false });

      if (selectedCountry !== "all") {
        query = query.eq("country_id", selectedCountry);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJuryData(data || []);
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

  const validateJSON = (
    value: string,
    field: "demographics" | "characteristics"
  ): boolean => {
    try {
      JSON.parse(value);
      setJsonErrors({ ...jsonErrors, [field]: "" });
      return true;
    } catch (e: any) {
      setJsonErrors({ ...jsonErrors, [field]: e.message });
      return false;
    }
  };

  const handleEdit = (data: JuryData) => {
    setEditingData(data);
    setDialogCountryId(data.country_id);
    setDemographicsInput(JSON.stringify(data.demographics, null, 2));
    setCharacteristicsInput(
      JSON.stringify(data.characteristics, null, 2)
    );
    setJsonErrors({ demographics: "", characteristics: "" });
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

    const demographicsValid = validateJSON(
      demographicsInput,
      "demographics"
    );
    const characteristicsValid = validateJSON(
      characteristicsInput,
      "characteristics"
    );

    if (!demographicsValid || !characteristicsValid) {
      setSubmitting(false);
      return;
    }

    try {
      const parsedDemographics = JSON.parse(demographicsInput);
      const parsedCharacteristics = JSON.parse(characteristicsInput);

      if (editingData) {
        const { error } = await supabase
          .from("jury")
          .update({
            country_id: dialogCountryId,
            demographics: parsedDemographics,
            characteristics: parsedCharacteristics,
          })
          .eq("id", editingData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Jury data updated successfully",
        });
      } else {
        const { error } = await supabase.from("jury").insert([
          {
            country_id: dialogCountryId,
            demographics: parsedDemographics,
            characteristics: parsedCharacteristics,
            is_active: true,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Jury data created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingData(null);
      setDialogCountryId("");
      setDemographicsInput("");
      setCharacteristicsInput("");
      fetchJuryData();
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
    setDemographicsInput(`[
  {
    "id": "young-adults",
    "label": "Young Adults (18-35)",
    "impact": "Generally more progressive, tech-savvy"
  }
]`);
    setCharacteristicsInput(`[
  {
    "id": "analytical",
    "label": "Analytical Thinkers",
    "impact": "Focus on evidence, logic, and detailed examination"
  }
]`);
    setJsonErrors({ demographics: "", characteristics: "" });
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
          <h2 className="text-2xl font-semibold">
            Jury Demographics & Characteristics
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage jury demographics and psychological characteristics
            (JSONB)
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
                Add Jury Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingData
                    ? "Edit Jury Data"
                    : "Add New Jury Data"}
                </DialogTitle>
                <DialogDescription>
                  Manage jury demographics and psychological
                  characteristics in JSONB format
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
                <Tabs defaultValue="demographics" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="demographics">
                      Demographics
                    </TabsTrigger>
                    <TabsTrigger value="characteristics">
                      Characteristics
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="demographics"
                    className="space-y-2"
                  >
                    <Label>Demographics JSON (Array)</Label>
                    <Textarea
                      value={demographicsInput}
                      onChange={(e) => {
                        setDemographicsInput(e.target.value);
                        validateJSON(e.target.value, "demographics");
                      }}
                      className="font-mono text-sm min-h-[400px]"
                      placeholder='[{"id": "...", "label": "...", "impact": "..."}]'
                    />
                    {jsonErrors.demographics && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {jsonErrors.demographics}
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="characteristics"
                    className="space-y-2"
                  >
                    <Label>Characteristics JSON (Array)</Label>
                    <Textarea
                      value={characteristicsInput}
                      onChange={(e) => {
                        setCharacteristicsInput(e.target.value);
                        validateJSON(
                          e.target.value,
                          "characteristics"
                        );
                      }}
                      className="font-mono text-sm min-h-[400px]"
                      placeholder='[{"id": "...", "label": "...", "impact": "..."}]'
                    />
                    {jsonErrors.characteristics && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {jsonErrors.characteristics}
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>
                </Tabs>

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
                      submitting ||
                      !!jsonErrors.demographics ||
                      !!jsonErrors.characteristics ||
                      !dialogCountryId
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
        {juryData.length === 0 ? (
          <Card>
            <CardContent className="text-center text-slate-500 py-12">
              No jury data found. Add jury data for a country to get
              started.
            </CardContent>
          </Card>
        ) : (
          juryData.map((data) => (
            <Card key={data.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{data.countries?.name}</CardTitle>
                    <CardDescription>
                      {Array.isArray(data.demographics)
                        ? data.demographics.length
                        : 0}{" "}
                      demographic(s),{" "}
                      {Array.isArray(data.characteristics)
                        ? data.characteristics.length
                        : 0}{" "}
                      characteristic(s)
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        data.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {data.is_active ? "Active" : "Inactive"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(data)}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="demographics" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="demographics">
                      Demographics
                    </TabsTrigger>
                    <TabsTrigger value="characteristics">
                      Characteristics
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="demographics">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {Array.isArray(data.demographics) &&
                        data.demographics.map(
                          (demo: any, idx: number) => (
                            <div
                              key={idx}
                              className="border rounded-lg p-3 bg-slate-50"
                            >
                              <h4 className="font-semibold text-sm">
                                {demo.label}
                              </h4>
                              <p className="text-xs text-slate-600 mt-1">
                                {demo.impact}
                              </p>
                            </div>
                          )
                        )}
                    </div>
                  </TabsContent>

                  <TabsContent value="characteristics">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {Array.isArray(data.characteristics) &&
                        data.characteristics.map(
                          (char: any, idx: number) => (
                            <div
                              key={idx}
                              className="border rounded-lg p-3 bg-slate-50"
                            >
                              <h4 className="font-semibold text-sm">
                                {char.label}
                              </h4>
                              <p className="text-xs text-slate-600 mt-1">
                                {char.impact}
                              </p>
                            </div>
                          )
                        )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default JuryManager;
