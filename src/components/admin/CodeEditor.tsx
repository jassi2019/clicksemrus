"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronRight, ExternalLink, FileCode, Folder, FolderOpen, History, Loader2, RefreshCw, Save, Search, Undo2, X } from "lucide-react";
import type { DeployStatus, FileCommit, RepoFile } from "@/lib/github";

type Node = { name: string; path: string; children: Map<string, Node>; file?: RepoFile };

function buildTree(files: RepoFile[]): Node {
  const root: Node = { name: "", path: "", children: new Map() };
  for (const f of files) {
    let cur = root;
    const parts = f.path.split("/");
    parts.forEach((part, i) => {
      const path = parts.slice(0, i + 1).join("/");
      let next = cur.children.get(part);
      if (!next) {
        next = { name: part, path, children: new Map() };
        cur.children.set(part, next);
      }
      if (i === parts.length - 1) next.file = f;
      cur = next;
    });
  }
  return root;
}

const fmtSize = (n: number) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);
const DEPLOY_LABEL: Record<string, string> = { QUEUED: "Queued on Vercel", INITIALIZING: "Starting build", BUILDING: "Building", READY: "Live", ERROR: "Build failed", CANCELED: "Build cancelled" };

export default function CodeEditor({ repo, branch, vercel }: { repo: string; branch: string; vercel: boolean }) {
  const [files, setFiles] = useState<RepoFile[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState<Set<string>>(() => new Set(["src", "src/app", "src/components", "src/lib"]));
  const [treeOpen, setTreeOpen] = useState(false);
  const [path, setPath] = useState("");
  const [content, setContent] = useState("");
  const [orig, setOrig] = useState("");
  const [sha, setSha] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [commitUrl, setCommitUrl] = useState("");
  const [deploy, setDeploy] = useState<DeployStatus | null>(null);
  const [watching, setWatching] = useState(false);
  const [history, setHistory] = useState<FileCommit[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const savedCommit = useRef<string>("");

  const dirty = content !== orig;
  const lines = useMemo(() => content.split("\n").length, [content]);
  const tree = useMemo(() => buildTree(filter ? files.filter((f) => f.path.toLowerCase().includes(filter.toLowerCase())) : files), [files, filter]);

  /* ---------------------------------------------------------------- data */
  const loadList = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/admin/code?list=1");
      const j = (await res.json()) as { ok: boolean; files?: RepoFile[]; error?: string };
      if (!j.ok || !j.files) throw new Error(j.error || "Could not list files");
      setFiles(j.files);
    } catch (e) {
      setState("error");
      setMsg(e instanceof Error ? e.message : "Could not list files");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void loadList(), 0);
    return () => clearTimeout(t);
  }, [loadList]);

  const loadHistory = useCallback(async (p: string) => {
    const res = await fetch(`/api/admin/code?history=1&path=${encodeURIComponent(p)}`);
    const j = (await res.json()) as { ok: boolean; commits?: FileCommit[] };
    setHistory(j.ok && j.commits ? j.commits : []);
  }, []);

  async function openFile(p: string) {
    if (dirty && !confirm("Discard unsaved changes in the current file?")) return;
    setLoadingFile(true);
    setMsg("");
    setState("idle");
    setCommitUrl("");
    setTreeOpen(false);
    try {
      const res = await fetch(`/api/admin/code?path=${encodeURIComponent(p)}`);
      const j = (await res.json()) as { ok: boolean; content?: string; sha?: string; error?: string };
      if (!j.ok || typeof j.content !== "string" || !j.sha) throw new Error(j.error || "Could not load file");
      setPath(p);
      setContent(j.content);
      setOrig(j.content);
      setSha(j.sha);
      void loadHistory(p);
    } catch (e) {
      setState("error");
      setMsg(e instanceof Error ? e.message : "Could not load file");
    } finally {
      setLoadingFile(false);
    }
  }

  /* ---------------------------------------------------------------- deploy polling */
  useEffect(() => {
    if (!watching) return;
    let stopped = false;
    const started = Date.now();
    const tick = async () => {
      try {
        const res = await fetch("/api/admin/code?deploy=1");
        const j = (await res.json()) as { ok: boolean; deploy?: DeployStatus };
        if (stopped) return;
        if (j.deploy) {
          setDeploy(j.deploy);
          const isOurs = !savedCommit.current || !j.deploy.commitSha || j.deploy.commitSha.startsWith(savedCommit.current) || savedCommit.current.startsWith(j.deploy.commitSha);
          if (!j.deploy.configured || (isOurs && (j.deploy.state === "READY" || j.deploy.state === "ERROR" || j.deploy.state === "CANCELED"))) {
            setWatching(false);
            return;
          }
        }
      } catch {
        /* retry */
      }
      if (Date.now() - started > 8 * 60_000) setWatching(false);
    };
    void tick();
    const id = setInterval(tick, 8000);
    return () => {
      stopped = true;
      clearInterval(id);
    };
  }, [watching]);

  /* ---------------------------------------------------------------- save / revert */
  const save = useCallback(async () => {
    if (!path || !dirty || state === "saving") return;
    setState("saving");
    setMsg("");
    try {
      const res = await fetch("/api/admin/code", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ path, content, sha }) });
      const j = (await res.json()) as { ok: boolean; sha?: string; commitSha?: string; url?: string; error?: string };
      if (!res.ok || !j.ok || !j.sha) throw new Error(j.error || "Commit failed");
      setSha(j.sha);
      setOrig(content);
      setState("saved");
      setCommitUrl(j.url || "");
      savedCommit.current = j.commitSha || "";
      setMsg(vercel ? `Committed ${j.commitSha?.slice(0, 7) ?? ""} to ${branch}. Watching the Vercel deploy…` : `Committed ${j.commitSha?.slice(0, 7) ?? ""} and pushed to GitHub. Vercel will deploy it in about 2 minutes.`);
      setDeploy(null);
      if (vercel) setWatching(true);
      void loadHistory(path);
    } catch (e) {
      setState("error");
      setMsg(e instanceof Error ? e.message : "Commit failed");
    }
  }, [path, dirty, state, content, sha, vercel, branch, loadHistory]);

  async function revert() {
    if (!path) return;
    if (!confirm(`Replace ${path} with the version from the previous commit and push that as a new commit?`)) return;
    setState("saving");
    setMsg("");
    try {
      const res = await fetch("/api/admin/code", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "revert", path }) });
      const j = (await res.json()) as { ok: boolean; content?: string; sha?: string; commitSha?: string; url?: string; error?: string };
      if (!res.ok || !j.ok || typeof j.content !== "string" || !j.sha) throw new Error(j.error || "Revert failed");
      setContent(j.content);
      setOrig(j.content);
      setSha(j.sha);
      setState("saved");
      setCommitUrl(j.url || "");
      savedCommit.current = j.commitSha || "";
      setMsg(vercel ? "Reverted and committed. Watching the Vercel deploy…" : "Reverted and pushed to GitHub. Vercel will deploy it in about 2 minutes.");
      setDeploy(null);
      if (vercel) setWatching(true);
      void loadHistory(path);
    } catch (e) {
      setState("error");
      setMsg(e instanceof Error ? e.message : "Revert failed");
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function onTab(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart: s, selectionEnd: en } = el;
    const next = content.slice(0, s) + "  " + content.slice(en);
    setContent(next);
    requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
  }

  /* ---------------------------------------------------------------- tree */
  function toggle(p: string) {
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(p)) n.delete(p);
      else n.add(p);
      return n;
    });
  }
  const renderNode = (n: Node, depth: number): React.ReactNode => {
    const dirs = Array.from(n.children.values()).filter((c) => !c.file).sort((a, b) => a.name.localeCompare(b.name));
    const leaves = Array.from(n.children.values()).filter((c) => c.file).sort((a, b) => a.name.localeCompare(b.name));
    return (
      <>
        {dirs.map((d) => {
          const isOpen = Boolean(filter) || open.has(d.path);
          return (
            <div key={d.path}>
              <button onClick={() => toggle(d.path)} className="w-full flex items-center gap-1.5 text-left text-xs py-1 rounded hover:bg-surface-2 text-muted" style={{ paddingLeft: depth * 12 + 4 }}>
                {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                {isOpen ? <FolderOpen size={13} /> : <Folder size={13} />}
                <span className="truncate">{d.name}</span>
              </button>
              {isOpen && renderNode(d, depth + 1)}
            </div>
          );
        })}
        {leaves.map((f) => (
          <button key={f.path} onClick={() => openFile(f.path)} className={`w-full flex items-center gap-1.5 text-left text-xs py-1 rounded font-mono ${path === f.path ? "bg-brand/10 text-brand font-semibold" : "hover:bg-surface-2"}`} style={{ paddingLeft: depth * 12 + 20 }} title={f.path}>
            <FileCode size={13} className="shrink-0" />
            <span className="truncate">{f.name}</span>
          </button>
        ))}
      </>
    );
  };

  const deployLabel = deploy?.state ? DEPLOY_LABEL[deploy.state] ?? deploy.state : "";
  const deployTone = deploy?.state === "READY" ? "text-lime" : deploy?.state === "ERROR" || deploy?.state === "CANCELED" ? "text-accent" : "text-sun";

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Code editor</h1>
          <p className="text-muted text-sm">
            Editing <span className="font-mono">{repo}</span> on branch <span className="font-mono">{branch}</span>. Each save is a commit; Vercel deploys it automatically.
          </p>
        </div>
        <button onClick={() => void loadList()} className="btn btn-ghost text-sm !py-2" disabled={loadingList}><RefreshCw size={14} className={loadingList ? "animate-spin" : ""} /> Refresh files</button>
      </div>

      <div className="card p-4 !transform-none border-sun/60 bg-sun/10 flex gap-3 items-start text-sm">
        <AlertTriangle size={18} className="text-sun shrink-0 mt-0.5" />
        <p>
          <strong>Careful: this edits the live codebase.</strong> A syntax or type error will make the next deploy fail. The previously deployed version stays live until a build succeeds, so the site will not go down, but your change will not appear until the error is fixed. Use <em>Revert this file</em> to go back to the previous commit if a build fails.
        </p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-4 items-start">
        {/* file browser */}
        <aside className="card p-3 !transform-none lg:sticky lg:top-4">
          <button onClick={() => setTreeOpen((v) => !v)} className="lg:hidden w-full flex items-center justify-between text-sm font-semibold mb-2">
            Files ({files.length}) {treeOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          <div className={`${treeOpen ? "block" : "hidden"} lg:block`}>
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input className="input !py-2 !pl-8 text-sm" placeholder="Filter files" value={filter} onChange={(e) => setFilter(e.target.value)} />
              {filter && <button onClick={() => setFilter("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted" aria-label="Clear filter"><X size={14} /></button>}
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              {loadingList ? <p className="text-xs text-muted flex items-center gap-2 p-2"><Loader2 size={14} className="animate-spin" /> Loading from GitHub…</p> : files.length === 0 ? <p className="text-xs text-muted p-2">No files. Check the token permissions.</p> : renderNode(tree, 0)}
            </div>
            <p className="text-[11px] text-muted mt-2 px-1">Editable: src/app, src/components, site.ts, pageContent.ts, globals.css, README.</p>
          </div>
        </aside>

        {/* editor */}
        <div className="card !transform-none overflow-hidden min-w-0">
          <div className="flex items-center gap-2 flex-wrap px-3 py-2 border-b border-border bg-surface-2/60">
            <span className="font-mono text-xs truncate flex-1 min-w-[8rem]">{path || "Select a file"}</span>
            {path && <span className="text-[11px] text-muted shrink-0">{lines} lines · {fmtSize(new TextEncoder().encode(content).length)}{dirty ? " · modified" : ""}</span>}
            <button onClick={() => void save()} disabled={!path || !dirty || state === "saving"} className="btn btn-primary text-xs !py-1.5 !px-3" title="Ctrl+S">
              {state === "saving" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save &amp; commit
            </button>
            <button onClick={() => { if (!dirty || confirm("Discard your unsaved changes?")) setContent(orig); }} disabled={!dirty} className="btn btn-ghost text-xs !py-1.5 !px-3">Discard</button>
            <button onClick={revert} disabled={!path || state === "saving" || history.length < 2} className="btn btn-ghost text-xs !py-1.5 !px-3" title="Restore the version from the previous commit"><Undo2 size={14} /> Revert this file</button>
            <button onClick={() => setShowHistory((v) => !v)} disabled={!path} className="btn btn-ghost text-xs !py-1.5 !px-3" aria-expanded={showHistory}><History size={14} /> History</button>
          </div>

          {showHistory && path && (
            <div className="px-3 py-2 border-b border-border text-xs space-y-1 bg-surface-2/40">
              {history.length === 0 && <p className="text-muted">No commits found for this file.</p>}
              {history.map((c, i) => (
                <div key={c.sha} className="flex items-center gap-2 flex-wrap">
                  <span className={`badge ${i === 0 ? "bg-brand text-white" : "bg-surface-2 text-muted"}`}>{i === 0 ? "current" : `-${i}`}</span>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-mono text-brand">{c.sha.slice(0, 7)}</a>
                  <span className="truncate flex-1 min-w-[8rem]">{c.message}</span>
                  <span className="text-muted">{c.author}{c.date ? ` · ${new Date(c.date).toLocaleString("en-IN")}` : ""}</span>
                </div>
              ))}
            </div>
          )}

          {(msg || deploy) && (
            <div className="px-3 py-2 border-b border-border text-xs space-y-1">
              {msg && (
                <p className={state === "error" ? "text-accent" : "text-lime"}>
                  {msg} {commitUrl && <a href={commitUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">View commit <ExternalLink size={11} /></a>}
                </p>
              )}
              {deploy?.configured && (
                <p className={`flex items-center gap-2 ${deploy.error ? "text-muted" : deployTone}`}>
                  {watching && <Loader2 size={12} className="animate-spin" />}
                  {deploy.error ? `Deploy status unavailable: ${deploy.error}` : <>Vercel: <strong>{deployLabel}</strong>{deploy.commitMessage ? ` · ${deploy.commitMessage.split("\n")[0]}` : ""}</>}
                  {deploy.state === "READY" && deploy.url && <a href={deploy.url} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">Open <ExternalLink size={11} /></a>}
                  {deploy.state === "ERROR" && deploy.inspectorUrl && <a href={deploy.inspectorUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">Build log <ExternalLink size={11} /></a>}
                </p>
              )}
            </div>
          )}

          {path ? (
            <div className="relative flex bg-[#0b0b14] text-white" style={{ height: "70vh" }}>
              <div ref={gutterRef} className="select-none text-right pr-3 pl-3 py-3 text-xs font-mono text-white/35 overflow-hidden shrink-0 border-r border-white/10" aria-hidden="true" style={{ lineHeight: "1.5rem" }}>
                {Array.from({ length: lines }, (_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea
                ref={taRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={onTab}
                onScroll={(e) => { if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop; }}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                wrap="off"
                className="flex-1 min-w-0 bg-transparent text-white font-mono text-xs p-3 outline-none resize-none whitespace-pre overflow-auto"
                style={{ lineHeight: "1.5rem", tabSize: 2 }}
                aria-label={`Contents of ${path}`}
              />
              {loadingFile && <div className="absolute inset-0 grid place-items-center bg-[#0b0b14]/70"><Loader2 className="animate-spin" /></div>}
            </div>
          ) : (
            <div className="p-8 text-sm text-muted grid place-items-center min-h-[40vh]">
              {loadingFile ? <Loader2 className="animate-spin" /> : "Pick a file from the list to start editing. Ctrl+S saves and commits."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
