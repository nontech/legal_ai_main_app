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

interface CourtLevel {
  id: string;
  country_id: string | null;
  name: string | null;
  normalized_level: string | null;
  branch: string | null;
  created_at: string;
  countries?: { name: string } | null;
}

const CourtLevelsManager = () => {
  const [courtLevels, setCourtLevels] = useState<CourtLevel[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [editingCourtLevel, setEditingCourtLevel] =
    useState<CourtLevel | null>(null);
  const [deleteCourtLevelId, setDeleteCourtLevelId] = useState<
    string | null
  >(null);
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [formData, setFormData] = useState({
    country_id: "",
    name: "",
    normalized_level: "",
    branch: "",
  });
  const [bulkJsonInput, setBulkJsonInput] = useState("");
  const [bulkCountryId, setBulkCountryId] = useState("");
  const [bulkJsonError, setBulkJsonError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
    fetchCourtLevels();
  }, []);

  useEffect(() => {
    fetchCourtLevels();
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

  const fetchCourtLevels = async () => {
    try {
      let query = supabase
        .from("court_levels")
        .select("*, countries(name)")
        .order("created_at", { ascending: false });

      if (filterCountry !== "all") {
        query = query.eq("country_id", filterCountry);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCourtLevels(data || []);
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
      if (editingCourtLevel) {
        const { error } = await supabase
          .from("court_levels")
          .update({
            country_id: formData.country_id || null,
            name: formData.name || null,
            normalized_level: formData.normalized_level || null,
            branch: formData.branch || null,
          })
          .eq("id", editingCourtLevel.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Court level updated successfully",
        });
      } else {
        const { error } = await supabase.from("court_levels").insert([
          {
            country_id: formData.country_id || null,
            name: formData.name || null,
            normalized_level: formData.normalized_level || null,
            branch: formData.branch || null,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Court level created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingCourtLevel(null);
      setFormData({
        country_id: "",
        name: "",
        normalized_level: "",
        branch: "",
      });
      fetchCourtLevels();
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

  const handleEdit = (courtLevel: CourtLevel) => {
    setEditingCourtLevel(courtLevel);
    setFormData({
      country_id: courtLevel.country_id || "",
      name: courtLevel.name || "",
      normalized_level: courtLevel.normalized_level || "",
      branch: courtLevel.branch || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteCourtLevelId) return;

    try {
      const { error } = await supabase
        .from("court_levels")
        .delete()
        .eq("id", deleteCourtLevelId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Court level deleted successfully",
      });

      fetchCourtLevels();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteCourtLevelId(null);
    }
  };

  const openCreateDialog = () => {
    setEditingCourtLevel(null);
    setFormData({
      country_id: "",
      name: "",
      normalized_level: "",
      branch: "",
    });
    setIsDialogOpen(true);
  };

  const validateBulkJson = (value: string): boolean => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        setBulkJsonError(
          "JSON must be an array of court level objects"
        );
        return false;
      }
      // Valid keys for court levels
      const validKeys = ["name", "normalized_level", "branch"];
      const invalidKeys = [
        "type",
        "code",
        "country_id",
        "jurisdiction_id",
      ];

      // Validate each item
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];

        // Check required field
        if (!item.name) {
          setBulkJsonError(
            `Item ${i + 1}: Each court level must have a 'name' field`
          );
          return false;
        }

        // Check for invalid keys (jurisdiction keys)
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
      const courtLevelsData = JSON.parse(bulkJsonInput);
      const courtLevelsToInsert = courtLevelsData.map(
        (item: any) => ({
          country_id: bulkCountryId,
          name: item.name || null,
          normalized_level: item.normalized_level || null,
          branch: item.branch || null,
        })
      );

      const { error } = await supabase
        .from("court_levels")
        .insert(courtLevelsToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully imported ${courtLevelsToInsert.length} court level(s)`,
      });

      setIsBulkDialogOpen(false);
      setBulkJsonInput("");
      setBulkCountryId("");
      setBulkJsonError("");
      fetchCourtLevels();
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
    "name": "Trial Court",
    "normalized_level": "Level 1",
    "branch": "Criminal"
  },
  {
    "name": "Appellate Court",
    "normalized_level": "Level 2",
    "branch": "Civil"
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
          <h2 className="text-2xl font-semibold">Court Levels</h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage court hierarchy levels and branches
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
                Add Court Level
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCourtLevel
                    ? "Edit Court Level"
                    : "Add New Court Level"}
                </DialogTitle>
                <DialogDescription>
                  {editingCourtLevel
                    ? "Update court level information"
                    : "Create a new court level entry"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="country">
                    Country{" "}
                    {formData.country_id === "" && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Select
                    value={formData.country_id}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        country_id: value,
                      })
                    }
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
                    placeholder="e.g., Trial Court, Appellate Court"
                  />
                </div>

                <div>
                  <Label htmlFor="normalized_level">
                    Normalized Level (Optional)
                  </Label>
                  <Input
                    id="normalized_level"
                    value={formData.normalized_level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        normalized_level: e.target.value,
                      })
                    }
                    placeholder="e.g., Level 1, Level 2"
                  />
                </div>

                <div>
                  <Label htmlFor="branch">Branch (Optional)</Label>
                  <Input
                    id="branch"
                    value={formData.branch}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        branch: e.target.value,
                      })
                    }
                    placeholder="e.g., Criminal, Civil, Family"
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
                  <Button
                    type="submit"
                    disabled={submitting || !formData.country_id}
                  >
                    {submitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingCourtLevel ? "Update" : "Create"}
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
              <TableHead>Normalized Level</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courtLevels.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-slate-500 py-8"
                >
                  No court levels found. Add your first court level to
                  get started.
                </TableCell>
              </TableRow>
            ) : (
              courtLevels.map((courtLevel) => (
                <TableRow key={courtLevel.id}>
                  <TableCell>
                    {courtLevel.countries?.name || "N/A"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {courtLevel.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {courtLevel.normalized_level || "—"}
                  </TableCell>
                  <TableCell>{courtLevel.branch || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(courtLevel)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setDeleteCourtLevelId(courtLevel.id)
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
        open={!!deleteCourtLevelId}
        onOpenChange={() => setDeleteCourtLevelId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this court level. Any
              courts assigned to this level will also be affected.
              This action cannot be undone.
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
            <DialogTitle>Bulk Import Court Levels</DialogTitle>
            <DialogDescription>
              Import multiple court levels at once using JSON format.
              Each court level must have a name field.
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
                  <SelectValue placeholder="Select a country for these court levels" />
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
              <Label htmlFor="bulk-json">Court Levels JSON</Label>
              <p className="text-xs text-slate-500 mb-2">
                Paste or edit JSON array with court level objects
              </p>
              <Textarea
                id="bulk-json"
                value={bulkJsonInput}
                onChange={(e) => {
                  setBulkJsonInput(e.target.value);
                  validateBulkJson(e.target.value);
                }}
                className="font-mono text-sm min-h-[400px]"
                placeholder='[{"name": "Trial Court", "normalized_level": "Level 1", "branch": "Criminal"}]'
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
                "name" field. "normalized_level" and "branch" fields
                are optional. All court levels will be assigned to the
                selected country.
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
                Import Court Levels
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourtLevelsManager;
