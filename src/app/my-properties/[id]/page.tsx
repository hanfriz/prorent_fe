import { OwnerPropertyDetailView } from "@/view/property/OwnerPropertyDetailView";

interface OwnerPropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OwnerPropertyDetailPage({
  params,
}: OwnerPropertyDetailPageProps) {
  const { id } = await params;
  return <OwnerPropertyDetailView propertyId={id} />;
}
