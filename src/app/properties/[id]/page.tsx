import PublicPropertyDetailView from "@/view/property/PublicPropertyDetailView";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  return <PublicPropertyDetailView propertyId={id} />;
}
