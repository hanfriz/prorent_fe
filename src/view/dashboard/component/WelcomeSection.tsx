interface WelcomeSectionProps {
  userName: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome back, {userName}!
      </h1>
      <p className="text-gray-600 mt-2">
        Here's what's happening with your properties today.
      </p>
    </div>
  );
}
