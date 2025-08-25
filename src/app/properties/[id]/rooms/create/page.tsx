import CreateRoomView from "@/view/property/room/create";

interface CreateRoomPageProps {
  params: Promise<{ id: string }>;
}

export default async function CreateRoomPage({ params }: CreateRoomPageProps) {
  const { id } = await params;
  return <CreateRoomView propertyId={id} />;
}
