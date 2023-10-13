let audioElement = document.querySelector("#audio");
let canvasElement = document.querySelector("#canvasElmId");
let wave = new Wave(audioElement, canvasElement);

// Simple example: add an animation
wave.addAnimation(new wave.animations.Wave({
  lineColor: "white",
  lineWidth: 10,
  fillColor: { gradient: ["#F1DEC9", "#C8B6A6"] },
  mirroredX: true,
  mirroredY: true,
  count: 20,
  rounded: true,
  frequencyBand: "base"
}));
wave.addAnimation(new wave.animations.Wave({
  lineColor: "#F5EBE0",
  lineWidth: 10,
  fillColor: { gradient: ["#DBA39A", "#D5B4B4"] },
  mirroredX: true,
  mirroredY: true,
  count: 50,
  rounded: true
}));
wave.addAnimation(new wave.animations.Wave({
  lineColor: "#F5EBE0",
  lineWidth: 10,
  fillColor: { gradient: ["#7B8FA1", "#96B6C5"] },
  mirroredX: true,
  mirroredY: true,
  count: 60,
  rounded: true,
  frequencyBand: "highs"
}));