import PropertyReviews from '@/view/review/component/propertyReview';

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const propertyId = (await params).id;

  return (
    <div>
      <PropertyReviews propertyId={propertyId} />      
    </div>
  );
}