import React, { useState } from 'react';
import { Settings, Lock, Eye, EyeOff, Save, Moon, Sun } from 'lucide-react';
import { ApiConfig } from '../types';

interface Props {
  config: ApiConfig;
  onConfigChange: (newConfig: ApiConfig) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ConfigBar: React.FC<Props> = ({ config, onConfigChange, theme, toggleTheme }) => {
  const [showKeys, setShowKeys] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    onConfigChange(localConfig);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 p-4 shadow-sm dark:shadow-xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="bg-blue-600 p-2 rounded-lg">
            <Settings className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
            OrgView
          </h1>
        </div>

        <div className="flex flex-1 items-center gap-4 justify-end">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 transition-colors">
             <Lock size={14} className="text-gray-500 dark:text-gray-400" />
             <input 
                type={showKeys ? "text" : "password"}
                placeholder="NZBN API Key"
                className="bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none w-32 md:w-48 placeholder-gray-500 dark:placeholder-gray-600"
                value={localConfig.nzbnKey}
                onChange={(e) => setLocalConfig({...localConfig, nzbnKey: e.target.value})}
             />
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 transition-colors">
             <Lock size={14} className="text-gray-500 dark:text-gray-400" />
             <input 
                type={showKeys ? "text" : "password"}
                placeholder="Companies API Key"
                className="bg-transparent border-none text-sm text-gray-900 dark:text-white focus:outline-none w-32 md:w-48 placeholder-gray-500 dark:placeholder-gray-600"
                value={localConfig.companiesKey}
                onChange={(e) => setLocalConfig({...localConfig, companiesKey: e.target.value})}
             />
          </div>

          <button 
            onClick={() => setShowKeys(!showKeys)}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-md p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setLocalConfig({...localConfig, environment: 'sandbox'})}
              className={`px-3 py-1 text-xs font-semibold rounded ${localConfig.environment === 'sandbox' ? 'bg-emerald-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              Sandbox
            </button>
            <button
              onClick={() => setLocalConfig({...localConfig, environment: 'prod'})}
              className={`px-3 py-1 text-xs font-semibold rounded ${localConfig.environment === 'prod' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
            >
              PROD
            </button>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20 dark:shadow-blue-900/20"
          >
            <Save size={16} />
            Apply Config
          </button>
        </div>
      </div>
    </div>
  );
};