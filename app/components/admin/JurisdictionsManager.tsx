import { useEffect, useState } from "react";
import { supabase } from "../../admin/supabase/client";
import { useToast } from "../../../hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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
  Trash2,
  Loader2,
  Filter,
  Upload,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";

interface Country {
  id: string;
  name: string;
}

interface Jurisdiction {
  id: string;
  country_id: string;
  name: string | null;
  type: string | null;
  code: string | null;
  created_at: string | null;
  updated_at?: string | null;
  countries?: { name: string } | null;
}

const JurisdictionsManager = () => {
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>(
    []
  );
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [editingJurisdiction, setEditingJurisdiction] =
    useState<Jurisdiction | null>(null);
  const [deleteJurisdictionId, setDeleteJurisdictionId] = useState<
    string | null
  >(null);
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [formData, setFormData] = useState({
    country_id: "",
    name: "",
    type: "",
    code: "",
  });
  const [bulkJsonInput, setBulkJsonInput] = useState("");
  const [bulkCountryId, setBulkCountryId] = useState("");
  const [bulkJsonError, setBulkJsonError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
    fetchJurisdictions();
  }, []);

  useEffect(() => {
    fetchJurisdictions();
  }, [filterCountry]);

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

  const fetchJurisdictions = async () => {
    try {
      let query = supabase
        .from("jurisdiction")
        .select("*, countries(name)")
        .order("name")
        .order("type")
        .order("code");

      if (filterCountry !== "all") {
        query = query.eq("country_id", filterCountry);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJurisdictions(data || []);
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

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingJurisdiction) {
        const { error } = await supabase
          .from("jurisdiction")
          .update({
            country_id: formData.country_id,
            name: formData.name || null,
            type: formData.type || null,
            code: formData.code || null,
          })
          .eq("id", editingJurisdiction.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Jurisdiction updated successfully",
        });
      } else {
        const { error } = await supabase.from("jurisdiction").insert([
          {
            country_id: formData.country_id,
            name: formData.name || null,
            type: formData.type || null,
            code: formData.code || null,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Jurisdiction created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingJurisdiction(null);
      setFormData({ country_id: "", name: "", type: "", code: "" });
      fetchJurisdictions();
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

  const handleEdit = (jurisdiction: Jurisdiction) => {
    setEditingJurisdiction(jurisdiction);
    setFormData({
      country_id: jurisdiction.country_id,
      name: jurisdiction.name || "",
      type: jurisdiction.type || "",
      code: jurisdiction.code || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteJurisdictionId) return;

    try {
      const { error } = await supabase
        .from("jurisdiction")
        .delete()
        .eq("id", deleteJurisdictionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Jurisdiction deleted successfully",
      });

      fetchJurisdictions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteJurisdictionId(null);
    }
  };

  const openCreateDialog = () => {
    setEditingJurisdiction(null);
    setFormData({ country_id: "", name: "", type: "", code: "" });
    setIsDialogOpen(true);
  };

  const validateBulkJson = (value: string): boolean => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        setBulkJsonError(
          "JSON must be an array of jurisdiction objects"
        );
        return false;
      }
      // Valid keys for jurisdictions
      const validKeys = ["name", "type", "code"];
      const invalidKeys = [
        "normalized_level",
        "branch",
        "country_id",
        "jurisdiction_id",
      ];

      // Validate each item
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];

        // Check required field
        if (!item.name) {
          setBulkJsonError(
            `Item ${
              i + 1
            }: Each jurisdiction must have a 'name' field`
          );
          return false;
        }

        // Check for invalid keys (court_levels keys)
        const itemKeys = Object.keys(item);
        const foundInvalidKeys = itemKeys.filter((key) =>
          invalidKeys.includes(key)
        );
        if (foundInvalidKeys.length > 0) {
          setBulkJsonError(
            `Item ${
              i + 1
            }: Invalid keys found: ${foundInvalidKeys.join(
              ", "
            )}. Valid keys are: ${validKeys.join(", ")}`
          );
          return false;
        }

        // Check for unknown keys (optional but helpful)
        const unknownKeys = itemKeys.filter(
          (key) => !validKeys.includes(key)
        );
        if (unknownKeys.length > 0) {
          setBulkJsonError(
            `Item ${i + 1}: Unknown keys found: ${unknownKeys.join(
              ", "
            )}. Valid keys are: ${validKeys.join(", ")}`
          );
          return false;
        }
      }
      setBulkJsonError("");
      return true;
    } catch (e: any) {
      setBulkJsonError(e.message);
      return false;
    }
  };

  const handleBulkImport = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!bulkCountryId) {
      toast({
        title: "Error",
        description: "Please select a country",
        variant: "destructive",
      });
      return;
    }

    if (!validateBulkJson(bulkJsonInput)) {
      return;
    }

    setSubmitting(true);
    try {
      const jurisdictionsData = JSON.parse(bulkJsonInput);
      const jurisdictionsToInsert = jurisdictionsData.map(
        (item: any) => ({
          country_id: bulkCountryId,
          name: item.name || null,
          type: item.type || null,
          code: item.code || null,
        })
      );

      const { error } = await supabase
        .from("jurisdiction")
        .insert(jurisdictionsToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully imported ${jurisdictionsToInsert.length} jurisdiction(s)`,
      });

      setIsBulkDialogOpen(false);
      setBulkJsonInput("");
      setBulkCountryId("");
      setBulkJsonError("");
      fetchJurisdictions();
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

  const openBulkImportDialog = () => {
    setBulkJsonInput(`[
  {
    "name": "New York",
    "type": "State",
    "code": "NY"
  },
  {
    "name": "California",
    "type": "State",
    "code": "CA"
  }
]`);
    setBulkCountryId("");
    setBulkJsonError("");
    setIsBulkDialogOpen(true);
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
          <h2 className="text-2xl font-semibold">Jurisdictions</h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage jurisdictions with name, type, and code
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={filterCountry}
            onValueChange={setFilterCountry}
          >
            <SelectTrigger className="w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
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

          <Button variant="outline" onClick={openBulkImportDialog}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Jurisdiction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingJurisdiction
                    ? "Edit Jurisdiction"
                    : "Add New Jurisdiction"}
                </DialogTitle>
                <DialogDescription>
                  {editingJurisdiction
                    ? "Update jurisdiction information"
                    : "Create a new jurisdiction entry"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country_id: value })
                    }
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g., New York"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type (Optional)</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value,
                      })
                    }
                    placeholder="e.g., State, Province, Region"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Code (Optional)</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value,
                      })
                    }
                    placeholder="e.g., NY, CA"
                  />
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
                  <Button type="submit" disabled={submitting}>
                    {submitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingJurisdiction ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jurisdictions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-500 py-8"
                >
                  No jurisdictions found. Add your first jurisdiction
                  to get started.
                </TableCell>
              </TableRow>
            ) : (
              jurisdictions.map((jurisdiction) => (
                <TableRow key={jurisdiction.id}>
                  <TableCell>
                    {jurisdiction.countries?.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {jurisdiction.name || "N/A"}
                  </TableCell>
                  <TableCell>{jurisdiction.type || "N/A"}</TableCell>
                  <TableCell>
                    {jurisdiction.code ? (
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                        {jurisdiction.code}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(jurisdiction)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDeleteJurisdictionId(jurisdiction.id)
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteJurisdictionId}
        onOpenChange={() => setDeleteJurisdictionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this jurisdiction. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Import Dialog */}
      <Dialog
        open={isBulkDialogOpen}
        onOpenChange={setIsBulkDialogOpen}
      >
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Import Jurisdictions</DialogTitle>
            <DialogDescription>
              Import multiple jurisdictions at once using JSON format.
              Each jurisdiction must have a name field.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBulkImport} className="space-y-4">
            <div>
              <Label htmlFor="bulk-country">Select Country</Label>
              <Select
                value={bulkCountryId}
                onValueChange={setBulkCountryId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country for these jurisdictions" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bulk-json">Jurisdictions JSON</Label>
              <p className="text-xs text-slate-500 mb-2">
                Paste or edit JSON array with jurisdiction objects
              </p>
              <Textarea
                id="bulk-json"
                value={bulkJsonInput}
                onChange={(e) => {
                  setBulkJsonInput(e.target.value);
                  validateBulkJson(e.target.value);
                }}
                className="font-mono text-sm min-h-[400px]"
                placeholder='[{"name": "New York", "type": "State", "code": "NY"}]'
                required
              />
              {bulkJsonError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{bulkJsonError}</AlertDescription>
                </Alert>
              )}
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Format:</strong> Each object must contain a
                "name" field. "type" and "code" fields are optional.
                All jurisdictions will be assigned to the selected
                country.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBulkDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  submitting || !!bulkJsonError || !bulkCountryId
                }
              >
                {submitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                <Upload className="w-4 h-4 mr-2" />
                Import Jurisdictions
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JurisdictionsManager;
