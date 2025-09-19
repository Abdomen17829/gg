import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{t("nav.home")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-cfh-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">
            Welcome to Crochet From Heart
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover amazing crochet patterns and share your creations with our
            community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
