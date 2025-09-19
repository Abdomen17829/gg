import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PatternForm from "../components/PatternForm";
import { useAuth } from "../contexts/AuthContext";

const CreatePattern: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSuccess = () => {
    navigate("/patterns");
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>{t("pattern.loginRequired")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t("pattern.create")}</h1>
      <PatternForm onSuccess={handleSuccess} />
    </div>
  );
};

export default CreatePattern;
