import { Search, Share2, MousePointerClick, Megaphone, PenTool, Code2, Users, MessageCircle, Sparkles, type LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = { Search, Share2, MousePointerClick, Megaphone, PenTool, Code2, Users, MessageCircle, Sparkles };

export default function ServiceIcon({ name, size = 22, className = "" }: { name: string; size?: number; className?: string }) {
  const Icon = ICONS[name] || Sparkles;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
