import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProject } from '../contexts/ProjectContext';
import { 
  UserCircle, Shield, Calendar, Trash2, LogOut, Settings, Bell, Palette, Cpu, 
  UserCheck, ArrowLeft, Sparkles, Globe, BrainCircuit, RefreshCw, 
  Check, Info, Keyboard, List, Hash, ShieldCheck, Zap, AlertCircle,
  Loader2, Activity, Database, Clock, User as UserIcon, Settings2, Code, Laptop, Users, LayoutDashboard, ChevronLeft
} from 'lucide-react';
import { AIProvider, ViewMode } from '../types';

type SettingsTab = 'profile' | 'ai-engine' | 'appearance' | 'data' | 'admin';

export const UserSettings: React.FC = () => {
  const { user, allUsers, deleteUser, logout } = useAuth();
  const { project, theme, setTheme, defaultAISettings, updateDefaultAISettings, updateAISettings, availableModels, refreshModels, previousViewMode, navigateBack } = useProject();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const providers: { id: AIProvider; name: string; icon: React.ReactNode; color: string; activeBg: string }[] = [
    { id: 'gemini', name: 'Google Gemini', icon: <Sparkles className="w-4 h-4" />, color: 'bg-blue-500', activeBg: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20' },
    { id: 'openai', name: 'OpenAI (官方)', icon: <Cpu className="w-4 h-4" />, color: 'bg-emerald-500', activeBg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20' },
    { id: 'proxy', name: '第三方代理 (NewAPI)', icon: <Globe className="w-4 h-4" />, color: 'bg-indigo-500', activeBg: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20' },
  ];

  useEffect(() => {
    if (availableModels.length === 0) {
      handleRefresh();
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setVerifyStatus('testing');
    try {
      await refreshModels(project?.aiSettings || defaultAISettings);
      setVerifyStatus('success');
    } catch (e) {
      setVerifyStatus('failed');
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setVerifyStatus('idle'), 3000);
    }
  };

  if (!user) return null;

  const currentSettings = project ? project.aiSettings : defaultAISettings;
  const isGeminiModel = currentSettings.provider === 'gemini' || currentSettings.model.includes('gemini');
  const supportsThinking = isGeminiModel && (currentSettings.model.includes('3') || currentSettings.model.includes('2.5'));

  const navItem = (id: SettingsTab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
        activeTab === id 
          ? 'bg-ink-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md translate-x-1' 
          : 'text-ink-400 hover:bg-paper-100 dark:hover:bg-zinc-800 hover:text-ink-900'
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="flex-1 h-full bg-paper-50 dark:bg-zinc-950 transition-colors flex overflow-hidden">
      {/* 侧边导航 */}
      <div className="w-72 border-r border-paper-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-8 flex flex-col pt-24 shrink-0 shadow-lg z-10">
        
        {/* 动态返回按钮 - 路由溯源与视觉增强 */}
        <div className="mb-10 group">
          <button 
            onClick={navigateBack}
            className="w-full flex items-center gap-3 px-5 py-4 bg-ink-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-none transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform relative z-10" />
            <div className="flex flex-col items-start relative z-10">
               <span className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">
                 {previousViewMode === 'DASHBOARD' ? '仪表盘' : '创作空间'}
               </span>
               <span className="text-[9px] font-medium opacity-60 uppercase truncate max-w-[140px]">
                 {previousViewMode === 'DASHBOARD' ? '返回项目列表' : `返回: ${project?.title || '手稿'}`}
               </span>
            </div>
          </button>
        </div>

        <h3 className="text-[10px] font-black text-ink-300 dark:text-zinc-600 uppercase tracking-[0.3em] mb-6 px-4">系统控制中心</h3>
        <nav className="space-y-1">
          {navItem('profile', '个人资料', <UserCircle className="w-4 h-4" />)}
          {navItem('ai-engine', 'AI 创作引擎', <Cpu className="w-4 h-4" />)}
          {navItem('appearance', '界面与外观', <Palette className="w-4 h-4" />)}
          {navItem('data', '数据与存储', <Database className="w-4 h-4" />)}
          {user.role === 'admin' && navItem('admin', '超级管理', <Shield className="w-4 h-4" />)}
        </nav>
        
        <div className="mt-auto pt-6 border-t border-paper-100 dark:border-zinc-800">
           <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-xs font-bold transition-all">
             <LogOut className="w-4 h-4" /> 退出当前登录
           </button>
        </div>
      </div>

      {/* 主详情区 */}
      <div className="flex-1 overflow-y-auto pt-28 pb-20 px-12 md:px-20 custom-scrollbar bg-dot-pattern">
        <div className="max-w-4xl space-y-12 animate-in fade-in duration-500">
          
          {activeTab === 'profile' && (
            <section className="space-y-10">
              <div className="flex items-center gap-8 bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
                <div className="w-24 h-24 bg-ink-900 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-xl">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-ink-900 dark:text-white font-serif">{user.username}</h2>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-ink-100 dark:bg-zinc-800 text-ink-900 dark:text-zinc-300 rounded-full text-[9px] font-black uppercase tracking-widest">{user.role}</span>
                    <span className="text-xs text-ink-300 flex items-center gap-1.5 font-bold"><Calendar className="w-3.5 h-3.5" /> 加入于 {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-gray-50 dark:border-zinc-800 shadow-sm group hover:border-ink-200 transition-colors">
                    <h4 className="text-[10px] font-black text-ink-300 uppercase mb-4 tracking-widest flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5" /> 安全设置
                    </h4>
                    <button className="w-full py-4 bg-paper-100 dark:bg-zinc-800 rounded-xl text-xs font-black uppercase hover:bg-paper-200 transition-colors tracking-widest">修改登录密码</button>
                 </div>
                 <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-gray-50 dark:border-zinc-800 shadow-sm group hover:border-ink-200 transition-colors">
                    <h4 className="text-[10px] font-black text-ink-300 uppercase mb-4 tracking-widest flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5" /> 关联邮箱
                    </h4>
                    <p className="text-sm font-bold text-ink-200 italic">未绑定</p>
                 </div>
              </div>
            </section>
          )}

          {activeTab === 'ai-engine' && (
            <section className="space-y-8">
              <div className="bg-white dark:bg-zinc-900 p-12 rounded-[3.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10">
                <header className="flex justify-between items-center border-b border-gray-50 dark:border-zinc-800 pb-8">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black text-ink-900 dark:text-white font-serif italic flex items-center gap-3">
                         <BrainCircuit className="w-7 h-7 text-brand-600" /> 创作引擎配置
                      </h3>
                      <p className="text-[10px] text-ink-400 uppercase font-black tracking-widest">
                        {project ? `正在配置项目专属引擎: ${project.title}` : '正在配置系统全局引擎默认值'}
                      </p>
                   </div>
                   <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-black uppercase">API Key 安全运行中</span>
                      </div>
                   </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {providers.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => project ? updateAISettings({ provider: p.id }) : updateDefaultAISettings({ provider: p.id })}
                      className={`flex flex-col items-start gap-4 p-6 rounded-[2rem] border-2 transition-all group ${
                        currentSettings.provider === p.id 
                          ? `${p.activeBg} border-brand-500 shadow-lg` 
                          : 'border-gray-50 dark:border-zinc-800 bg-paper-50/50 hover:border-gray-200'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl text-white ${p.color} shadow-md group-hover:scale-110 transition-transform`}>{p.icon}</div>
                      <div className="text-left">
                        <span className={`text-[11px] font-black uppercase block ${currentSettings.provider === p.id ? 'text-brand-900 dark:text-brand-400' : 'text-ink-900 dark:text-zinc-100'}`}>{p.name}</span>
                        <span className="text-[8px] font-bold text-ink-300 dark:text-zinc-600 uppercase mt-1">Provider Node</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-8">
                  {(currentSettings.provider === 'proxy' || currentSettings.provider === 'openai') && (
                    <div className="space-y-3 animate-in slide-in-from-top-2">
                       <label className="text-[10px] font-black text-ink-400 uppercase tracking-widest px-1">接口端点 (Endpoint Address)</label>
                       <input 
                         className="w-full px-6 py-5 bg-paper-50 dark:bg-zinc-950 rounded-2xl border-none text-sm font-mono font-bold text-ink-900 dark:text-zinc-100 shadow-inner"
                         value={currentSettings.proxyEndpoint || ''}
                         onChange={(e) => project ? updateAISettings({ proxyEndpoint: e.target.value }) : updateDefaultAISettings({ proxyEndpoint: e.target.value })}
                         placeholder="https://apis.iflow.cn/v1/chat/completions"
                       />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-ink-400 uppercase tracking-widest">模型大脑 (Creative Model)</label>
                      <button onClick={handleRefresh} disabled={isRefreshing} className="text-[9px] font-black text-brand-600 dark:text-brand-400 flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-900/30 rounded-lg hover:bg-brand-100 transition-all">
                         <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} /> 连接与可用性测试
                      </button>
                    </div>
                    <div className="relative">
                      <select 
                        className="w-full p-5 bg-paper-50 dark:bg-zinc-950 rounded-3xl border-none text-sm font-black appearance-none text-ink-900 dark:text-zinc-100 shadow-inner cursor-pointer"
                        value={currentSettings.model}
                        onChange={(e) => project ? updateAISettings({ model: e.target.value }) : updateDefaultAISettings({ model: e.target.value })}
                      >
                        {availableModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-ink-300">
                        <ChevronLeft className="w-4 h-4 rotate-[-90deg]" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-paper-50 dark:bg-zinc-950/50 p-8 rounded-[2.5rem] border border-paper-100 dark:border-zinc-800">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-ink-400 uppercase tracking-widest">创造力温度 (Temp): {currentSettings.temperature}</label>
                      </div>
                      <input 
                        type="range" min="0" max="1" step="0.1"
                        className="w-full h-1.5 bg-paper-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-ink-900 dark:accent-zinc-100"
                        value={currentSettings.temperature}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          project ? updateAISettings({ temperature: val }) : updateDefaultAISettings({ temperature: val });
                        }}
                      />
                      <p className="text-[9px] text-ink-300 font-medium">数值越高，文本越具扩散性与惊喜感；越低则越严谨稳健。</p>
                    </div>
                    {supportsThinking && (
                      <div className="space-y-6">
                        <label className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">深度思考预算: {currentSettings.thinkingBudget || 0} Tokens</label>
                        <input 
                          type="range" min="0" max="32768" step="1024"
                          className="w-full h-1.5 bg-brand-100 dark:bg-brand-900/40 rounded-lg appearance-none cursor-pointer accent-brand-500"
                          value={currentSettings.thinkingBudget || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            project ? updateAISettings({ thinkingBudget: val }) : updateDefaultAISettings({ thinkingBudget: val });
                          }}
                        />
                        <p className="text-[9px] text-brand-500/60 font-medium">增加模型的逻辑推演能力。适合处理复杂的伏笔与角色因果关系。</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'appearance' && (
            <section className="space-y-8">
               <div className="bg-white dark:bg-zinc-900 p-12 rounded-[3.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10">
                  <h3 className="text-2xl font-black text-ink-900 dark:text-white font-serif italic">界面与感官体验</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-8 bg-paper-50 dark:bg-zinc-950 rounded-[2.5rem] border border-paper-100 dark:border-zinc-800 shadow-inner">
                       <div className="space-y-1">
                          <p className="text-sm font-black">配色方案 (Color Scheme)</p>
                          <p className="text-[10px] text-ink-400 font-bold uppercase tracking-widest">控制系统的白昼与深夜模式</p>
                       </div>
                       <button 
                         onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                         className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${theme === 'light' ? 'bg-ink-900 text-white' : 'bg-zinc-100 text-zinc-900'}`}
                       >
                         {theme === 'light' ? <Activity className="w-4 h-4 text-indigo-400" /> : <Laptop className="w-4 h-4 text-brand-600" />}
                         {theme === 'light' ? '切换深夜模式' : '切换白昼模式'}
                       </button>
                    </div>
                  </div>
               </div>
            </section>
          )}

          {activeTab === 'admin' && user.role === 'admin' && (
            <section className="space-y-8 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 flex items-center gap-6 shadow-sm">
                    <div className="p-4 bg-brand-500 text-white rounded-2xl shadow-lg"><Users className="w-7 h-7" /></div>
                    <div>
                       <p className="text-[10px] font-black text-ink-300 uppercase tracking-widest">注册用户</p>
                       <p className="text-3xl font-black">{allUsers.length}</p>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 flex items-center gap-6 shadow-sm">
                    <div className="p-4 bg-indigo-500 text-white rounded-2xl shadow-lg"><Database className="w-7 h-7" /></div>
                    <div>
                       <p className="text-[10px] font-black text-ink-300 uppercase tracking-widest">数据实例</p>
                       <p className="text-3xl font-black">{allUsers.length}</p>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 flex items-center gap-6 shadow-sm">
                    <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg"><Activity className="w-7 h-7" /></div>
                    <div>
                       <p className="text-[10px] font-black text-ink-300 uppercase tracking-widest">系统状态</p>
                       <p className="text-lg font-black text-emerald-500 uppercase">Operational</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950 flex justify-between items-center">
                   <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-3"><UserCheck className="w-5 h-5 text-brand-600" /> 用户生命周期管理</h4>
                   <span className="text-[9px] font-black text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-3 py-1.5 rounded-xl uppercase border border-brand-100 dark:border-brand-900/50">Root Authority</span>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="border-b border-gray-50 dark:border-zinc-800 text-[10px] font-black text-ink-300 uppercase tracking-widest">
                            <th className="px-10 py-6">Identity</th>
                            <th className="px-10 py-6">Permission</th>
                            <th className="px-10 py-6">Onboard Date</th>
                            <th className="px-10 py-6">Operation</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                         {allUsers.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-all">
                               <td className="px-10 py-6">
                                 <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg bg-paper-100 dark:bg-zinc-800 flex items-center justify-center font-black text-[10px]">{u.username.charAt(0).toUpperCase()}</div>
                                   <span className="text-sm font-bold">{u.username}</span>
                                 </div>
                               </td>
                               <td className="px-10 py-6">
                                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-brand-500 text-white' : 'bg-paper-100 dark:bg-zinc-800 text-ink-300'}`}>
                                    {u.role}
                                  </span>
                               </td>
                               <td className="px-10 py-6 text-xs text-ink-300 font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                               <td className="px-10 py-6">
                                  {u.id !== user.id ? (
                                    <button onClick={() => deleteUser(u.id)} className="p-2 text-ink-200 hover:text-rose-500 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                                  ) : (
                                    <span className="text-[9px] font-black text-brand-600 italic px-2">Current Superuser</span>
                                  )}
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};
