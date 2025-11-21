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

interface ChargesData {
  id: string;
  country_id: string;
  responsible_courts: any;
  case_types: any;
  charge_sheets: any;
  created_at: string;
  countries?: { name: string };
}

const ChargesManager = () => {
  const [chargesData, setChargesData] = useState<ChargesData[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingData, setEditingData] = useState<ChargesData | null>(
    null
  );
  const [selectedCountry, setSelectedCountry] =
    useState<string>("all");
  const [dialogCountryId, setDialogCountryId] = useState<string>("");
  const [courtsInput, setCourtsInput] = useState("");
  const [caseTypesInput, setCaseTypesInput] = useState("");
  const [chargeSheetsInput, setChargeSheetsInput] = useState("");
  const [jsonErrors, setJsonErrors] = useState({
    courts: "",
    caseTypes: "",
    chargeSheets: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
    fetchCharges();
  }, []);

  useEffect(() => {
    fetchCharges();
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

  const fetchCharges = async () => {
    try {
      let query = supabase
        .from("charges")
        .select("*, countries(name)")
        .order("created_at", { ascending: false });

      if (selectedCountry !== "all") {
        query = query.eq("country_id", selectedCountry);
      }

      const { data, error } = await query;

      if (error) throw error;
      setChargesData(data || []);
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
    field: "courts" | "caseTypes" | "chargeSheets"
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

  const handleEdit = (data: ChargesData) => {
    setEditingData(data);
    setDialogCountryId(data.country_id);
    setCourtsInput(JSON.stringify(data.responsible_courts, null, 2));
    setCaseTypesInput(JSON.stringify(data.case_types, null, 2));
    setChargeSheetsInput(JSON.stringify(data.charge_sheets, null, 2));
    setJsonErrors({ courts: "", caseTypes: "", chargeSheets: "" });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    const courtsValid = validateJSON(courtsInput, "courts");
    const caseTypesValid = validateJSON(caseTypesInput, "caseTypes");
    const chargeSheetsValid = validateJSON(
      chargeSheetsInput,
      "chargeSheets"
    );

    if (!courtsValid || !caseTypesValid || !chargeSheetsValid) {
      setSubmitting(false);
      return;
    }

    try {
      const parsedCourts = JSON.parse(courtsInput);
      const parsedCaseTypes = JSON.parse(caseTypesInput);
      const parsedChargeSheets = JSON.parse(chargeSheetsInput);

      if (editingData) {
        const { error } = await supabase
          .from("charges")
          .update({
            country_id: dialogCountryId,
            responsible_courts: parsedCourts,
            case_types: parsedCaseTypes,
            charge_sheets: parsedChargeSheets,
          })
          .eq("id", editingData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Charges data updated successfully",
        });
      } else {
        const { error } = await supabase.from("charges").insert([
          {
            country_id: dialogCountryId,
            responsible_courts: parsedCourts,
            case_types: parsedCaseTypes,
            charge_sheets: parsedChargeSheets,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Charges data created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingData(null);
      setDialogCountryId("");
      setCourtsInput("");
      setCaseTypesInput("");
      setChargeSheetsInput("");
      fetchCharges();
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
    setCourtsInput(`[
  {
    "code": "federal",
    "name": "Federal Court",
    "description": "Federal jurisdiction",
    "icon": "Building"
  }
]`);
    setCaseTypesInput(`[
  {
    "code": "civil",
    "name": "Civil Cases",
    "description": "Civil matters"
  }
]`);
    setChargeSheetsInput(`{
  "Federal": [
    {
      "code": "assault",
      "title": "Assault",
      "severity": "Felony",
      "min_sentence": "1 year",
      "max_sentence": "20 years"
    }
  ]
}`);
    setJsonErrors({ courts: "", caseTypes: "", chargeSheets: "" });
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
          <h2 className="text-2xl font-semibold">Charges</h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage courts, case types, and charge sheets (JSONB)
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
                Add Charges Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingData
                    ? "Edit Charges Data"
                    : "Add New Charges Data"}
                </DialogTitle>
                <DialogDescription>
                  Manage courts, case types, and charge sheets in
                  JSONB format
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
                <Tabs defaultValue="courts" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="courts">Courts</TabsTrigger>
                    <TabsTrigger value="case-types">
                      Case Types
                    </TabsTrigger>
                    <TabsTrigger value="charge-sheets">
                      Charge Sheets
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="courts" className="space-y-2">
                    <Label>Responsible Courts JSON</Label>
                    <Textarea
                      value={courtsInput}
                      onChange={(e) => {
                        setCourtsInput(e.target.value);
                        validateJSON(e.target.value, "courts");
                      }}
                      className="font-mono text-sm min-h-[300px]"
                    />
                    {jsonErrors.courts && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {jsonErrors.courts}
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="case-types"
                    className="space-y-2"
                  >
                    <Label>Case Types JSON</Label>
                    <Textarea
                      value={caseTypesInput}
                      onChange={(e) => {
                        setCaseTypesInput(e.target.value);
                        validateJSON(e.target.value, "caseTypes");
                      }}
                      className="font-mono text-sm min-h-[300px]"
                    />
                    {jsonErrors.caseTypes && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {jsonErrors.caseTypes}
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  <TabsContent
                    value="charge-sheets"
                    className="space-y-2"
                  >
                    <Label>Charge Sheets JSON (by court type)</Label>
                    <Textarea
                      value={chargeSheetsInput}
                      onChange={(e) => {
                        setChargeSheetsInput(e.target.value);
                        validateJSON(e.target.value, "chargeSheets");
                      }}
                      className="font-mono text-sm min-h-[300px]"
                    />
                    {jsonErrors.chargeSheets && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {jsonErrors.chargeSheets}
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
                      !!jsonErrors.courts ||
                      !!jsonErrors.caseTypes ||
                      !!jsonErrors.chargeSheets ||
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
        {chargesData.length === 0 ? (
          <Card>
            <CardContent className="text-center text-slate-500 py-12">
              No charges data found. Add charges data for a country to
              get started.
            </CardContent>
          </Card>
        ) : (
          chargesData.map((data) => (
            <Card key={data.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{data.countries?.name}</CardTitle>
                    <CardDescription>
                      {Array.isArray(data.responsible_courts)
                        ? data.responsible_courts.length
                        : 0}{" "}
                      court(s),{" "}
                      {Array.isArray(data.case_types)
                        ? data.case_types.length
                        : 0}{" "}
                      case type(s),{" "}
                      {Object.keys(data.charge_sheets || {}).length}{" "}
                      charge sheet category(ies)
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
                <Tabs defaultValue="courts" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="courts">Courts</TabsTrigger>
                    <TabsTrigger value="case-types">
                      Case Types
                    </TabsTrigger>
                    <TabsTrigger value="charge-sheets">
                      Charge Sheets
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="courts">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                      {Array.isArray(data.responsible_courts) &&
                        data.responsible_courts.map(
                          (court: any, idx: number) => (
                            <div
                              key={idx}
                              className="border rounded p-2 bg-slate-50 text-xs"
                            >
                              <p className="font-medium">
                                {court.name}
                              </p>
                              <p className="text-slate-600">
                                {court.description}
                              </p>
                            </div>
                          )
                        )}
                    </div>
                  </TabsContent>

                  <TabsContent value="case-types">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                      {Array.isArray(data.case_types) &&
                        data.case_types.map(
                          (caseType: any, idx: number) => (
                            <div
                              key={idx}
                              className="border rounded p-2 bg-slate-50 text-xs"
                            >
                              <p className="font-medium">
                                {caseType.name}
                              </p>
                              <p className="text-slate-600">
                                {caseType.description}
                              </p>
                            </div>
                          )
                        )}
                    </div>
                  </TabsContent>

                  <TabsContent value="charge-sheets">
                    <div className="space-y-3 mt-2">
                      {data.charge_sheets &&
                        Object.entries(data.charge_sheets).map(
                          ([courtType, charges]: [string, any]) => (
                            <div
                              key={courtType}
                              className="border rounded-lg p-3 bg-slate-50"
                            >
                              <h4 className="font-semibold text-sm mb-2">
                                {courtType}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {Array.isArray(charges) &&
                                  charges
                                    .slice(0, 4)
                                    .map(
                                      (charge: any, idx: number) => (
                                        <div
                                          key={idx}
                                          className="border rounded p-2 bg-white text-xs"
                                        >
                                          <p className="font-medium">
                                            {charge.title}
                                          </p>
                                          <p className="text-slate-600">
                                            {charge.severity}
                                          </p>
                                        </div>
                                      )
                                    )}
                              </div>
                              {Array.isArray(charges) &&
                                charges.length > 4 && (
                                  <p className="text-xs text-slate-500 mt-2">
                                    +{charges.length - 4} more charges
                                  </p>
                                )}
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

export default ChargesManager;
