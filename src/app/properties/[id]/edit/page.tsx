import EditPropertyView from "@/view/property/edit";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;
  return <EditPropertyView propertyId={id} />;
}
