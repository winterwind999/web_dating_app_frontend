"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Stack from "@/components/Stack";
import { Button } from "@/components/ui/button";
import { BACKEND_URL, STACK_IMAGES } from "@/utils/constants";
import GoogleIcon from "@/utils/icons/GoogleIcon";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [cardSize, setCardSize] = useState<number>(600);

  useEffect(() => {
    const updateCardSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const minDimension = Math.min(width, height);

      if (minDimension < 500) {
        setCardSize(Math.floor(minDimension * 0.5));
      } else if (width < 768) {
        setCardSize(Math.min(300, width * 0.6));
      } else if (width < 1024) {
        setCardSize(Math.min(500, width * 0.7));
      } else {
        setCardSize(Math.min(600, width * 0.8));
      }
    };

    updateCardSize();
    window.addEventListener("resize", updateCardSize);
    return () => window.removeEventListener("resize", updateCardSize);
  }, []);

  return (
    <div className="bg-background">
      <Header />

      <main className="min-h-screen">
        <div className="bg-secondary flex w-full justify-center py-20">
          <div className="grid w-4/5 grid-cols-1 place-items-center gap-3 lg:grid-cols-2">
            <div className="flex flex-col items-center gap-3 lg:gap-6">
              <p className="text-center text-4xl font-bold md:text-6xl lg:text-7xl">
                Meet someone who truly matches you
              </p>

              <p className="text-center text-xl md:text-2xl lg:text-3xl">
                Start your Matchy story today
              </p>

              <Button variant="outline" size="2xl" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>

              <p>or</p>

              <Button
                variant="ghost"
                size="2xl"
                asChild
                className="border-light border-2"
              >
                <Link href={`${BACKEND_URL}/auth/google/login`}>
                  <GoogleIcon />
                  <p>Sign Up with Google</p>
                </Link>
              </Button>
            </div>

            <Stack
              randomRotation={true}
              cardsData={STACK_IMAGES}
              cardDimensions={{ width: cardSize, height: cardSize }}
              autoplay
              interval={3000}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
