"use client";

import { getAllMatchesAction } from "@/actions/matches-action";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Spinner } from "@/components/ui/spinner";
import { useChatStore } from "@/stores/chat-store";
import { type Match, type User } from "@/utils/constants";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  userId: string;
};

export default function MatchList({ userId }: Props) {
  const selectedMatch = useChatStore((state) => state.selectedMatch);
  const { setSelectedMatch } = useChatStore();

  const [matches, setMatches] = useState<Match[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const debouncedSearch = useDebounce(search, 300);

  const fetchMatches = useCallback(
    async (pageToFetch = page, searchToFetch = debouncedSearch) => {
      if (isLoading) {
        return;
      }

      setIsLoading(true);

      try {
        const { matches: newMatches, totalPages: newTotalPages } =
          await getAllMatchesAction(pageToFetch, searchToFetch);

        setMatches(newMatches);
        setTotalPages(newTotalPages);
      } catch (error) {
        toast.error("Failed to load more conversations");
      } finally {
        setIsLoading(false);
      }
    },
    [page, debouncedSearch],
  );

  useEffect(() => {
    fetchMatches();
  }, [page, debouncedSearch, fetchMatches]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  return (
    <Card className="h-screen">
      <CardContent className="grow">
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Search person..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          ) : matches.length === 0 ? (
            <p>No matches found</p>
          ) : (
            matches.map((match) => {
              let user: User | null = null;

              if ((match.user as User)._id === userId) {
                user = match.matchedUser as User;
              } else {
                user = match.user as User;
              }

              return (
                <Card
                  key={match._id}
                  className={`bg-secondary ${selectedMatch?._id === match._id && "bg-primary text-primary-foreground"} hover:bg-primary hover:text-primary-foreground cursor-pointer`}
                  onClick={() => {
                    setSelectedMatch(match);
                  }}
                >
                  <CardContent className="flex items-center gap-3">
                    <img
                      src={user.photo?.secure_url!}
                      alt={`${user._id}-photo`}
                      width={50}
                      height={50}
                    />
                    <p>
                      {user.firstName} {user.middleName} {user.lastName}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
      <CardFooter>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={page === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardFooter>
    </Card>
  );
}
