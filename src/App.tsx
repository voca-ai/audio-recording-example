import React, { useState, useRef } from 'react';
import './App.css';
import { record, Recording } from './utils/audioRecording';
import EnforceAudioSupport from './EnforceAudioSupport';

function App() {
  const [loading, setLoading] = useState(false);
  const [activeRecording, setActiveRecording] = useState<Recording | null>(null);
  const [hasRecording, setHasRecording] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const actions = {
    startRecording: async () => {
      if (!loading) {
        setLoading(true);
        try {
          const recording = await record();
          setActiveRecording(recording);
          setHasRecording(true);
        } catch (e) {
          console.error(e);
          alert("Couldn't connect to microphone. Are you sure it is connected?");
        } finally {
          setLoading(false);
        }
      }
    },
    stopRecording: async () => {
      if (!loading && activeRecording) {
        setLoading(true);

        // Add small delay to ensure recording isn't truncated at the end
        await new Promise(resolve => setTimeout(resolve, 300));

        try {
          const wavBlob = await activeRecording.stop();

          const url = window.URL.createObjectURL(wavBlob);

          const audioElement = audioRef.current!;
          audioElement.src = url;

        } catch (e) {
          console.error(e);
          alert("Couldn't upload clip");
        } finally {
          setActiveRecording(null);
          setLoading(false);
        }
      }
    },
    playRecording: () => {
      audioRef.current?.play();
    },
  };
  return (
    <EnforceAudioSupport>
      <div className="App">
        {
          activeRecording ?
            <button disabled={loading} onClick={actions.stopRecording}>Stop recording</button> :
            <button disabled={loading} onClick={actions.startRecording}>Start recording</button>
        }
        <audio controls ref={audioRef} />
        <button disabled={!hasRecording} onClick={actions.playRecording}>Play</button>
      </div>
    </EnforceAudioSupport>
  );
}

export default App;
