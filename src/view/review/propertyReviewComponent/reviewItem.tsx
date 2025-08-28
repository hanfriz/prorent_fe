// review/ReviewItem.tsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface ReviewItemProps {
  review: any;
}

export const ReviewItem = ({ review }: ReviewItemProps) => {
  const reviewerName = getReviewerName(review);
  const reviewerInitials =
    reviewerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "A";
  const formattedDate = format(new Date(review.createdAt), "dd MMMM yyyy", {
    locale: localeId,
  });

  return (
    <article className="py-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <ReviewHeaderSection
        reviewerName={reviewerName}
        reviewerInitials={reviewerInitials}
        rating={review.rating}
      />
      <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
        {review.reservation?.Property?.name || "Review"}
      </h3>
      <p className="mb-3 text-base font-normal text-gray-500 dark:text-gray-400">
        {review.content}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {formattedDate}
      </p>
      {review.OwnerReply && <OwnerReply reply={review.OwnerReply} />}
      <ReviewActions />
    </article>
  );
};

const getReviewerName = (review: any) => {
  const { firstName = "", lastName = "" } = review.reviewer?.profile || {};
  return `${firstName} ${lastName}`.trim() || "Anonymous";
};

const ReviewHeaderSection = ({
  reviewerName,
  reviewerInitials,
  rating,
}: {
  reviewerName: string;
  reviewerInitials: string;
  rating: number;
}) => (
  <div className="mb-3 flex items-center">
    <Avatar className="mr-4 h-10 w-10">
      <AvatarImage src={getAvatarUrl(reviewerName)} alt={reviewerName} />
      <AvatarFallback>{reviewerInitials}</AvatarFallback>
    </Avatar>
    <div className="font-medium dark:text-white">
      <p>{reviewerName}</p>
    </div>
    <div className="flex ms-4">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-sm ${
            i < rating ? "text-yellow-300" : "text-gray-300 dark:text-gray-500"
          }`}
        >
          &#9733;
        </span>
      ))}
      <p className="ms-2 text-sm font-medium">{rating}.0</p>
    </div>
  </div>
);

const getAvatarUrl = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random`;
};

const OwnerReply = ({ reply }: { reply: any }) => {
  const date = format(new Date(reply.createdAt), "dd MMMM yyyy", {
    locale: localeId,
  });
  return (
    <>
      <Separator className="my-4" />
      <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Response from Owner
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {reply.content}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{date}</p>
      </div>
    </>
  );
};

const ReviewActions = () => (
  <aside className="mt-4 flex items-center">
    <Button variant="outline" size="sm" className="px-2 py-1.5 text-xs">
      👍 Helpful ({Math.floor(Math.random() * 10)})
    </Button>
    <Button variant="ghost" size="sm" className="ms-4 text-sm hover:underline">
      ⚠️ Report
    </Button>
  </aside>
);

export default ReviewItem;
