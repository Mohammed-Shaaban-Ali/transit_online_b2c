"use client";

import { Sparkles, ThumbsDown, ThumbsUp, Triangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const OVERALL_SCORE = 9.6;
const REVIEW_COUNT = 1522;
const STREAK_GUESTS = 23;

const CATEGORY_SCORES = [
  { key: "cleanliness" as const, score: 9.7 },
  { key: "amenities" as const, score: 9.6 },
  { key: "location" as const, score: 9.6 },
  { key: "service" as const, score: 9.7 },
] as const;

const SUMMARY_KEYS = [
  "location",
  "facilities",
  "service",
  "hygiene",
  "environment",
  "suggestion",
] as const;

const REVIEW_ITEMS = [
  { id: "chalermpan" as const, showTranslation: false },
  { id: "liona" as const, showTranslation: true },
  { id: "guest" as const, showTranslation: true },
] as const;

function scoreBarWidth(score: number) {
  return `${Math.min(100, (score / 10) * 100)}%`;
}

export default function GuestReviewsSection() {
  const t = useTranslations("GuestReviews");

  return (
    <section className="mt-5 rounded-lg border border-gray-100 bg-white  shadow-sm  p-5">
      <h2 className="text-22 font-bold text-gray-900 md:text-2xl ">
        {t("title")}
      </h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-10">
        {/* Ratings summary */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-start gap-4">
            <div
              className="flex min-h-12 min-w-22 shrink-0 items-center justify-center rounded-full rounded-tr-none bg-primary
             px-3 py-2 text-white"
            >
              <span className="text-2xl font-bold leading-none md:text-3xl">
                {OVERALL_SCORE}/10
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-primary">
                {t("ratingLabel")}
              </p>
              <p className="text-sm text-gray-500">
                {t("reviewCount", { count: REVIEW_COUNT.toLocaleString() })}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-800">
            {t("streak", { count: STREAK_GUESTS })}
          </p>

          <ul className="space-y-5">
            {CATEGORY_SCORES.map(({ key, score }) => (
              <li key={key}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="font-bold text-gray-800">
                    {t(`categories.${key}`)}
                  </span>
                  <span className="shrink-0 font-semibold text-gray-900">
                    {score}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: scoreBarWidth(score) }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p className="flex items-start gap-2 text-xs text-gray-800">
            <Triangle className="mt-0.5 size-3 shrink-0 fill-primary text-primary" />
            {t("compareNote")}
          </p>
        </div>

        {/* AI summary */}
        <div className=" p-4 md:p-5 pt-0!">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="size-5 shrink-0 text-violet-600" />
            <h3 className="text-base font-bold text-violet-700 md:text-lg">
              {t("aiSummaryTitle")}
              <span className="ms-2 text-sm font-normal text-gray-500">
                {t("aiPowered")}
              </span>
            </h3>
          </div>
          <ul className="space-y-3 text-base text-gray-700">
            {SUMMARY_KEYS.map((key) => (
              <li key={key} className="flex gap-2">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rotate-45 bg-gray-400"
                  aria-hidden
                />
                <div>
                  <span className="font-medium text-gray-900">
                    {t(`summaries.${key}.title`)}
                  </span>
                  <span className="text-gray-500">
                    {" "}
                    {t(`summaries.${key}.body`)}
                  </span>
                  <span className="text-gray-500">
                    {" "}
                    {t(`summaries.${key}.basedOn`)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end gap-2 border-t border-violet-100/80 pt-3">
            <button
              type="button"
              className="p-1.5 border border-gray-200 rounded-full text-gray-400 hover:bg-white hover:text-gray-700"
              aria-label={t("feedbackHelpful")}
            >
              <ThumbsUp className="size-4" />
            </button>
            <button
              type="button"
              className="p-1.5 border border-gray-200 rounded-full text-gray-400 hover:bg-white hover:text-gray-700"
              aria-label={t("feedbackNotHelpful")}
            >
              <ThumbsDown className="size-4" />
            </button>
          </div>

          {/* What guests say */}
          <div className="mt-5 ">
            <h3 className="text-xl mb-8 font-bold text-gray-900">
              {t("whatGuestsSay")}
            </h3>

            <ul className="space-y-8">
              {REVIEW_ITEMS.map(({ id, showTranslation }) => (
                <li
                  key={id}
                  className="border-b border-gray-200 pb-8 last:border-0 last:pb-0"
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                        id === "chalermpan" && "bg-blue-600",
                        id === "liona" && "bg-emerald-600",
                        id === "guest" && "bg-violet-600",
                      )}
                      aria-hidden
                    >
                      {t(`reviews.${id}.initials`)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900">
                        {t(`reviews.${id}.name`)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t(`reviews.${id}.date`)}
                      </p>
                      <p className="mt-3 text-base leading-relaxed text-gray-800">
                        {t(`reviews.${id}.body`)}
                      </p>
                      {showTranslation && (
                        <p className="mt-2 text-base text-gray-500">
                          <button
                            type="button"
                            className="text-primary hover:underline"
                          >
                            {t("originalText")}
                          </button>
                          {t("translationByGoogle")}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
