import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";

interface PatternFormProps {
  onSuccess?: () => void;
  initialData?: any;
}

const PatternForm: React.FC<PatternFormProps> = ({
  onSuccess,
  initialData,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    stepsMarkdown: initialData?.stepsMarkdown || "",
    materials: initialData?.materials || [""],
    difficulty: initialData?.difficulty || "Medium",
    tags: initialData?.tags?.join(", ") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        materials: formData.materials.filter((m: string) => m.trim()),
        tags: formData.tags
          .split(",")
          .map((t: string) => t.trim())
          .filter((t: string) => t),
      };

      if (initialData) {
        await api.put(`/patterns/${initialData._id}`, payload);
      } else {
        await api.post("/patterns", payload);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving pattern:", error);
    } finally {
      setLoading(false);
    }
  };

  const addMaterialField = () => {
    setFormData({
      ...formData,
      materials: [...formData.materials, ""],
    });
  };

  const updateMaterial = (index: number, value: string) => {
    const newMaterials = [...formData.materials];
    newMaterials[index] = value;
    setFormData({ ...formData, materials: newMaterials });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          {t("pattern.title")}
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium">
          {t("pattern.summary")}
        </label>
        <textarea
          id="summary"
          required
          rows={3}
          value={formData.summary}
          onChange={(e) =>
            setFormData({ ...formData, summary: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="stepsMarkdown" className="block text-sm font-medium">
          {t("pattern.steps")}
        </label>
        <textarea
          id="stepsMarkdown"
          required
          rows={10}
          value={formData.stepsMarkdown}
          onChange={(e) =>
            setFormData({ ...formData, stepsMarkdown: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          {t("pattern.materials")}
        </label>
        {formData.materials.map((material: string, index: number) => (
          <input
            key={index}
            type="text"
            value={material}
            onChange={(e) => updateMaterial(index, e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 mb-2"
            placeholder={t("pattern.materialPlaceholder")}
          />
        ))}
        <button
          type="button"
          onClick={addMaterialField}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          + {t("pattern.addMaterial")}
        </button>
      </div>

      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium">
          {t("pattern.difficulty")}
        </label>
        <select
          id="difficulty"
          value={formData.difficulty}
          onChange={(e) =>
            setFormData({ ...formData, difficulty: e.target.value })
          }
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="Easy">{t("pattern.easy")}</option>
          <option value="Medium">{t("pattern.medium")}</option>
          <option value="Hard">{t("pattern.hard")}</option>
        </select>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium">
          {t("pattern.tags")}
        </label>
        <input
          type="text"
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder={t("pattern.tagsPlaceholder")}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? t("common.saving")
          : t(initialData ? "common.update" : "common.create")}
      </button>
    </form>
  );
};

export default PatternForm;
