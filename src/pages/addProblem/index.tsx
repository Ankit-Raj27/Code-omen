import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { auth, firestore } from "@/Firebase/firebase";
import TopBar from "@/components/TopBar/TopBar";

const LISTS = [
  { value: "striver150", label: "Striver 150" },
  { value: "neetcode150", label: "NeetCode 150" },
  { value: "gfg150", label: "GFG 150" },
];

const inputCls =
  "rounded-lg border border-dark-divider-border-2 bg-dark-layer-2 px-3 py-2 text-sm text-dark-gray-8 placeholder:text-dark-gray-6 focus:outline-none focus:ring-2 focus:ring-dark-blue-s";

/** Admin-only: add a problem to one of the list collections. Admin = admins/{uid} exists. */
export default function AddProblem() {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [input, setInput] = useState({
    id: "", title: "", difficulty: "Easy", category: "", order: "", videoId: "", link: "", selectedList: "striver150",
  });

  useEffect(() => {
    if (loading) return;
    if (!user) return setIsAdmin(false);
    getDoc(doc(firestore, "admins", user.uid))
      .then((s) => setIsAdmin(s.exists()))
      .catch(() => setIsAdmin(false));
  }, [user, loading]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setInput((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = input.id.trim();
    if (!/^[a-z0-9-]+$/.test(id) || !input.title.trim()) {
      toast.error("ID must be lowercase-with-dashes, and title is required", { theme: "dark" });
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(firestore, input.selectedList, id), {
        id,
        title: input.title.trim(),
        difficulty: input.difficulty,
        category: input.category.trim(),
        order: Number(input.order) || 0,
        videoId: input.videoId.trim(),
        link: input.link.trim(),
        likes: 0,
        dislikes: 0,
        selectedList: input.selectedList,
      });
      toast.success(`Added to ${input.selectedList}`, { theme: "dark" });
    } catch (err) {
      console.error(err);
      toast.error("Couldn't save (are you an admin?)", { theme: "dark" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-layer-2">
      <TopBar />
      <div className="mx-auto max-w-md px-4 pt-10">
        <h1 className="mb-4 text-xl font-semibold text-dark-gray-8">Add a problem</h1>
        {isAdmin === null ? (
          <p className="text-sm text-dark-gray-6">Checking access…</p>
        ) : !isAdmin ? (
          <p className="text-sm text-dark-gray-6">This page is for admins only.</p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input className={inputCls} name="id" placeholder="Problem ID (e.g. two-sum)" onChange={onChange} required />
            <input className={inputCls} name="title" placeholder="Title" onChange={onChange} required />
            <select className={inputCls} name="difficulty" value={input.difficulty} onChange={onChange}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
            <input className={inputCls} name="category" placeholder="Category" onChange={onChange} />
            <input className={inputCls} name="order" type="number" placeholder="Order" onChange={onChange} />
            <input className={inputCls} name="videoId" placeholder="YouTube video ID (optional)" onChange={onChange} />
            <input className={inputCls} name="link" type="url" placeholder="External link (optional)" onChange={onChange} />
            <select className={inputCls} name="selectedList" value={input.selectedList} onChange={onChange}>
              {LISTS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
            <button type="submit" disabled={saving}
              className="rounded-lg bg-dark-green-s px-3 py-2 text-sm font-medium text-white disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
