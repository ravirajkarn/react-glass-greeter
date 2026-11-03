import { useState } from "react";
import { BsAppleMusic } from "react-icons/bs";
import { MdPlayArrow, MdPause, MdSkipNext, MdSkipPrevious, MdMusicNote } from "react-icons/md";
import { CustomImage } from "./Image";

interface PlayerProps {
  className?: string;
}

// Mock Data: What the user will see before hooking it up to a Linux MPRIS script
const MOCK_TRACK = {
  title: "Midnight City",
  artist: "M83",
  // A royalty-free abstract synthwave image for the album cover placeholder
  cover: "",
  progress: 35, // percentage
  currentTime: "1:24",
  totalTime: "4:03",
};

export default function Player({ className }: PlayerProps) {
  // Local state to handle the play/pause button toggle visually
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={className}>
      {/* Widget Header */}
      <div className="flex items-center gap-2 text-white/60 text-sm font-semibold uppercase tracking-wider mb-5">
        <MdMusicNote className="text-lg" />
        <span>Now Playing</span>
      </div>

      {/* Player Card */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col">
        <div className="flex items-center gap-4">
          {/* Album Art */}
          <div className="relative size-20 rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)] shrink-0 group">
            <CustomImage
              src={MOCK_TRACK.cover}
              alt="Album cover"
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? "scale-110" : "scale-100"}`}
              fallback={<BsAppleMusic className="w-1/3 h-1/3 animate-pulse" />}
            />
            {/* Subtle dark overlay when playing */}
            <div
              className={`absolute inset-0 bg-black/20 transition-opacity ${isPlaying ? "opacity-100" : "opacity-0"}`}
            />
          </div>

          {/* Track Info & Controls */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="truncate text-white font-bold text-lg leading-tight">
              {MOCK_TRACK.title}
            </div>
            <div className="truncate text-white/60 text-sm mt-0.5">{MOCK_TRACK.artist}</div>

            {/* Media Controls */}
            <div className="flex items-center gap-4 mt-3">
              <button className="text-white/50 hover:text-white transition-colors">
                <MdSkipPrevious size={24} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="size-9 bg-[#007bff] hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,123,255,0.4)]"
              >
                {isPlaying ? <MdPause size={20} /> : <MdPlayArrow size={20} />}
              </button>

              <button className="text-white/50 hover:text-white transition-colors">
                <MdSkipNext size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3 mt-4">
          <span className="text-[10px] text-white/40 font-medium tracking-wider w-6 text-right">
            {MOCK_TRACK.currentTime}
          </span>

          <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
            <div
              className="h-full bg-white/70 group-hover:bg-[#007bff] transition-colors relative"
              style={{ width: `${MOCK_TRACK.progress}%` }}
            >
              {/* Optional: Add a little glowing dot at the end of the progress bar */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 size-1.5 bg-white rounded-full shadow-[0_0_5px_white] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <span className="text-[10px] text-white/40 font-medium tracking-wider w-6 text-left">
            {MOCK_TRACK.totalTime}
          </span>
        </div>
      </div>
    </div>
  );
}
