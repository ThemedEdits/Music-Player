"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  MoreHorizontal,
  Shuffle,
  Repeat,
} from "lucide-react"

interface Track {
  id: number
  title: string
  artist: string
  album: string
  duration: number
  coverUrl: string
}

const sampleTracks: Track[] = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Nocturnal Vibes",
    duration: 245,
    coverUrl: "/h (1)",
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Coastal Sounds",
    album: "Nature's Symphony",
    duration: 198,
    coverUrl: "/h (2)",
  },
  {
    id: 3,
    title: "City Lights",
    artist: "Urban Pulse",
    album: "Metropolitan",
    duration: 267,
    coverUrl: "/h (3)",
  },
]

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(75)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState(0) // 0: off, 1: all, 2: one

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const currentTrack = sampleTracks[currentTrackIndex]

  // Simulate audio playback since we don't have actual audio files
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.duration) {
            handleNext()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, currentTrack.duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    if (currentTime > 3) {
      setCurrentTime(0)
    } else {
      setCurrentTrackIndex((prev) => (prev === 0 ? sampleTracks.length - 1 : prev - 1))
      setCurrentTime(0)
    }
  }

  const handleNext = () => {
    if (repeatMode === 2) {
      setCurrentTime(0)
      return
    }

    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * sampleTracks.length)
      setCurrentTrackIndex(randomIndex)
    } else {
      setCurrentTrackIndex((prev) => (prev === sampleTracks.length - 1 ? 0 : prev + 1))
    }
    setCurrentTime(0)
  }

  const handleProgressChange = (value: number[]) => {
    const newTime = Math.floor((value[0] / 100) * currentTrack.duration)
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3)
  }

  const progressPercentage = (currentTime / currentTrack.duration) * 100

  return (
    <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white border-0">
      <CardContent className="p-6">
        {/* Album Art */}
        <div className="relative mb-6">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 shadow-2xl">
            <img
              src={currentTrack.coverUrl || "/placeholder.svg"}
              alt={`${currentTrack.album} cover`}
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white"
            onClick={toggleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>

        {/* Track Info */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-1 truncate">{currentTrack.title}</h3>
          <p className="text-gray-300 text-sm truncate">{currentTrack.artist}</p>
          <p className="text-gray-400 text-xs truncate">{currentTrack.album}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[progressPercentage]}
            onValueChange={handleProgressChange}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white" onClick={toggleShuffle}>
            <Shuffle className={`h-4 w-4 ${isShuffled ? "text-green-400" : ""}`} />
          </Button>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handlePrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="bg-white text-black hover:bg-gray-200 w-12 h-12"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </Button>

          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleNext}>
            <SkipForward className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white" onClick={toggleRepeat}>
            <Repeat className={`h-4 w-4 ${repeatMode > 0 ? "text-green-400" : ""}`} />
            {repeatMode === 2 && <span className="absolute text-xs font-bold">1</span>}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-white flex-shrink-0"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>

          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="flex-1"
          />

          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white flex-shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Track List Indicator */}
        <div className="flex justify-center gap-1 mt-4">
          {sampleTracks.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentTrackIndex ? "bg-white" : "bg-gray-600"
              }`}
              onClick={() => {
                setCurrentTrackIndex(index)
                setCurrentTime(0)
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
