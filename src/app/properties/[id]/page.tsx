import PropertyDetailView from "@/view/property/detail";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  return <PropertyDetailView propertyId={id} />;
}
