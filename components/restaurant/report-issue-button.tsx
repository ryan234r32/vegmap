"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const REPORT_TYPES = [
  { value: "permanently_closed", label: "Permanently Closed" },
  { value: "relocated", label: "Relocated / Moved" },
  { value: "wrong_veg_type", label: "Wrong Vegetarian Type" },
  { value: "hidden_animal_ingredients", label: "Hidden Animal Ingredients" },
  { value: "wrong_hours", label: "Wrong Opening Hours" },
  { value: "wrong_address", label: "Wrong Address" },
  { value: "other", label: "Other Issue" },
];

const COMMON_HIDDEN_INGREDIENTS = [
  "Lard (豬油)",
  "Oyster sauce (蠔油)",
  "Chicken powder (雞粉)",
  "Fish sauce (魚露)",
  "Dried shrimp (蝦米)",
  "Bonito flakes (柴魚)",
  "Honey (蜂蜜)",
  "Gelatin (吉利丁)",
  "Shrimp paste (蝦醬)",
  "Animal butter (動物性奶油)",
];

export function ReportIssueButton({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function toggleIngredient(ingredient: string) {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  }

  async function handleSubmit() {
    if (!reportType) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          reportType,
          description: description || undefined,
          hiddenIngredients:
            reportType === "hidden_animal_ingredients"
              ? selectedIngredients
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit report");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-green-700 font-medium">
          Thank you for your report! Our team will review it shortly.
        </p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-amber-700 border-amber-300 hover:bg-amber-50"
      >
        Report Issue
      </Button>
    );
  }

  return (
    <div className="border border-amber-200 rounded-xl p-4 bg-amber-50 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Report an Issue</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          &#x2715;
        </button>
      </div>

      {/* Report Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Issue Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REPORT_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setReportType(type.value)}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                reportType === type.value
                  ? "border-amber-500 bg-amber-100 text-amber-800"
                  : "border-gray-200 hover:border-amber-300"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden ingredients checklist */}
      {reportType === "hidden_animal_ingredients" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Which hidden ingredients did you find?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_HIDDEN_INGREDIENTS.map((ingredient) => (
              <button
                key={ingredient}
                onClick={() => toggleIngredient(ingredient)}
                className={`text-left px-3 py-2 rounded-lg border text-sm ${
                  selectedIngredients.includes(ingredient)
                    ? "border-red-500 bg-red-50 text-red-800"
                    : "border-gray-200 hover:border-red-300"
                }`}
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Details (optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any additional details..."
          rows={3}
          className="w-full mt-1 px-3 py-2 border rounded-lg text-sm resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={!reportType || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
