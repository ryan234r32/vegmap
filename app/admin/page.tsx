"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Store,
  Flag,
} from "lucide-react";
import type { Restaurant } from "@/lib/types";

interface Report {
  id: string;
  restaurant_id: string;
  user_id: string;
  report_type: string;
  description: string | null;
  hidden_ingredients: string[];
  status: string;
  admin_notes: string | null;
  created_at: string;
  restaurant: { id: string; name_en: string; name_zh: string | null; slug: string } | null;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  permanently_closed: "Permanently Closed",
  relocated: "Relocated",
  wrong_veg_type: "Wrong Veg Type",
  hidden_animal_ingredients: "Hidden Animal Ingredients",
  wrong_hours: "Wrong Hours",
  wrong_address: "Wrong Address",
  other: "Other",
};

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      setLoading(true);
      const [reportsRes, restaurantsRes] = await Promise.all([
        fetch("/api/admin/reports"),
        fetch("/api/admin/restaurants"),
      ]);

      if (reportsRes.ok) {
        const { data } = await reportsRes.json();
        setReports(data ?? []);
      }
      if (restaurantsRes.ok) {
        const { data } = await restaurantsRes.json();
        setPendingRestaurants(data ?? []);
      }
      setLoading(false);
    };

    fetchData();
  }, [isAdmin]);

  const handleReport = async (reportId: string, status: "resolved" | "dismissed") => {
    const res = await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId,
        status,
        adminNotes: adminNotes[reportId] || null,
      }),
    });

    if (res.ok) {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
    }
  };

  const handleRestaurant = async (restaurantId: string, action: "approve" | "reject") => {
    const res = await fetch("/api/admin/restaurants", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, action }),
    });

    if (res.ok) {
      setPendingRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground">
            This page is only accessible to administrators.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === "pending");
  const resolvedReports = reports.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Flag className="h-4 w-4" />
              Pending Reports
            </div>
            <p className="text-2xl font-bold">{pendingReports.length}</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Store className="h-4 w-4" />
              Pending Restaurants
            </div>
            <p className="text-2xl font-bold">{pendingRestaurants.length}</p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <CheckCircle className="h-4 w-4" />
              Resolved
            </div>
            <p className="text-2xl font-bold">
              {resolvedReports.filter((r) => r.status === "resolved").length}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <XCircle className="h-4 w-4" />
              Dismissed
            </div>
            <p className="text-2xl font-bold">
              {resolvedReports.filter((r) => r.status === "dismissed").length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <Tabs defaultValue="reports">
            <TabsList>
              <TabsTrigger value="reports">
                Reports ({pendingReports.length})
              </TabsTrigger>
              <TabsTrigger value="restaurants">
                Restaurant Submissions ({pendingRestaurants.length})
              </TabsTrigger>
              <TabsTrigger value="history">
                History ({resolvedReports.length})
              </TabsTrigger>
            </TabsList>

            {/* Pending Reports */}
            <TabsContent value="reports" className="mt-4 space-y-4">
              {pendingReports.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No pending reports. All clear!
                </p>
              ) : (
                pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <Badge variant="outline">
                            {REPORT_TYPE_LABELS[report.report_type] ?? report.report_type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {report.restaurant && (
                          <p className="font-semibold">
                            {report.restaurant.name_en}
                            {report.restaurant.name_zh && (
                              <span className="text-muted-foreground font-normal ml-2">
                                {report.restaurant.name_zh}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    {report.description && (
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>
                    )}

                    {report.hidden_ingredients.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {report.hidden_ingredients.map((ing) => (
                          <Badge key={ing} variant="destructive" className="text-xs">
                            {ing}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Textarea
                      placeholder="Admin notes (optional)..."
                      value={adminNotes[report.id] ?? ""}
                      onChange={(e) =>
                        setAdminNotes((prev) => ({ ...prev, [report.id]: e.target.value }))
                      }
                      rows={2}
                      className="text-sm"
                    />

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleReport(report.id, "resolved")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReport(report.id, "dismissed")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* Pending Restaurant Submissions */}
            <TabsContent value="restaurants" className="mt-4 space-y-4">
              {pendingRestaurants.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No pending submissions.
                </p>
              ) : (
                pendingRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">
                        {restaurant.name_en}
                      </h3>
                      {restaurant.name_zh && (
                        <p className="text-sm text-muted-foreground">
                          {restaurant.name_zh}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {restaurant.district && (
                        <div>
                          <span className="text-muted-foreground">District:</span>{" "}
                          {restaurant.district}
                        </div>
                      )}
                      {restaurant.price_range && (
                        <div>
                          <span className="text-muted-foreground">Price:</span>{" "}
                          {restaurant.price_range}
                        </div>
                      )}
                      {restaurant.address_en && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Address:</span>{" "}
                          {restaurant.address_en}
                        </div>
                      )}
                      {restaurant.website && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Website:</span>{" "}
                          <a
                            href={restaurant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {restaurant.website}
                          </a>
                        </div>
                      )}
                    </div>

                    {restaurant.vegetarian_types.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {restaurant.vegetarian_types.map((type) => (
                          <Badge key={type} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {restaurant.description_en && (
                      <p className="text-sm text-muted-foreground">
                        {restaurant.description_en}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRestaurant(restaurant.id, "approve")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRestaurant(restaurant.id, "reject")}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* History */}
            <TabsContent value="history" className="mt-4 space-y-3">
              {resolvedReports.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No history yet.
                </p>
              ) : (
                resolvedReports.map((report) => (
                  <div
                    key={report.id}
                    className="border rounded-lg p-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge
                          variant={report.status === "resolved" ? "default" : "secondary"}
                        >
                          {report.status}
                        </Badge>
                        <span>
                          {REPORT_TYPE_LABELS[report.report_type] ?? report.report_type}
                        </span>
                        {report.restaurant && (
                          <span className="text-muted-foreground">
                            — {report.restaurant.name_en}
                          </span>
                        )}
                      </div>
                      {report.admin_notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Note: {report.admin_notes}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
      <Footer />
    </div>
  );
}
