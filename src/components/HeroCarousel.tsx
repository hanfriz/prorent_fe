"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";

// Sample hero slides data
const heroSlides = [
  {
    id: 1,
    title: "Find Your Perfect",
    highlight: "Property",
    subtitle: "Rental",
    description:
      "Connect property owners with tenants seamlessly. Whether you're looking for a place to stay or want to rent out your property, ProRent makes it simple and secure.",
    backgroundImage: "/default.jpg", // No background for first slide
  },
  {
    id: 2,
    title: "Luxury Resort Properties",
    highlight: "Paradise",
    subtitle: "Awaits",
    description:
      "Discover stunning beachfront resorts and tropical villas. Experience luxury accommodations with breathtaking ocean views and world-class amenities.",
    backgroundImage: "/carousel-1.jpg",
  },
  {
    id: 3,
    title: "Modern Resort",
    highlight: "Experience",
    subtitle: "Luxury",
    description:
      "Stay in contemporary resort properties with premium facilities. Enjoy infinity pools, spa services, and exceptional hospitality in paradise locations.",
    backgroundImage: "/carousel-2.jpg",
  },
  {
    id: 4,
    title: "Private Villa",
    highlight: "Getaway",
    subtitle: "Exclusive",
    description:
      "Book exclusive private villas with personal service. Perfect for special occasions, family gatherings, or romantic escapes in tropical destinations.",
    backgroundImage: "/carousel-3.jpg",
  },
];

export default function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Auto-play functionality
  React.useEffect(() => {
    if (!api) return;

    // Set initial current slide
    setCurrent(api.selectedScrollSnap());

    // Listen for slide changes
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    // Auto-play timer
    const autoplay = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => {
      clearInterval(autoplay);
    };
  }, [api]);

  const goToSlide = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <Carousel
        setApi={setApi}
        className="absolute inset-0 w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id} className="relative w-full h-screen">
              {slide.backgroundImage ? (
                <>
                  <Image
                    src={slide.backgroundImage}
                    alt={`${slide.title} ${slide.highlight}`}
                    fill
                    className="object-cover"
                    priority={slide.id <= 2}
                  />
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/40" />
                </>
              ) : (
                /* Gradient background for first slide */
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm z-20" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm z-20" />
      </Carousel>

      {/* Fixed Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo prominently displayed */}
        <div className="mb-8">
          <Image
            src="/prorent-logo-removebg-preview.png"
            alt="ProRent Logo"
            width={200}
            height={80}
            className="mx-auto"
            priority
          />
        </div>

        {/* Dynamic Text Content */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg">
            {heroSlides[current]?.title}{" "}
            <span className="text-blue-400">
              {heroSlides[current]?.highlight}
            </span>{" "}
            {heroSlides[current]?.subtitle}
          </h1>

          <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90 drop-shadow-md">
            {heroSlides[current]?.description}
          </p>
        </div>

        {/* Fixed CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link href="/properties">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8 py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
            >
              Find a Property
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-lg bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm shadow-lg"
            >
              List Your Property
            </Button>
          </Link>
        </div>

        {/* Slide Indicators */}
        <div className="flex justify-center space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              title={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-colors backdrop-blur-sm ${
                current === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
