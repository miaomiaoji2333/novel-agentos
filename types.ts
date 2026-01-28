
export enum ViewMode {
  WRITER = 'WRITER',
  PLANBOARD = 'PLANBOARD',
  WORLD = 'WORLD',
  PLUGINS = 'PLUGINS',
  ADMIN = 'ADMIN',
  SETTINGS = 'SETTINGS'
}

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: number;
}

export type EntityType = 'character' | 'setting' | 'organization' | 'item' | 'magic' | 'event';

export type AIProvider = 'gemini' | 'openai' | 'proxy';

export interface ModelInfo {
  id: string;
  name: string;
  provider: AIProvider;
  contextWindow?: number;
}

export interface AISettings {
  provider: AIProvider;
  model: string;
  proxyEndpoint?: string;
  temperature: number;
  maxOutputTokens?: number;
  thinkingBudget?: number;
}

// --- Enhanced Plugin System Types ---
export interface PluginCapability {
  id: string;
  name: string;
  type: 'text_processor' | 'data_provider' | 'ui_extension' | 'logic_checker' | 'generator';
  description: string;
  icon?: string;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  endpoint: string; 
  isEnabled: boolean;
  capabilities: PluginCapability[];
  lastPing?: number;
  latency?: number;
  status: 'online' | 'offline' | 'error';
  config?: Record<string, any>; // Persistent plugin settings
}

export interface PluginActionResponse {
  type: 'update_document' | 'update_entity' | 'show_message' | 'insert_text' | 'add_log';
  payload: any;
}
// --- End Plugin Types ---

export interface EntityLink {
  targetId: string;
  type: EntityType;
  relationName: string;
}

export interface Bookmark {
  id: string;
  name: string;
  position: number;
  timestamp: number;
}

export interface EntityCustomField {
  key: string;
  value: string;
}

export interface StoryEntity {
  id: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  content: string;
  voiceStyle?: string; 
  tags: string[];
  linkedIds: EntityLink[];
  importance: 'main' | 'secondary' | 'minor';
  customFields?: EntityCustomField[]; 
  referenceCount?: number; 
}

export interface Document {
  id: string;
  volumeId: string;
  title: string;
  content: string;
  summary?: string;
  status: '草稿' | '修改中' | '完成';
  order: number;
  linkedIds: EntityLink[];
  bookmarks: Bookmark[];
  timeNode?: string;
  duration?: string;
  targetWordCount?: number; 
  chapterGoal?: string; 
  corePlot?: string;    
  hook?: string;        
  causeEffect?: string; 
  foreshadowingDetails?: string; 
}

export interface Volume {
  id: string;
  title: string;
  order: number;
  theme: string;       
  coreGoal: string;    
  boundaries: string;  
  chapterLinkageLogic?: string; 
  volumeSpecificSettings?: string; 
  plotRoadmap?: string; 
}

export interface AIPromptTemplate {
  id: string;
  name: string;
  description: string;
  category: 'logic' | 'style' | 'content' | 'character';
  template: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: number;
}

export interface Project {
  id: string;
  title: string;
  genre?: string; 
  tags?: string[]; 
  totalWordCount?: number; 
  coreConflict: string; 
  characterArc: string; 
  ultimateValue: string; 
  worldRules?: string;   
  characterCore?: string; 
  symbolSettings?: string; 
  volumes: Volume[];
  documents: Document[];
  entities: StoryEntity[];
  templates: AIPromptTemplate[];
  aiSettings: AISettings;
  plugins?: Plugin[]; 
}
