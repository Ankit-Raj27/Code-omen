import React, { useEffect, useState } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from "react-icons/ai";
import { ISettings } from "./Playground";
import SettingsModal from "@/components/Modals/SettingsModal";
import EditorFooter from "./EditorFooter";
type PreferenceNavProps = {
  setting : ISettings,
  setSetting : React.Dispatch<React.SetStateAction<ISettings>>,
  language?: "javascript" | "java",
  javaAvailable?: boolean,
  onLanguageChange?: (l: "javascript" | "java") => void,
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({setSetting,setting,language = "javascript",javaAvailable = false,onLanguageChange}) => {
  const[isFullScreen,setIsFullScreen] = useState(false)
  const handleFullScreen = ()=>{
    if(isFullScreen){
      document.exitFullscreen()

    }
    else{
      document.documentElement.requestFullscreen()
    }
    setIsFullScreen(!isFullScreen)
  }
  useEffect(()=>{
    function exitHandler(e:any){
      if(!document.fullscreenElement){
        setIsFullScreen(false)
        return
      }
      setIsFullScreen(true)
    }
    if(document.addEventListener){
      document.addEventListener("fullscreenchange",exitHandler)
      document.addEventListener("webkitfullscreenchange",exitHandler)
      document.addEventListener("mozfullscreenchange",exitHandler)
      document.addEventListener("MSFullscreenChange",exitHandler)
    }
  },[isFullScreen])
  return (
    <div className="flex items-center justify-between bg-dark-layer-2 h-11 w-full">
      <div className="flex items-center text-white">
        <select
          aria-label="Language"
          value={language}
          onChange={(e) => onLanguageChange?.(e.target.value as "javascript" | "java")}
          className="cursor-pointer rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1.5 text-xs font-medium"
        >
          <option value="javascript">JavaScript</option>
          <option value="java" disabled={!javaAvailable}>{javaAvailable ? "Java" : "Java (tests coming soon)"}</option>
        </select>
      </div>

      <div className="flex items-center m-2">
        <button className="preferenceBtn group" onClick={()=>setSetting({...setting,settingModalIsOpen:true})}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineSetting />
          </div>
          <div className="preferenceBtn-tooltip ">Settings</div>
        </button>

        <button className="preferenceBtn group" onClick={handleFullScreen}>
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            {!isFullScreen ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />} 
          </div>
          <div className="preferenceBtn-tooltip">Full Screen</div>
        </button>
      
      </div>
      {setting.settingModalIsOpen && <SettingsModal setting={setting} setSetting ={setSetting}/>}
      
    </div>
  );
};
export default PreferenceNav;
