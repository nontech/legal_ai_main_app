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
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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

interface Country {
  id: string;
  name: string;
  is_active: boolean | null;
  iso_code: string | null;
  created_at: string | null;
  updated_at?: string | null;
}

const CountriesManager = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] =
    useState<Country | null>(null);
  const [deleteCountryId, setDeleteCountryId] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState({
    name: "",
    iso_code: "",
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from("countries")
        .select("*")
        .order("name");

      if (error) throw error;
      setCountries(data || []);
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
      if (editingCountry) {
        const { error } = await supabase
          .from("countries")
          .update({
            name: formData.name,
            iso_code: formData.iso_code || null,
            is_active: formData.is_active,
          })
          .eq("id", editingCountry.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Country updated successfully",
        });
      } else {
        const { error } = await supabase.from("countries").insert([
          {
            name: formData.name,
            iso_code: formData.iso_code || null,
            is_active: formData.is_active,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Country created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingCountry(null);
      setFormData({ name: "", iso_code: "", is_active: true });
      fetchCountries();
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

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setFormData({
      name: country.name,
      iso_code: country.iso_code || "",
      is_active: country.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteCountryId) return;

    try {
      const { error } = await supabase
        .from("countries")
        .delete()
        .eq("id", deleteCountryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Country deleted successfully",
      });

      fetchCountries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteCountryId(null);
    }
  };

  const openCreateDialog = () => {
    setEditingCountry(null);
    setFormData({ name: "", iso_code: "", is_active: true });
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
          <h2 className="text-2xl font-semibold">Countries</h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage countries for your legal CRM system
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCountry ? "Edit Country" : "Add New Country"}
              </DialogTitle>
              <DialogDescription>
                {editingCountry
                  ? "Update country information"
                  : "Create a new country entry"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Country Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., United States"
                  required
                />
              </div>
              <div>
                <Label htmlFor="iso_code">ISO Code (Optional)</Label>
                <Input
                  id="iso_code"
                  value={formData.iso_code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      iso_code: e.target.value,
                    })
                  }
                  placeholder="e.g., US"
                  maxLength={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_active: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                  Active
                </Label>
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
                  {editingCountry ? "Update" : "Create"}
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
              <TableHead>Country Name</TableHead>
              <TableHead>ISO Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-slate-500 py-8"
                >
                  No countries found. Add your first country to get
                  started.
                </TableCell>
              </TableRow>
            ) : (
              countries.map((country) => (
                <TableRow key={country.id}>
                  <TableCell className="font-medium">
                    {country.name}
                  </TableCell>
                  <TableCell>
                    {country.iso_code ? (
                      <span className="font-mono text-sm bg-slate-100 px-2 py-1 rounded">
                        {country.iso_code}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        country.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {country.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {country.created_at
                      ? new Date(
                          country.created_at
                        ).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(country)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteCountryId(country.id)}
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
        open={!!deleteCountryId}
        onOpenChange={() => setDeleteCountryId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this country and all
              associated data (jurisdictions, case types, etc.). This
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

export default CountriesManager;
