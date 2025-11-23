import { useEffect, useState } from "react";
import { supabase } from "../../admin/supabase/client";
import { useToast } from "../../../hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
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
import { Alert, AlertDescription } from "../ui/alert";

interface Country {
  id: string;
  name: string;
}

interface Jurisdiction {
  id: string;
  state_province: string;
  city: string;
  court: string;
}

interface Judge {
  id: string;
  country_id: string;
  jurisdiction_id: string | null;
  judge_info: any;
  created_at: string;
  countries?: { name: string };
  jurisdiction?: Jurisdiction;
}

const JudgesManager = () => {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJudge, setEditingJudge] = useState<Judge | null>(
    null
  );
  const [deleteJudgeId, setDeleteJudgeId] = useState<string | null>(
    null
  );
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [formData, setFormData] = useState({
    country_id: "",
    jurisdiction_id: "",
    judge_info: "",
  });
  const [jsonError, setJsonError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
    fetchJudges();
  }, []);

  useEffect(() => {
    fetchJudges();
  }, [filterCountry]);

  useEffect(() => {
    if (formData.country_id) {
      fetchJurisdictions(formData.country_id);
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
        .select("id, state_province, city, court")
        .eq("country_id", countryId)
        .order("state_province")
        .order("city");

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

  const fetchJudges = async () => {
    try {
      let query = supabase
        .from("judge")
        .select(
          "*, countries(name), jurisdiction(id, state_province, city, court)"
        )
        .order("created_at", { ascending: false });

      if (filterCountry !== "all") {
        query = query.eq("country_id", filterCountry);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJudges(data || []);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    if (!validateJSON(formData.judge_info)) {
      setSubmitting(false);
      return;
    }

    try {
      const parsedJudgeInfo = JSON.parse(formData.judge_info);
      const jurisdictionId =
        formData.jurisdiction_id === "default"
          ? null
          : formData.jurisdiction_id || null;

      if (editingJudge) {
        const { error } = await supabase
          .from("judge")
          .update({
            country_id: formData.country_id,
            jurisdiction_id: jurisdictionId,
            judge_info: parsedJudgeInfo,
          })
          .eq("id", editingJudge.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Judge updated successfully",
        });
      } else {
        const { error } = await supabase.from("judge").insert([
          {
            country_id: formData.country_id,
            jurisdiction_id: jurisdictionId,
            judge_info: parsedJudgeInfo,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Judge created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingJudge(null);
      setFormData({
        country_id: "",
        jurisdiction_id: "",
        judge_info: "",
      });
      fetchJudges();
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

  const handleEdit = (judge: Judge) => {
    setEditingJudge(judge);
    setFormData({
      country_id: judge.country_id,
      jurisdiction_id: judge.jurisdiction_id || "default",
      judge_info: JSON.stringify(judge.judge_info, null, 2),
    });
    setJsonError("");
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteJudgeId) return;

    try {
      const { error } = await supabase
        .from("judge")
        .delete()
        .eq("id", deleteJudgeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Judge deleted successfully",
      });

      fetchJudges();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteJudgeId(null);
    }
  };

  const openCreateDialog = () => {
    setEditingJudge(null);
    setFormData({
      country_id: "",
      jurisdiction_id: "",
      judge_info: `{
  "name": "Hon. John Smith",
  "title": "District Court Judge",
  "experience": "15 years",
  "bias_indicator": "neutral",
  "conviction_rate": 65,
  "avg_sentence": "Medium",
  "notable_cases": ["Case 1", "Case 2"],
  "reputation": "Fair and balanced",
  "specialty": "Criminal Law",
  "image": "/placeholder.svg"
}`,
    });
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
          <h2 className="text-2xl font-semibold">Judges</h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage judge profiles and assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={filterCountry}
            onValueChange={setFilterCountry}
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
                Add Judge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingJudge ? "Edit Judge" : "Add New Judge"}
                </DialogTitle>
                <DialogDescription>
                  {editingJudge
                    ? "Update judge information"
                    : "Create a new judge profile"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country_id}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        country_id: value,
                        jurisdiction_id: "",
                      })
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
                  <Label htmlFor="jurisdiction">
                    Jurisdiction (Optional - Default Judge if not
                    selected)
                  </Label>
                  <Select
                    value={formData.jurisdiction_id}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        jurisdiction_id: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Default judge for country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">
                        Default Judge (No specific jurisdiction)
                      </SelectItem>
                      {jurisdictions.map((jurisdiction) => (
                        <SelectItem
                          key={jurisdiction.id}
                          value={jurisdiction.id}
                        >
                          {jurisdiction.state_province} -{" "}
                          {jurisdiction.city} - {jurisdiction.court}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="judge_info">
                    Judge Information (JSON)
                  </Label>
                  <Textarea
                    id="judge_info"
                    value={formData.judge_info}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        judge_info: e.target.value,
                      });
                      validateJSON(e.target.value);
                    }}
                    className="font-mono text-sm min-h-[300px]"
                    placeholder='{"name": "...", "title": "...", ...}'
                    required
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
                    disabled={submitting || !!jsonError}
                  >
                    {submitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingJudge ? "Update" : "Create"}
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
              <TableHead>Judge Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Jurisdiction</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {judges.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-slate-500 py-8"
                >
                  No judges found. Add your first judge to get
                  started.
                </TableCell>
              </TableRow>
            ) : (
              judges.map((judge) => (
                <TableRow key={judge.id}>
                  <TableCell className="font-medium">
                    {judge.judge_info?.name || "N/A"}
                  </TableCell>
                  <TableCell>{judge.countries?.name}</TableCell>
                  <TableCell>
                    {judge.jurisdiction ? (
                      <span className="text-sm">
                        {judge.jurisdiction.state_province} -{" "}
                        {judge.jurisdiction.city}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">
                        Default
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {judge.judge_info?.title || "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        judge.jurisdiction_id
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {judge.jurisdiction_id ? "Specific" : "Default"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(judge)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteJudgeId(judge.id)}
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
        open={!!deleteJudgeId}
        onOpenChange={() => setDeleteJudgeId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this judge profile. This
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
    </div>
  );
};

export default JudgesManager;
