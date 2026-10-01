import CatalogApp from "./catalog-app";
import catalog from "@/data/experiences.json";

export default function Home() {
  return <CatalogApp games={catalog.experiences} total={catalog.metadata.total_experiences} />;
}
