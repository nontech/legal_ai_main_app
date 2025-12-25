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
  Search,
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
  name: string | null;
}

interface CourtLevel {
  id: string;
  name: string | null;
}

interface Court {
  id: string;
  country_id: string | null;
  jurisdiction_id: string | null;
  court_level_id: string | null;
  name: string | null;
  official_name: string | null;
  created_at: string;
  countries?: { name: string };
  jurisdiction?: Jurisdiction;
  court_levels?: CourtLevel;
}

const CourtsManager = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [allCourts, setAllCourts] = useState<Court[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>(
    []
  );
  const [courtLevels, setCourtLevels] = useState<CourtLevel[]>([]);
  const [filterJurisdictions, setFilterJurisdictions] = useState<
    Jurisdiction[]
  >([]);
  const [filterCourtLevels, setFilterCourtLevels] = useState<
    CourtLevel[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Court | null>(
    null
  );
  const [deleteCourtId, setDeleteCourtId] = useState<string | null>(
    null
  );
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [filterJurisdiction, setFilterJurisdiction] =
    useState<string>("all");
  const [filterCourtLevel, setFilterCourtLevel] =
    useState<string>("all");
  const [formData, setFormData] = useState({
    country_id: "",
    jurisdiction_id: "",
    court_level_id: "",
    name: "",
    official_name: "",
  });
  const [bulkJsonInput, setBulkJsonInput] = useState("");
  const [bulkCountryId, setBulkCountryId] = useState("");
  const [bulkJsonError, setBulkJsonError] = useState("");
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
    fetchCourts();
  }, []);

  useEffect(() => {
    fetchCourts();
    setSelectedCourts([]);
  }, [filterCountry, filterJurisdiction, filterCourtLevel]);

  useEffect(() => {
    // Filter courts based on search query
    if (!searchQuery.trim()) {
      setCourts(allCourts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allCourts.filter(
        (court) =>
          court.name?.toLowerCase().includes(query) ||
          court.official_name?.toLowerCase().includes(query) ||
          court.countries?.name.toLowerCase().includes(query) ||
          court.jurisdiction?.name?.toLowerCase().includes(query) ||
          court.court_levels?.name?.toLowerCase().includes(query)
      );
      setCourts(filtered);
    }
    // Clear selections when search changes
    setSelectedCourts([]);
  }, [searchQuery, allCourts]);

  useEffect(() => {
    // Update filter dropdowns when country filter changes
    if (filterCountry !== "all") {
      fetchJurisdictionsForFilter(filterCountry);
      fetchCourtLevelsForFilter(filterCountry);
      // Reset jurisdiction and court level filters when country changes
      setFilterJurisdiction("all");
      setFilterCourtLevel("all");
    } else {
      setFilterJurisdictions([]);
      setFilterCourtLevels([]);
      setFilterJurisdiction("all");
      setFilterCourtLevel("all");
    }
  }, [filterCountry]);

  useEffect(() => {
    if (formData.country_id) {
      fetchJurisdictions(formData.country_id);
    } else {
      setJurisdictions([]);
    }
  }, [formData.country_id]);

  useEffect(() => {
    if (formData.country_id) {
      fetchCourtLevelsByCountry(formData.country_id);
    } else {
      setCourtLevels([]);
    }
  }, [formData.country_id]);

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

  const fetchJurisdictions = async (countryId: string) => {
    try {
      const { data, error } = await supabase
        .from("jurisdiction")
        .select("id, name")
        .eq("country_id", countryId)
        .order("name");

      if (error) throw error;
      setJurisdictions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchCourtLevelsByCountry = async (countryId: string) => {
    try {
      const { data, error } = await supabase
        .from("court_levels")
        .select("id, name")
        .eq("country_id", countryId)
        .order("name");

      if (error) throw error;
      setCourtLevels(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchJurisdictionsForFilter = async (countryId: string) => {
    try {
      const { data, error } = await supabase
        .from("jurisdiction")
        .select("id, name")
        .eq("country_id", countryId)
        .order("name");

      if (error) throw error;
      setFilterJurisdictions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchCourtLevelsForFilter = async (countryId: string) => {
    try {
      const { data, error } = await supabase
        .from("court_levels")
        .select("id, name")
        .eq("country_id", countryId)
        .order("name");

      if (error) throw error;
      setFilterCourtLevels(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchCourts = async () => {
    try {
      // Fetch all records by paginating through results
      // Supabase default limit is 1000, so we'll fetch in batches
      let allCourtsData: any[] = [];
      let page = 0;
      const pageSize = 1000;
      let hasMore = true;

      while (hasMore) {
        let query = supabase
          .from("courts")
          .select(
            "*, countries(name), jurisdiction(id, name), court_levels(id, name)"
          )
          .order("created_at", { ascending: false })
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (filterCountry !== "all") {
          query = query.eq("country_id", filterCountry);
        }

        if (filterJurisdiction !== "all") {
          query = query.eq("jurisdiction_id", filterJurisdiction);
        }

        if (filterCourtLevel !== "all") {
          query = query.eq("court_level_id", filterCourtLevel);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (data && data.length > 0) {
          allCourtsData = [...allCourtsData, ...data];
          // If we got fewer records than pageSize, we've reached the end
          hasMore = data.length === pageSize;
          page++;
        } else {
          hasMore = false;
        }
      }

      // Deduplicate records by ID to prevent duplicate key errors
      const uniqueCourtsMap = new Map<string, any>();
      allCourtsData.forEach((court) => {
        if (court.id && !uniqueCourtsMap.has(court.id)) {
          uniqueCourtsMap.set(court.id, court);
        }
      });
      const uniqueCourts = Array.from(uniqueCourtsMap.values());

      setAllCourts(uniqueCourts);
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
      if (editingCourt) {
        const { error } = await supabase
          .from("courts")
          .update({
            country_id: formData.country_id || null,
            jurisdiction_id: formData.jurisdiction_id || null,
            court_level_id: formData.court_level_id || null,
            name: formData.name || null,
            official_name: formData.official_name || null,
          })
          .eq("id", editingCourt.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Court updated successfully",
        });
      } else {
        const { error } = await supabase.from("courts").insert([
          {
            country_id: formData.country_id || null,
            jurisdiction_id: formData.jurisdiction_id || null,
            court_level_id: formData.court_level_id || null,
            name: formData.name || null,
            official_name: formData.official_name || null,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Court created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingCourt(null);
      setFormData({
        country_id: "",
        jurisdiction_id: "",
        court_level_id: "",
        name: "",
        official_name: "",
      });
      fetchCourts();
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

  const handleEdit = (court: Court) => {
    setEditingCourt(court);
    setFormData({
      country_id: court.country_id || "",
      jurisdiction_id: court.jurisdiction_id || "",
      court_level_id: court.court_level_id || "",
      name: court.name || "",
      official_name: court.official_name || "",
    });
    if (court.country_id) {
      fetchJurisdictions(court.country_id);
      fetchCourtLevelsByCountry(court.country_id);
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteCourtId) return;

    try {
      const { error } = await supabase
        .from("courts")
        .delete()
        .eq("id", deleteCourtId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Court deleted successfully",
      });

      setSelectedCourts([]);
      fetchCourts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteCourtId(null);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCourts(courts.map((court) => court.id));
    } else {
      setSelectedCourts([]);
    }
  };

  const handleSelectCourt = (courtId: string, checked: boolean) => {
    if (checked) {
      setSelectedCourts([...selectedCourts, courtId]);
    } else {
      setSelectedCourts(
        selectedCourts.filter((id) => id !== courtId)
      );
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCourts.length === 0) return;

    setSubmitting(true);
    try {
      // Filter out any invalid IDs (empty strings, null, undefined)
      const validIds = selectedCourts.filter(
        (id) => id && typeof id === "string" && id.trim() !== ""
      );

      if (validIds.length === 0) {
        toast({
          title: "Error",
          description: "No valid court IDs selected",
          variant: "destructive",
        });
        setSelectedCourts([]);
        setSubmitting(false);
        return;
      }

      // Supabase has a limit on .in() queries, so we'll batch if needed
      const batchSize = 100;
      let deletedCount = 0;
      let lastError: any = null;

      for (let i = 0; i < validIds.length; i += batchSize) {
        const batch = validIds.slice(i, i + batchSize);
        const { error } = await supabase
          .from("courts")
          .delete()
          .in("id", batch);

        if (error) {
          lastError = error;
          // Continue with other batches even if one fails
          continue;
        }
        deletedCount += batch.length;
      }

      if (lastError && deletedCount === 0) {
        // All batches failed
        throw lastError;
      }

      if (lastError && deletedCount > 0) {
        // Some succeeded, some failed
        toast({
          title: "Partial Success",
          description: `Deleted ${deletedCount} of ${validIds.length} court(s). Some deletions may have failed.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Success",
          description: `Successfully deleted ${deletedCount} court(s)`,
        });
      }

      setSelectedCourts([]);
      fetchCourts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete courts",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openCreateDialog = () => {
    setEditingCourt(null);
    setFormData({
      country_id: "",
      jurisdiction_id: "",
      court_level_id: "",
      name: "",
      official_name: "",
    });
    setJurisdictions([]);
    setCourtLevels([]);
    setIsDialogOpen(true);
  };

  const validateBulkJson = (value: string): boolean => {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        setBulkJsonError("JSON must be an array of court objects");
        return false;
      }
      // Valid keys for courts
      const validKeys = [
        "name",
        "official_name",
        "jurisdiction_id",
        "court_level_id",
      ];
      const invalidKeys = [
        "type",
        "code",
        "normalized_level",
        "branch",
        "country_id",
      ];

      // Validate each item
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];

        // Check required field
        if (!item.name) {
          setBulkJsonError(
            `Item ${i + 1}: Each court must have a 'name' field`
          );
          return false;
        }

        // Check for invalid keys
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
      const courtsData = JSON.parse(bulkJsonInput);
      const courtsToInsert = courtsData.map((item: any) => ({
        country_id: bulkCountryId,
        jurisdiction_id: item.jurisdiction_id || null,
        court_level_id: item.court_level_id || null,
        name: item.name || null,
        official_name: item.official_name || null,
      }));

      const { error } = await supabase
        .from("courts")
        .insert(courtsToInsert);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully imported ${courtsToInsert.length} court(s)`,
      });

      setIsBulkDialogOpen(false);
      setBulkJsonInput("");
      setBulkCountryId("");
      setBulkJsonError("");
      fetchCourts();
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
    "name": "District Court 1",
    "official_name": "The District Court of County Name",
    "jurisdiction_id": "uuid-here",
    "court_level_id": "uuid-here"
  },
  {
    "name": "District Court 2",
    "official_name": "The District Court of Another County",
    "jurisdiction_id": "uuid-here",
    "court_level_id": "uuid-here"
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
      {/* Row 1: Title and Record Count */}
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">Courts</h2>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
            {courts.length}{" "}
            {courts.length === 1 ? "record" : "records"}
          </span>
        </div>
      </div>

      {/* Row 2: Search on left, Filters on right */}
      <div className="flex justify-between items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search courts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 items-center">
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

          <Select
            value={filterJurisdiction}
            onValueChange={setFilterJurisdiction}
            disabled={filterCountry === "all"}
          >
            <SelectTrigger className="w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by jurisdiction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jurisdictions</SelectItem>
              {filterJurisdictions.map((jurisdiction) => (
                <SelectItem
                  key={jurisdiction.id}
                  value={jurisdiction.id}
                >
                  {jurisdiction.name || "Unnamed"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterCourtLevel}
            onValueChange={setFilterCourtLevel}
            disabled={filterCountry === "all"}
          >
            <SelectTrigger className="w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by court level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Court Levels</SelectItem>
              {filterCourtLevels.map((courtLevel) => (
                <SelectItem key={courtLevel.id} value={courtLevel.id}>
                  {courtLevel.name || "Unnamed"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 3: Action buttons on extreme right */}
      <div className="flex justify-end gap-2">
        {selectedCourts.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => setShowBulkDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected ({selectedCourts.length})
          </Button>
        )}
        <Button variant="outline" onClick={openBulkImportDialog}>
          <Upload className="w-4 h-4 mr-2" />
          Bulk Import
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Court
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCourt ? "Edit Court" : "Add New Court"}
              </DialogTitle>
              <DialogDescription>
                {editingCourt
                  ? "Update court information"
                  : "Create a new court entry"}
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
                      jurisdiction_id: "",
                      court_level_id: "",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
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
                <Label htmlFor="jurisdiction">
                  Jurisdiction (Optional)
                </Label>
                <Select
                  value={formData.jurisdiction_id || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      jurisdiction_id: value === "none" ? "" : value,
                    })
                  }
                  disabled={!formData.country_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select jurisdiction (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {jurisdictions.map((jurisdiction) => (
                      <SelectItem
                        key={jurisdiction.id}
                        value={jurisdiction.id}
                      >
                        {jurisdiction.name || "Unnamed"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="court_level">
                  Court Level (Optional)
                </Label>
                <Select
                  value={formData.court_level_id || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      court_level_id: value === "none" ? "" : value,
                    })
                  }
                  disabled={!formData.country_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select court level (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {courtLevels.map((courtLevel) => (
                      <SelectItem
                        key={courtLevel.id}
                        value={courtLevel.id}
                      >
                        {courtLevel.name || "Unnamed"}
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
                  placeholder="e.g., District Court 1"
                />
              </div>

              <div>
                <Label htmlFor="official_name">
                  Official Name (Optional)
                </Label>
                <Input
                  id="official_name"
                  value={formData.official_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      official_name: e.target.value,
                    })
                  }
                  placeholder="e.g., The District Court of County Name"
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
                  {editingCourt ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={
                    courts.length > 0 &&
                    selectedCourts.length === courts.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300"
                />
              </TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Court Level</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Official Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-slate-500 py-8"
                >
                  No courts found. Add your first court to get
                  started.
                </TableCell>
              </TableRow>
            ) : (
              courts.map((court) => (
                <TableRow key={court.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedCourts.includes(court.id)}
                      onChange={(e) =>
                        handleSelectCourt(court.id, e.target.checked)
                      }
                      className="w-4 h-4 rounded border-slate-300"
                    />
                  </TableCell>
                  <TableCell>
                    {court.countries?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {court.jurisdiction?.name || "—"}
                  </TableCell>
                  <TableCell>
                    {court.court_levels?.name || "—"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {court.name || "N/A"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {court.official_name || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(court)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteCourtId(court.id)}
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
        open={!!deleteCourtId}
        onOpenChange={() => setDeleteCourtId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this court. This action
              cannot be undone.
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

      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedCourts.length}{" "}
              selected court(s). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await handleBulkDelete();
                setShowBulkDeleteDialog(false);
              }}
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  Delete {selectedCourts.length} Court
                  {selectedCourts.length === 1 ? "" : "s"}
                </>
              )}
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
            <DialogTitle>Bulk Import Courts</DialogTitle>
            <DialogDescription>
              Import multiple courts at once using JSON format. Each
              court must have a name field. jurisdiction_id and
              court_level_id should be provided in the JSON.
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
                  <SelectValue placeholder="Select a country for these courts" />
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
              <Label htmlFor="bulk-json">Courts JSON</Label>
              <p className="text-xs text-slate-500 mb-2">
                Paste or edit JSON array with court objects. Include
                jurisdiction_id and court_level_id UUIDs in each
                object.
              </p>
              <Textarea
                id="bulk-json"
                value={bulkJsonInput}
                onChange={(e) => {
                  setBulkJsonInput(e.target.value);
                  validateBulkJson(e.target.value);
                }}
                className="font-mono text-sm min-h-[400px]"
                placeholder='[{"name": "District Court 1", "official_name": "The District Court", "jurisdiction_id": "uuid", "court_level_id": "uuid"}]'
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
                "name" field. "official_name", "jurisdiction_id", and
                "court_level_id" fields are optional. All courts will
                be assigned to the selected country. This will append
                new courts, not replace existing data.
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
                Import Courts
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourtsManager;
