"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        {/* Logo prominently displayed */}
        <div className="mb-8">
          <Image
            src="/prorent-logo.png"
            alt="ProRent Logo"
            width={200}
            height={80}
            className="mx-auto"
            priority
          />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Find Your Perfect <span className="text-blue-600">Property</span>{" "}
          Rental
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Connect property owners with tenants seamlessly. Whether you're
          looking for a place to stay or want to rent out your property, ProRent
          makes it simple and secure.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg">
              Find a Property
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-lg"
            >
              List Your Property
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
