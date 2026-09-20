"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/feed/AppSidebar";
import { RightSidebar } from "@/components/feed/RightSidebar";
import { PostCard, Post } from "@/components/feed/PostCard";
import { FeedListSkeleton } from "@/components/skeletons";
import { CreatePostModal } from "@/components/feed/CreatePostModal";
import { ReportPostModal } from "@/components/feed/ReportPostModal";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/lib/api";
import { startFollowRealtime } from "@/lib/subscribeFollowEvents";
import { applyFeedCounts, applyPostRowCounts, subscribeYardFeed } from "@/lib/subscribeYardFeed";
import { subscribePetBadges } from "@/lib/subscribePetBadges";
import { appendUniqueById, PAGE_SIZE } from "@/lib/pagination";
import { getPetSpecies, getPostVerb, getPostVerbPlural } from "@/lib/petVerbMap";

export default function FeedPage() {
  const { activePet, user } = useAuthStore();
  const postVerb = getPostVerb(getPetSpecies(activePet));
  const postVerbLower = postVerb.toLowerCase();
  const postVerbPluralLower = getPostVerbPlural(getPetSpecies(activePet), 2).toLowerCase();
  const petIdRef = useRef(activePet?.id);
  petIdRef.current = activePet?.id;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const [communities, setCommunities] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    startFollowRealtime();
    apiFetch("/auth/communities")
      .then((data) => {
        if (!cancelled && data && Array.isArray(data)) setCommunities(data);
      })
      .catch(() => {});

    const petQuery = activePet?.id ? `&petId=${activePet.id}` : "";
    setLoading(true);
    pageRef.current = 1;
    apiFetch(`/posts/feed?page=1&limit=${PAGE_SIZE}${petQuery}`)
      .then((data) => {
        if (!cancelled && data && Array.isArray(data.posts)) {
          setPosts(data.posts);
          hasMoreRef.current = Boolean(data.hasMore);
        }
      })
      .catch((err) => {
        if (!cancelled) console.error("[FeedPage] Error fetching feed:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activePet?.id]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting || loadingMoreRef.current || !hasMoreRef.current) return;
      loadingMoreRef.current = true;
      setLoadingMore(true);
      const nextPage = pageRef.current + 1;
      const petQuery = petIdRef.current ? `&petId=${petIdRef.current}` : "";
      apiFetch(`/posts/feed?page=${nextPage}&limit=${PAGE_SIZE}${petQuery}`)
        .then((data) => {
          if (Array.isArray(data?.posts)) {
            setPosts((prev) => appendUniqueById(prev, data.posts));
            pageRef.current = nextPage;
            hasMoreRef.current = Boolean(data.hasMore);
          }
        })
        .finally(() => {
          loadingMoreRef.current = false;
          setLoadingMore(false);
        });
    }, { rootMargin: "200px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loading, posts.length]);

  useEffect(() => {
    const unsubFeed = subscribeYardFeed({
      onPost: (payload) => {
        if (!payload?.id) return;
        setPosts((prev) =>
          prev.some((item) => item.id === payload.id) ? prev : [payload, ...prev],
        );
      },
      onCounts: (payload) => {
        setPosts((prev) => applyFeedCounts(prev, payload, petIdRef.current));
      },
      onPostRow: (row) => {
        setPosts((prev) => applyPostRowCounts(prev, row));
      },
      onRemove: (removedId) => {
        setPosts((prev) => prev.filter((p) => p.id !== removedId));
      },
    });

    const unsubBadges = subscribePetBadges((payload) => {
      setPosts((prev) =>
        prev.map((post) =>
          post.pets?.id === payload.petId
            ? {
                ...post,
                pets: {
                  ...post.pets,
                  is_verified: payload.is_verified,
                  is_founding_pet: payload.is_founding_pet,
                },
              }
            : post
        )
      );
    });

    return () => {
      unsubFeed();
      unsubBadges();
    };
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const petName = activePet?.name || user?.name || "companion";

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: "#FDF8F2",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      }}
    >
      {/* App Sidebar (Desktop) */}
      <AppSidebar />

      {/* Center Feed Column */}
      <main className="flex-1 max-w-[640px] px-4 md:px-6 pt-6 pb-24 mx-auto w-full flex flex-col gap-6">
        {/* Mobile Sticky Top Header */}
        <header className="flex md:hidden items-center justify-between py-2 border-b border-[#ede8e1]">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#E8843A] text-[24px]">
              pets
            </span>
            <span
              className="text-[20px] font-bold text-[#163328]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              furlo
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#E8843A] text-white px-3.5 py-1.5 rounded-full text-[12px] font-bold"
            >
              + Post {postVerb}
            </button>
          </div>
        </header>

        {/* Feed Composer Strip */}
        <div className="bg-white rounded-2xl p-4 border border-[#EDE8E1] shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {activePet?.profile_image_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={activePet.profile_image_url}
                alt={petName}
                className="w-10 h-10 rounded-full object-cover border border-[#ede8e1]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#ede8e1] shrink-0">
                <span className="material-symbols-outlined text-[#E8843A] text-[18px]">
                  pets
                </span>
              </div>
            )}
            <input
              type="text"
              readOnly
              onClick={() => setIsCreateOpen(true)}
              placeholder={`What's ${petName} up to today?`}
              className="flex-1 bg-[#FDF8F2] border border-[#ede8e1] rounded-xl px-4 py-2 text-[14px] text-[#163328] cursor-pointer hover:border-[#E8843A] transition-colors outline-none placeholder:text-[#887366]"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#ede8e1]/60">
            <div className="flex gap-4">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-1.5 text-[13px] text-[#554338] hover:text-[#163328] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#E8843A]">
                  image
                </span>
                <span className="font-medium">Photo</span>
              </button>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-1.5 text-[13px] text-[#554338] hover:text-[#163328] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#2d4a3e]">
                  quiz
                </span>
                <span className="font-medium">Question</span>
              </button>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-1.5 text-[13px] text-[#554338] hover:text-[#163328] transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-[#974900]">
                  lightbulb
                </span>
                <span className="font-medium">Tip</span>
              </button>
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#E8843A] text-white text-[13px] font-bold px-5 py-1.5 rounded-full hover:bg-[#974900] transition-colors shadow-sm"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Post {postVerb}
            </button>
          </div>
        </div>

        {/* Feed Posts List */}
        {loading ? (
          <FeedListSkeleton />
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#EDE8E1] text-center flex flex-col items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#f8f3ed] flex items-center justify-center text-[#E8843A]">
              <span className="material-symbols-outlined text-[32px]">
                pets
              </span>
            </div>
            <div>
              <h3
                className="font-bold text-[18px] text-[#163328]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                The Yard is quiet right now 🐾
              </h3>
              <p className="text-[14px] text-[#554338] mt-1 max-w-[340px] mx-auto leading-relaxed">
                Be the first pet in your pack to post a {postVerbLower}, ask a question, or
                share a photo!
              </p>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 bg-[#E8843A] text-white text-[14px] font-bold px-6 py-2.5 rounded-full hover:bg-[#974900] transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              + Post First {postVerb}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onReport={(postId) => setReportingPostId(postId)}
                onDelete={(deletedId) => {
                  setPosts((prev) => prev.filter((item) => item.id !== deletedId));
                }}
                onPatch={(postId, patch) => {
                  setPosts((prev) =>
                    prev.map((item) =>
                      item.id === postId ? { ...item, ...patch } : item,
                    ),
                  );
                }}
              />
            ))}
            <div ref={sentinelRef} className="h-8" />
            {loadingMore ? (
              <p className="text-center text-[13px] text-[#887366] py-2">Loading more posts…</p>
            ) : null}
          </div>
        )}
      </main>

      {/* Right Sidebar (Desktop) */}
      <RightSidebar />

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handlePostCreated}
        communities={communities}
      />

      <ReportPostModal
        postId={reportingPostId}
        isOpen={!!reportingPostId}
        onClose={() => setReportingPostId(null)}
      />
    </div>
  );
}
