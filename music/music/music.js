const NUM_NOTES_IN_OCTAVE = 12;
const ROW_HEIGHT = 20;

const WHITE_COLOR = "#FFFFFF";
const BLUE_COLOR = "#054AD3";
const GREEN_COLOR = "#117A45";
const RED_COLOR = "#E5273A";
const PINK_COLOR = "#F5A1BE";
const BEIGE_COLOR = "#EEE9E5";
const YELLOW_COLOR = "#F7CD36";

const COLOR_MAPPINGS = [
  [BLUE_COLOR, PINK_COLOR], 
  [PINK_COLOR, RED_COLOR, YELLOW_COLOR], 
  [RED_COLOR, GREEN_COLOR], 
  [RED_COLOR, PINK_COLOR],
  [RED_COLOR, BLUE_COLOR],
  [RED_COLOR, YELLOW_COLOR], 
  [GREEN_COLOR, YELLOW_COLOR], 
  [BLUE_COLOR, RED_COLOR, WHITE_COLOR],
  [PINK_COLOR, YELLOW_COLOR, RED_COLOR],
];

class NoteDetails {
  constructor(note) {
    this.noteNumber = note.midi % NUM_NOTES_IN_OCTAVE;
    this.pitch = floor(note.midi / NUM_NOTES_IN_OCTAVE);
    this.duration = note.duration * 1000;
    this.note = note;
    this.timeLeft = this.duration;
  }
  
  playNote(deltaTime) {
    print(this.timeLeft + "= > =" + deltaTime);
    this.timeLeft -= deltaTime;
  }
  
  hasTimeLeft() {
    return this.timeLeft > 0;
  }
  
  resetTimeLeft() {
    this.timeLeft = this.duration;
  }
}

function preload() {
  // Load the JSON file and then call the loadData() function below
  loadJSON('./PreludeInCMinor.json', loadData);
}

let songNotes = [];
let currNoteIndex = 0;
let notesPlayed = [];

function loadData(songData) {
  if (!!songData.tracks) {
    for(let track of songData.tracks) {
      if (track.notes) {
        for(let note of track.notes) {
          let noteDetails = new NoteDetails(note);
          songNotes.push(noteDetails);
        }
      }
    }
  }
}

let previousNoteColor;
let currPosX = 0;
let currPosY = 0;

function setup() {
  createCanvas(500, 500);
  background(BEIGE_COLOR);
  noStroke();
  textSize(100);
  previousNoteColor = color(255);
}



function draw() {
  if (currNoteIndex >= songNotes.length) {
    return;
  }
  
  let currNoteDetails = songNotes[currNoteIndex];

  // If no time left, play next note.
  let isNewNote = false;
  // if (!currNoteDetails.hasTimeLeft()) {
    currNoteIndex++;
    if (currNoteIndex >= songNotes.length) {
      return;
    }
    currNoteDetails = songNotes[currNoteIndex];
    isNewNote = true;
  // }
  
  let noteColors = COLOR_MAPPINGS[currNoteDetails.noteNumber % COLOR_MAPPINGS.length].map(hex => color(hex));
  let durationSeconds = map(currNoteDetails.duration / 1000, 0, 3, 10, 100) * 2;

  
  push();
  fillGradient('linear', {
      from : [0, 0],
      to : [durationSeconds, 0],
      steps : noteColors,
  });
  translate(currPosX, currPosY);
  rectMode(CORNER);
  rect(0, 0, durationSeconds, ROW_HEIGHT);
  pop();
  
  if (isNewNote) {
    if ((currPosX + durationSeconds ) > width) {
      currPosX = 0;
      currPosY += ROW_HEIGHT;
    } else {
      currPosX += durationSeconds;
    }
  }
  currNoteDetails.playNote(deltaTime);
}
