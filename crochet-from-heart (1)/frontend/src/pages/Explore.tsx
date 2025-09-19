import { useTranslation } from "react-i18next";

const Explore = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        {t("nav.explore")}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-cfh-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Sample Pattern</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is a sample crochet pattern description.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Explore;
