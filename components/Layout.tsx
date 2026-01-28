
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Editor } from './Editor';
import { KanbanBoard } from './KanbanBoard';
import { WorldBible } from './WorldBible';
import { AIAssistant } from './AIAssistant';
import { ProjectDashboard } from './ProjectDashboard';
import { NovelWizard } from './NovelWizard';
import { PluginManager } from './PluginManager';
import { AuthScreen } from './AuthScreen';
import { UserSettings } from './UserSettings';
import { useProject } from '../contexts/ProjectContext';
import { useAuth } from '../contexts/AuthContext';
import { ViewMode } from '../types';
import { Menu, Loader2, Shield, Settings, User as UserIcon, LayoutDashboard, ChevronDown } from 'lucide-react';

const LayoutContent: React.FC = () => {
  const { viewMode, activeProjectId, theme, setViewMode, project, isAISidebarOpen, exitProject } = useProject();
  const { user, isLoading } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync theme with DOM
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-paper-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (isCreating) {
    return <NovelWizard onCancel={() => setIsCreating(false)} />;
  }

  const isSettingsView = viewMode === ViewMode.SETTINGS;
  const showSidebar = !!activeProjectId && !isSettingsView;

  const renderMainContent = () => {
    if (!activeProjectId && !isSettingsView) {
      return <ProjectDashboard onCreateNew={() => setIsCreating(true)} />;
    }

    switch (viewMode) {
      case ViewMode.WRITER:
        return <Editor />;
      case ViewMode.PLANBOARD:
        return <KanbanBoard />;
      case ViewMode.WORLD:
        return <WorldBible />;
      case ViewMode.PLUGINS:
        return <PluginManager />;
      case ViewMode.SETTINGS:
        return <UserSettings />;
      default:
        return <ProjectDashboard onCreateNew={() => setIsCreating(true)} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-paper-50 dark:bg-zinc-950 text-ink-900 dark:text-zinc-100 overflow-hidden font-sans transition-colors duration-300">
      {showSidebar && (
        <div className="hidden md:block h-full shrink-0">
          <Sidebar />
        </div>
      )}

      {showSidebar && mobileMenuOpen && (
        <div className="fixed inset-0 z-[150] md:hidden flex">
           <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
           <div className="relative w-64 h-full bg-white dark:bg-zinc-900 shadow-xl animate-in slide-in-from-left duration-300">
              <Sidebar />
           </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* 全局悬浮系统托盘 - 居中设计 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] pointer-events-none w-full max-w-2xl flex justify-center px-4">
          <div className={`flex items-center gap-1 p-1.5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-paper-200 dark:border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] pointer-events-auto transition-all duration-500 ${viewMode === ViewMode.WRITER ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}>
             
             {/* 返回仪表盘按钮 (仅在进入项目后显示) */}
             {activeProjectId && (
               <button 
                 onClick={exitProject}
                 className="flex items-center gap-2 px-3 py-1.5 hover:bg-paper-100 dark:hover:bg-zinc-800 rounded-xl transition-all group text-ink-500 dark:text-zinc-400"
                 title="返回仪表盘"
               >
                  <LayoutDashboard className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Dashboard</span>
               </button>
             )}

             <div className="w-px h-4 bg-paper-200 dark:bg-zinc-800 mx-1"></div>

             {/* 设置中心入口 */}
             <button 
               onClick={() => setViewMode(ViewMode.SETTINGS)} 
               className={`flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl transition-all group ${viewMode === ViewMode.SETTINGS ? 'bg-ink-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md' : 'hover:bg-paper-50 dark:hover:bg-zinc-800'}`}
             >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black transition-colors ${viewMode === ViewMode.SETTINGS ? 'bg-white/20 dark:bg-black/20' : 'bg-ink-900 dark:bg-zinc-100 text-white dark:text-ink-900'}`}>
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start leading-none mr-2">
                    <span className="text-[10px] font-black uppercase tracking-widest">{user?.username}</span>
                    <span className="text-[8px] font-medium opacity-50 uppercase">{user?.role}</span>
                  </div>
                </div>
                <Settings className={`w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:rotate-90 transition-all ${viewMode === ViewMode.SETTINGS ? 'opacity-100' : ''}`} />
             </button>
          </div>
        </div>

        {showSidebar && (
          <div className="md:hidden h-12 border-b border-paper-200 dark:border-zinc-800 flex items-center px-4 bg-paper-50 dark:bg-zinc-900 justify-between shrink-0">
              <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-ink-500 dark:text-zinc-400">
                <Menu className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-ink-900 dark:text-zinc-100">{project?.title || 'Novel Agent OS'}</span>
              <div className="w-8"></div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
            {renderMainContent()}
          </div>
          {activeProjectId && !isSettingsView && <AIAssistant />}
        </div>
      </main>
    </div>
  );
};

export const Layout: React.FC = () => {
  return <LayoutContent />;
};
