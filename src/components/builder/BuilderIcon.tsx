import {
  Target, Zap, BarChart3, TrendingUp, Star, Award, Search, Share2, MousePointerClick, Megaphone, PenTool, Code2, Users, MessageCircle, Sparkles, IndianRupee, Eye, Palette,
  FileText, Lock, Clock, MapPin, Layers, Wrench, Heart, Check, Shield, Rocket, Globe, Phone, Mail, ThumbsUp, Lightbulb, Smartphone, ShoppingBag, Camera, Video, Headphones,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Target, Zap, BarChart3, TrendingUp, Star, Award, Search, Share2, MousePointerClick, Megaphone, PenTool, Code2, Users, MessageCircle, Sparkles, IndianRupee, Eye, Palette,
  FileText, Lock, Clock, MapPin, Layers, Wrench, Heart, Check, Shield, Rocket, Globe, Phone, Mail, ThumbsUp, Lightbulb, Smartphone, ShoppingBag, Camera, Video, Headphones,
};

/** Icon picked by name in the page builder (features items). Falls back to a star. */
export default function BuilderIcon({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) {
  const Icon = ICONS[name] || Star;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
