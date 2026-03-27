// DOM Elements
const rootSelector = document.getElementById("root-selector");
const scaleTypeSelector = document.getElementById("scale-type-selector");
const scaleDisplay = document.getElementById("scale-display");
const keys = document.querySelectorAll(".key");
const volumeSlider = document.querySelector('input[type="range"]');

// Audio & Volume - Get the current value from the volume slider (0 to 1) and convert it from a string to a number
let volume = parseFloat(volumeSlider.value);

// Listen for changes on the volume slider and update the volume variable
volumeSlider.addEventListener('input', () => {
// Get the new slider value and convert it to a number
  volume = parseFloat(volumeSlider.value);
});

// Chromatic scale
const chromaticScale = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

// Scale patterns - each number represents the number of semitones (half-steps) to move from one note to the nex
const scalePatterns = {
  major: [2,2,1,2,2,2,1],
  minor: [2,1,2,2,1,2,2],
  pentatonic: [2,2,3,2,3],
  blues: [3,2,1,1,3,2],
  harmonicMinor: [2,1,2,2,1,3,1],
  dorian: [2,1,2,2,2,1,2],
  mixolydian: [2,2,1,2,2,1,2]
};

// Generate scale - creates a musical scale starting from the given root note 
function generateScale(root, pattern) {
  const scale = [];
  let startIndex = chromaticScale.indexOf(root); //finds where the root note is in the full list of notes (chromaticScale)
  if(startIndex === -1) return [];
  scale.push(chromaticScale[startIndex]);
  for(let step of pattern){ //// Go through each number in the pattern, move forward by that many semitones (wrapping around if needed), and add each resulting note to the scale
    startIndex = (startIndex + step) % chromaticScale.length;
    scale.push(chromaticScale[startIndex]);
  }
  return scale;
}

// Update displayed scale - when user chooses from the dropdown menu
function updateScale() {
  const root = rootSelector.value;
  const scaleType = scaleTypeSelector.value;
  const pattern = scalePatterns[scaleType];
  if(!pattern) return;
  const scaleNotes = generateScale(root, pattern);
  scaleDisplay.textContent = `Scale: ${scaleNotes.join(" - ")}`;
}

// Event listeners - listen for changes on the root note or scale type dropdowns
rootSelector.addEventListener("change", updateScale);
scaleTypeSelector.addEventListener("change", updateScale);

// Initial scale display
updateScale();

// Preload audio
const audioMap = {};
keys.forEach(key => {
  audioMap[key.dataset.key] = new Audio(`sounds/${key.dataset.key}.wav`);
});

// Play note
function playNote(noteKey) {
  if(!audioMap[noteKey]) return;
  const audio = audioMap[noteKey];
  audio.currentTime = 0; // Restart if already playing
  audio.volume = volume;
  audio.play();
}

// Key click
keys.forEach(key => {
  key.addEventListener("click", () => {
    const noteKey = key.dataset.key;
    playNote(noteKey);
    key.classList.add("active");
    setTimeout(()=> key.classList.remove("active"), 200);
  });
});

// Keyboard press
document.addEventListener("keydown", (event) => {
  if(event.repeat) return; // ignore held-down repeats
  const keyPressed = event.key.toLowerCase();
  const key = document.querySelector(`.key[data-key="${keyPressed}"]`);
  if(!key) return;
  playNote(keyPressed);
  key.classList.add("active");
  setTimeout(()=> key.classList.remove("active"), 200);
});
