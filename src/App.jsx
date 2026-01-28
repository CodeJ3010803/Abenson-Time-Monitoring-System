import React, { useState, useEffect } from 'react'
import { useLogs } from './hooks/useLogs'
import { useEmployees } from './hooks/useEmployees'
import ActionCard from './components/ActionCard'
import LogsTable from './components/LogsTable'
import SettingsModal from './components/SettingsModal'
import LandingPage from './components/LandingPage'
import { Clock, Settings, ArrowLeft, Home } from 'lucide-react'

function App() {
  const [systemMode, setSystemMode] = useState(null) // 'AA' or 'TRAINING' or null

  // Determine storage key based on mode
  const storageKey = systemMode === 'TRAINING' ? 'abenson_training_logs' : 'abenson_time_logs'

  const { logs, addLog, clearLogs } = useLogs(storageKey)
  const { employees, saveEmployees, clearEmployees } = useEmployees()

  const [lastAction, setLastAction] = useState(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('abenson_time_settings')
    return saved ? JSON.parse(saved) : { requireName: true }
  })

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem('abenson_time_settings', JSON.stringify(appSettings))
  }, [appSettings])

  const handleAction = ({ name, employeeId, type }) => {
    const log = addLog({ name, employeeId, type })
    setLastAction({ ...log, message: `Successfully ${type === 'IN' ? 'Time In' : 'Time Out'}!` })

    // Clear success message after 3 seconds
    setTimeout(() => {
      setLastAction(null)
    }, 3000)
  }

  // Render Landing Page if no mode selected
  if (!systemMode) {
    return <LandingPage onSelect={setSystemMode} />
  }

  // Dashboard UI
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans animate-in fade-in duration-500">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-400/20 blur-[120px] mix-blend-multiply filter opacity-50 animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-400/20 blur-[120px] mix-blend-multiply filter opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-emerald-400/20 blur-[120px] mix-blend-multiply filter opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSystemMode(null)}
            className="group flex items-center gap-3 p-2 pr-4 rounded-xl hover:bg-white/50 border border-transparent hover:border-white/50 transition-all"
            title="Back to Menu"
          >
            <div className={`p-2.5 rounded-xl shadow-lg border flex items-center justify-center w-12 h-12 transition-colors ${systemMode === 'TRAINING'
              ? 'bg-purple-600 shadow-purple-500/30 border-purple-500 text-white'
              : 'bg-blue-600 shadow-blue-500/30 border-blue-500 text-white'
              }`}>
              {/* <span className="font-bold text-2xl pb-1">a.</span> */}
              <ArrowLeft size={24} />
            </div>

            <div className="text-left hidden md:block">
              <h1 className="text-xl font-bold text-slate-800 leading-tight">
                {systemMode === 'TRAINING' ? 'Training Attendance' : 'Attendance Recording System'}
              </h1>
              {systemMode === 'TRAINING' && (
                <p className="text-xs font-bold text-slate-400 tracking-wider">
                  SEMINAR / WORKSHOP
                </p>
              )}
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-all active:scale-95"
            title="Admin Settings"
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col xl:flex-row items-center justify-center p-6 gap-12 lg:gap-20">

        {/* Left Side - Action Card */}
        <div className="flex flex-col items-center w-full max-w-md">
          <ActionCard onAction={handleAction} requireName={false} employees={employees} logs={logs} />

          {/* Success Toast */}
          <div className={`mt-8 transition-all duration-500 ${lastAction ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
            {lastAction && (
              <div className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-xl border backdrop-blur-md ${lastAction.type === 'IN'
                ? 'bg-emerald-50/90 border-emerald-100 text-emerald-800'
                : 'bg-rose-50/90 border-rose-100 text-rose-800'
                }`}>
                <div className={`w-3 h-3 rounded-full shadow-sm ${lastAction.type === 'IN' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-rose-500 shadow-rose-500/50'}`}></div>
                <div>
                  <p className="font-bold text-sm tracking-wide uppercase opacity-80">{lastAction.type === 'IN' ? 'Clocked In' : 'Clocked Out'}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">{lastAction.name || `Employee ${lastAction.employeeId}`}</span>
                  </div>
                </div>
                <span className="text-xs font-mono ml-4 bg-white/50 px-2 py-1 rounded">
                  {new Date(lastAction.timestamp).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Logs Table */}
        <div className="flex-1 w-full max-w-4xl flex items-center justify-center h-full">
          <LogsTable logs={logs} onClear={clearLogs} employees={employees} />
        </div>

      </main>

      <footer className="relative z-10 p-6 text-center text-slate-400 text-sm font-medium">
        &copy; {new Date().getFullYear()} Abenson Time Monitoring System. All data is stored locally on this device.
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={appSettings}
        onUpdateSettings={setAppSettings}
        onImportEmployees={saveEmployees}
        onClearEmployees={clearEmployees}
        totalEmployees={employees.length}
      />
    </div>
  )
}

export default App
