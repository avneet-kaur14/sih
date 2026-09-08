import React, { useState } from 'react';
import { Mic, Volume2, Sparkles, ArrowRight } from 'lucide-react';

export const VoicePage: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);

  const sampleCommands = [
    '“What is my next service booking?”',
    '“Call customer Rahul Sharma”',
    '“Navigate to Model Town, Jalandhar”',
    '“Mark current task as completed”',
    '“How much did I earn today?”',
  ];

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      setTranscript('Listening to your voice command in Hindi or English...');
      setTimeout(() => {
        setTranscript('“Show me my next scheduled job in Model Town”');
        setIsListening(false);
      }, 2500);
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light text-brand-primary text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Voice Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-dark">
          Voice Assistance
        </h1>
        <p className="text-sm text-neutral-muted mt-1 max-w-md mx-auto">
          Speak in Hindi, English, or regional languages to manage your daily tasks hands-free.
        </p>
      </div>

      {/* Mic Action Card */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-xs flex flex-col items-center justify-center text-center space-y-6">
        <div className="relative">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-brand-primary/20 animate-ping" />
          )}
          <button
            onClick={toggleListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white shadow-red-500/30 scale-110'
                : 'bg-brand-primary hover:bg-brand-hover text-white shadow-brand-primary/30 hover:scale-105 active:scale-95'
            }`}
          >
            <Mic className={`w-10 h-10 ${isListening ? 'animate-pulse' : ''}`} />
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-base font-bold text-neutral-dark">
            {isListening ? 'Listening...' : 'Tap microphone to speak'}
          </p>
          <p className="text-xs text-neutral-muted">
            {transcript || 'Supports Hindi (हिंदी), Punjabi, Hinglish & English'}
          </p>
        </div>

        {transcript && (
          <div className="w-full bg-neutral-50 rounded-2xl p-4 text-sm text-neutral-800 border border-neutral-100 font-medium">
            <span className="text-xs text-brand-primary uppercase font-bold block mb-1">
              Detected Command:
            </span>
            {transcript}
          </div>
        )}
      </div>

      {/* Suggested Quick Commands */}
      <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-100 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-dark">
          <Volume2 className="w-4 h-4 text-brand-primary" />
          <span>Try saying commands like:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {sampleCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => setTranscript(cmd)}
              className="text-left p-3 rounded-xl bg-white hover:bg-neutral-100/80 border border-neutral-200/70 text-xs font-medium text-neutral-700 transition flex items-center justify-between group cursor-pointer"
            >
              <span>{cmd}</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

