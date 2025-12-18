
import { LucideIcon } from 'lucide-react';

export type ViewType = 'landing' | 'about' | 'documentation' | 'binary-tree' | 'linked-list' | 'stack' | 'queue' | 'graph' | 'hash-table' | 'heap' | 'trie' | 'sorting' | 'avl-tree' | 'matrix' | 'segment-tree' | 'dp' | 'pathfinding' | 'convex-hull' | 'binary-search';

export interface DataStructure {
  id: ViewType;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface NavItem {
  label: string;
  view: ViewType;
}
