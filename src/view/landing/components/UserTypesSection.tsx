"use client";

import UserTypeCard from "./UserTypeCard";

const userTypes = [
  {
    title: "For Tenants",
    description:
      "Looking for your next home? Browse thousands of verified properties and book with confidence.",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    features: [
      "Browse verified properties",
      "Advanced search filters",
      "Secure online booking",
      "Direct communication with owners",
    ],
    buttonText: "Sign Up as Tenant",
    buttonVariant: "default" as const,
    href: "/register/user",
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "For Property Owners",
    description:
      "Maximize your property's potential. List your properties and connect with qualified tenants.",
    icon: (
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    features: [
      "Easy property listing",
      "Tenant screening tools",
      "Automated payment collection",
      "Property management dashboard",
    ],
    buttonText: "Sign Up as Owner",
    buttonVariant: "outline" as const,
    href: "/register/owner",
    iconBgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
];

export default function UserTypesSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Join Our Community
          </h2>
          <p className="text-lg text-gray-600">
            Choose your path and start your journey with ProRent today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {userTypes.map((userType, index) => (
            <UserTypeCard
              key={index}
              title={userType.title}
              description={userType.description}
              icon={userType.icon}
              features={userType.features}
              buttonText={userType.buttonText}
              buttonVariant={userType.buttonVariant}
              href={userType.href}
              iconBgColor={userType.iconBgColor}
              iconColor={userType.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
