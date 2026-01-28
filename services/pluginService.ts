
import { Project, Plugin, PluginActionResponse, Document, StoryEntity } from "../types";

export interface PluginCallResult {
  success: boolean;
  actions: PluginActionResponse[];
  error?: string;
  latency?: number;
}

export const pingPlugin = async (endpoint: string): Promise<{ manifest: Partial<Plugin>, latency: number } | null> => {
  const start = Date.now();
  try {
    // Timeout handling for ping
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${endpoint}/manifest`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const manifest = await response.json();
      return { manifest, latency: Date.now() - start };
    }
  } catch (error) {
    console.error("Plugin Ping Failed:", error);
  }
  return null;
};

export const callPluginAction = async (
  plugin: Plugin,
  actionId: string,
  project: Project,
  activeDoc?: Document,
  payload?: any
): Promise<PluginCallResult> => {
  if (!plugin.isEnabled) {
    return { success: false, actions: [], error: "Plugin is currently disabled." };
  }

  const start = Date.now();
  try {
    const response = await fetch(`${plugin.endpoint}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionId,
        pluginConfig: plugin.config || {},
        context: {
          project: {
            id: project.id,
            title: project.title,
            genre: project.genre,
            worldRules: project.worldRules,
            entities: project.entities,
          },
          activeDocument: activeDoc
        },
        payload
      })
    });

    const latency = Date.now() - start;

    if (!response.ok) {
      let errorMsg = `Server returned ${response.status}: ${response.statusText}`;
      try {
        const errData = await response.json();
        if (errData.message) errorMsg = errData.message;
      } catch (e) { /* ignore parse error */ }
      
      return { success: false, actions: [], error: errorMsg, latency };
    }

    const data = await response.json();
    return { 
      success: true,
      actions: Array.isArray(data) ? data : [data],
      latency
    };
  } catch (error: any) {
    let errorMsg = "Network error: Service unreachable or CORS blocked.";
    if (error.name === 'AbortError') errorMsg = "Request timed out.";
    
    return { 
      success: false, 
      actions: [], 
      error: errorMsg,
      latency: Date.now() - start 
    };
  }
};

export const executePluginActions = (
  actions: PluginActionResponse[],
  handlers: {
    updateDocument: (id: string, updates: Partial<Document>) => void,
    updateEntity: (id: string, updates: Partial<StoryEntity>) => void,
    activeDocId: string | null,
    onMessage: (msg: string, type: 'info' | 'error' | 'success') => void
  }
) => {
  actions.forEach(action => {
    try {
      switch (action.type) {
        case 'update_document':
          if (handlers.activeDocId && action.payload) {
            handlers.updateDocument(handlers.activeDocId, action.payload);
          }
          break;
        case 'update_entity':
          if (action.payload?.id) {
            handlers.updateEntity(action.payload.id, action.payload);
          }
          break;
        case 'show_message':
          if (action.payload?.text) {
            handlers.onMessage(action.payload.text, action.payload.type || 'info');
          }
          break;
        case 'add_log':
          console.log(`[Plugin Log]:`, action.payload);
          break;
        default:
          console.warn(`Plugin action type "${action.type}" is not supported by this version of NAO.`);
      }
    } catch (e) {
      console.error("Action execution failed:", e, action);
      handlers.onMessage(`Failed to execute action [${action.type}]: ${String(e)}`, 'error');
    }
  });
};
