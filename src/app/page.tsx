"use client";

import Stack from "@/components/Stack";
import { stackImages } from "@/utils/constants";
import { Button } from "@heroui/react";
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
    <div>
      <div className="bg-primary-light flex w-full justify-center py-20">
        <div className="grid w-4/5 grid-cols-1 place-items-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col items-center gap-3 lg:gap-6">
            <p className="text-center text-4xl font-bold md:text-6xl lg:text-7xl">
              Meet someone who truly matches you
            </p>

            <p className="text-center text-xl md:text-2xl lg:text-3xl">
              Start your Matchy story today
            </p>

            <Button
              color="primary"
              variant="ghost"
              as={Link}
              aria-label="sign-up"
              className="md:h-14 md:w-40 md:text-xl lg:h-16 lg:w-44 lg:text-2xl"
              href=""
            >
              Sign Up
            </Button>
          </div>

          <Stack
            randomRotation={true}
            cardsData={stackImages}
            cardDimensions={{ width: cardSize, height: cardSize }}
          />
        </div>
      </div>
    </div>
  );
}
