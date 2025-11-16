"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Stack from "@/components/Stack";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BACKEND_URL, STACK_IMAGES } from "@/utils/constants";
import { TriangleAlertIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [cardSize, setCardSize] = useState<number>(600);
  const [showAlert, setShowAlert] = useState<boolean>(true);

  useEffect(() => {
    const onMount = async () => {
      const stored = localStorage.getItem("showAlert");
      if (stored === "false") {
        setShowAlert(false);
      }

      await fetch(`${BACKEND_URL}/api/auth/health-check`, {
        method: "GET",
      });
    };

    onMount();
  }, []);

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

      {showAlert && (
        <div className="absolute top-20 z-50 flex w-full justify-center">
          <Alert variant="destructive" className="bg-background w-4/5">
            <AlertDescription>
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                  <TriangleAlertIcon />
                  <div>
                    <p>Heads up!</p>
                    <p>
                      This project is for demonstration and learning purposes
                      only.
                    </p>
                  </div>
                </div>

                <XCircleIcon
                  className="cursor-pointer"
                  onClick={() => {
                    setShowAlert(false);
                    localStorage.setItem("showAlert", "false");
                  }}
                />
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex min-h-screen flex-col gap-10">
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

        <div className="flex justify-center">
          <Card className="w-4/5">
            <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Image
                src="/assets/about-matchy.png"
                alt="about-matchy"
                className="pointer-events-none rounded-xl select-none"
                width={700}
                height={500}
              />

              <div className="flex flex-col items-center justify-center gap-3">
                <h5 className="font-semibold">About Matchy</h5>

                <p>
                  Matchy was created with one purpose — to make meaningful
                  connections easier. Whether it’s a spark that turns into
                  something unforgettable or a simple, genuine moment shared
                  between two people, Matchy helps bring real connections to
                  life.
                </p>

                <p>
                  We believe dating should feel safe, authentic, and empowering.
                  That’s why Matchy is designed with thoughtful features, smart
                  matchmaking, and a focus on creating an environment where
                  everyone can connect with confidence.
                </p>

                <p>
                  At Matchy, we’re not just building a dating app — we’re
                  building a place where people can find what feels right, at
                  their own pace and in their own way.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
