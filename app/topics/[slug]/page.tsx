"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type Session = {
  id: string;
  task: string;
  date: string;
  duration: number;
  completed: boolean;
};

export default function TopicDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : (params?.slug as string);
  const title = decodeURIComponent(slug || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [days, setDays] = useState<
    Array<{ day: string; totalMinutes: number; count: number }>
  >([]);

  useEffect(() => {
    const run = async () => {
      if (!title) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/todos/by-topic?title=${encodeURIComponent(title)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load");
        setSessions(data.sessions || []);
        setDays(data.days || []);
      } catch (e: any) {
        setError(e.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [title]);

  if (!title) {
    return <div className="p-4">Missing topic title.</div>;
  }

  if (loading) return <div className="p-4">Loading {title}…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <section>
        <h2 className="text-xl font-medium">Days & minutes</h2>
        {days.length === 0 ? (
          <p className="text-sm text-gray-500">No sessions yet.</p>
        ) : (
          <ul className="divide-y">
            {days.map((d) => (
              <li
                key={d.day}
                className="py-2 flex items-center justify-between"
              >
                <span>{d.day}</span>
                <span className="rounded bg-gray-200 px-2 py-0.5 text-sm">
                  {d.totalMinutes} min
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-medium">Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-sm text-gray-500">No sessions recorded.</p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="border rounded p-2 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm">
                    {new Date(s.date).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Completed: {s.completed ? "Yes" : "No"}
                  </div>
                </div>
                <div className="rounded bg-gray-200 px-2 py-0.5 text-sm">
                  {s.duration} min
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
