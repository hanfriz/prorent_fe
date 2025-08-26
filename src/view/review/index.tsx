import PropertyReviews from '@/view/review/component/propertyReview'; // Adjust import path

export default function PropertyPage({ params }: { params: { id: string } }) {
  const propertyId = params.id;

  return (
    <div>
      <PropertyReviews propertyId={propertyId} />      
    </div>
  );
}