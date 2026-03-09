import { useIntervalTimer } from './hooks/useIntervalTimer';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { TimerSettingsForm } from './components/TimerSettingsForm';
import { PresetList } from './components/PresetList';
import { TimerSettings } from './types/timer';
import './App.css';

function App() {
  const { timerState, settings, setSettings, start, pause, resume, reset } = useIntervalTimer();
  const isActive = timerState.phase !== 'idle';

  function handleLoadPreset(loaded: TimerSettings) {
    setSettings(loaded);
  }

  return (
    <div className="app">
      <header>
        <h1>Interval Timer</h1>
      </header>

      <main className="app-main">
        <section className="timer-section">
          <TimerDisplay state={timerState} totalRounds={settings.rounds} />
          <TimerControls
            phase={timerState.phase}
            isRunning={timerState.isRunning}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onReset={reset}
          />
        </section>

        <aside className="sidebar">
          <TimerSettingsForm
            settings={settings}
            onChange={setSettings}
            disabled={isActive}
          />
          <PresetList
            currentSettings={settings}
            onLoad={handleLoadPreset}
            disabled={isActive}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;
