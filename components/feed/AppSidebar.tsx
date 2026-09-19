"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/lib/api";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { unregisterWebPushToken } from "@/lib/webPushNotifications";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activePet, user, clearAuth } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const { count: unreadCount } = useUnreadNotificationCount();

  const petName = activePet?.name || user?.name || "My Pet";
  const handle = activePet?.username
    ? `@${activePet.username}`
    : user?.email?.split("@")[0] || "@user";
  const rawAvatarUrl = activePet?.profile_image_url || "";
  const avatarUrl = rawAvatarUrl.includes("images.unsplash.com")
    ? ""
    : rawAvatarUrl;

  const handleLogout = async () => {
    setLoggingOut(true);
    clearAuth();
    try {
      await unregisterWebPushToken();
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("[AppSidebar] Logout error:", err);
    } finally {
      router.push("/join?mode=signin");
    }
  };

  const isAdmin = Boolean(
    user?.is_admin === true ||
    user?.role === "super_admin" ||
    user?.role === "admin"
  );

  const navItems = [
    { label: "The Yard", href: "/feed", icon: "home" },
    { label: "Discover Packs", href: "/packs", icon: "explore" },
    { label: "Q&A Hub", href: "/qa", icon: "quiz", badge: true },
    {
      label: "Notifications",
      href: "/notifications",
      icon: "notifications",
      badge: true,
    },
    {
      label: "My Paw Print",
      href: activePet?.username ? `/pet/${activePet.username}` : activePet?.id ? `/pet/${activePet.id}` : user?.id ? `/pet-lover/${user.id}` : "/feed",
      icon: "pets",
    },
    { label: "Saved Barks", href: "/saved", icon: "bookmark" },
    ...(isAdmin
      ? [
          {
            label: "Admin Portal",
            href: "/admin",
            icon: "admin_panel_settings",
            isAdminTab: true,
          },
        ]
      : []),
  ];

  return (
    <aside className="w-[240px] h-screen sticky top-0 bg-[#FFFBF7] border-r border-[#EDE8E1] flex flex-col py-6 px-4 shrink-0 font-sans hidden md:flex">
      {/* Brand Header */}
      <div className="mb-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#E8843A] rounded-lg flex items-center justify-center shadow-sm">
            <span
              className="material-symbols-outlined text-white text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              pets
            </span>
          </div>
          <span
            className="text-[22px] font-bold text-[#163328] tracking-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            furlo
          </span>
        </Link>
        <p className="mt-1 text-[12px] text-[#887366]">Where Pets Belong</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/admin" && pathname.startsWith("/admin")) ||
            (item.href === "/feed" && pathname === "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                item.isAdminTab
                  ? isActive
                    ? "bg-[#163328] text-white font-bold shadow-sm"
                    : "bg-[#163328]/10 text-[#163328] hover:bg-[#163328] hover:text-white font-semibold"
                  : isActive
                  ? "bg-[#E8843A]/10 text-[#163328] font-bold"
                  : "text-[#424844] hover:bg-[#edf4fd] hover:text-[#163328]"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{
                  color: item.isAdminTab
                    ? isActive ? "#34D399" : "#163328"
                    : isActive ? "#E8843A" : "#424844",
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span
                className="text-[14px]"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {item.label}
              </span>
              {item.isAdminTab && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-[#163328] text-[#34D399] border border-[#34D399]/30">
                  Admin
                </span>
              )}
              {item.label === "Notifications" && unreadCount > 0 ? (
                <span className="ml-auto min-w-[22px] h-[22px] px-1.5 rounded-full bg-[#E8843A] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              ) : item.badge && !item.isAdminTab ? (
                <div className="ml-auto w-2 h-2 bg-[#E8843A] rounded-full" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Pet Profile Switcher */}
      <div className="mt-auto pt-4 border-t border-[#EDE8E1]">
        <div className="bg-white rounded-2xl p-3 border border-[#EDE8E1] shadow-[#163328]/5 flex items-center gap-3 cursor-pointer hover:bg-[#f6f9ff] transition-all active:scale-95">
          {avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarUrl}
              alt={petName}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#c9ead9]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#f8f3ed] flex items-center justify-center border-2 border-[#c9ead9] shrink-0">
              <span className="material-symbols-outlined text-[#E8843A] text-[18px]">
                {activePet ? "pets" : "person"}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[#163328] truncate">
              {petName}
            </p>
            <p className="text-[11px] text-[#887366] truncate">{handle}</p>
          </div>
          <span className="material-symbols-outlined text-[#887366] text-[18px]">
            unfold_more
          </span>
        </div>
        <p className="mt-2 text-center text-[#887366] text-[11px]">
          {activePet ? "Switch pet profile" : "Pet parent account"}
        </p>

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-3 w-full py-2 px-3 rounded-xl border border-[#EDE8E1] bg-white hover:bg-[#fff5f5] text-[#ba1a1a] hover:border-[#fca5a5] text-[12px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>{loggingOut ? "Logging Out..." : "Log Out"}</span>
        </button>
      </div>
    </aside>
  );
}
