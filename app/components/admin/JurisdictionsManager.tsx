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
  Download,
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
  state_province: string | null;
  city: string | null;
  court: string | null;
  created_at: string | null;
  updated_at?: string | null;
  countries?: { name: string };
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
    state: "",
    city: "",
    court: "",
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
        .order("state_province")
        .order("city")
        .order("court");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingJurisdiction) {
        const { error } = await supabase
          .from("jurisdiction")
          .update({
            country_id: formData.country_id,
            state_province: formData.state,
            city: formData.city,
            court: formData.court,
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
            state_province: formData.state,
            city: formData.city,
            court: formData.court,
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
      setFormData({ country_id: "", state: "", city: "", court: "" });
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
      state: jurisdiction.state_province || "",
      city: jurisdiction.city || "",
      court: jurisdiction.court || "",
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
    setFormData({ country_id: "", state: "", city: "", court: "" });
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
      // Validate each item has required fields
      for (const item of parsed) {
        if (!item.state || !item.city || !item.court) {
          setBulkJsonError(
            "Each jurisdiction must have: state, city, court"
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

  const handleBulkImport = async (e: React.FormEvent<HTMLFormElement>) => {
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
          state_province: item.state,
          city: item.city,
          court: item.court,
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
    "state": "California",
    "city": "Los Angeles",
    "court": "Superior Court"
  },
  {
    "state": "California",
    "city": "San Francisco",
    "court": "Superior Court"
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
            Manage states, cities, and courts
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
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        state: e.target.value,
                      })
                    }
                    placeholder="e.g., California"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                      })
                    }
                    placeholder="e.g., Los Angeles"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="court">Court</Label>
                  <Input
                    id="court"
                    value={formData.court}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        court: e.target.value,
                      })
                    }
                    placeholder="e.g., Superior Court"
                    required
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
              <TableHead>State/Province</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Court</TableHead>
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
                    {jurisdiction.state_province || "N/A"}
                  </TableCell>
                  <TableCell>{jurisdiction.city || "N/A"}</TableCell>
                  <TableCell>{jurisdiction.court || "N/A"}</TableCell>
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
              Each jurisdiction must have: state, city, and court.
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
                placeholder='[{"state": "California", "city": "Los Angeles", "court": "Superior Court"}]'
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
                <strong>Format:</strong> Each object must contain
                "state", "city", and "court" fields. All jurisdictions
                will be assigned to the selected country.
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
