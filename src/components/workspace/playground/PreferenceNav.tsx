import React, { useEffect, useState } from "react";
import { Maximize2, Minimize2, RotateCcw, Settings } from "lucide-react";
import { ISettings } from "./Playground";
import SettingsModal from "@/components/Modals/SettingsModal";

type PreferenceNavProps = {
  setting: ISettings;
  setSetting: React.Dispatch<React.SetStateAction<ISettings>>;
  language?: "javascript" | "java";
  javaAvailable?: boolean;
  onLanguageChange?: (l: "javascript" | "java") => void;
  onReset?: () => void;
};

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-md text-dark-gray-6 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-blue-s";

/** Editor toolbar: language switch, reset, settings and full screen. */
const PreferenceNav: React.FC<PreferenceNavProps> = ({ setSetting, setting, language = "javascript", javaAvailable = false, onLanguageChange, onReset }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  useEffect(() => {
    const onChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);
  const toggleFullScreen = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());

  const langs = [
    { id: "javascript" as const, label: "JavaScript", ok: true },
    { id: "java" as const, label: "Java", ok: javaAvailable },
  ];

  return (
    <div className="flex h-11 w-full shrink-0 items-center justify-between border-b border-white/[0.06] bg-dark-layer-2 px-2">
      <div role="radiogroup" aria-label="Language" className="flex rounded-lg bg-black/30 p-0.5">
        {langs.map((l) => (
          <button key={l.id} type="button" role="radio" aria-checked={language === l.id} disabled={!l.ok}
            title={l.ok ? undefined : "Java tests for this problem are coming"}
            onClick={() => onLanguageChange?.(l.id)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              language === l.id ? "bg-white/10 text-white" : "text-dark-gray-6 hover:text-white"
            }`}>
            {l.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-0.5">
        {onReset && (
          <button type="button" className={iconBtn} onClick={onReset} aria-label="Reset to starter code" title="Reset to starter code">
            <RotateCcw size={15} aria-hidden="true" />
          </button>
        )}
        <button type="button" className={iconBtn} onClick={() => setSetting({ ...setting, settingModalIsOpen: true })} aria-label="Editor settings" title="Editor settings">
          <Settings size={15} aria-hidden="true" />
        </button>
        <button type="button" className={iconBtn} onClick={toggleFullScreen} aria-label={isFullScreen ? "Exit full screen" : "Full screen"} title={isFullScreen ? "Exit full screen" : "Full screen"}>
          {isFullScreen ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
        </button>
      </div>
      {setting.settingModalIsOpen && <SettingsModal setting={setting} setSetting={setSetting} />}
    </div>
  );
};
export default PreferenceNav;
