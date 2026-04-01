const EMOTION_ORDER = [
  "pain",
  "tired",
  "cold",
  "hot",
  "dizzy",
  "anxious",
  "love",
  "angry"
];

const EMOTIONS = {
  pain: {
    name: "Pain",
    page: "pain.html",
    accent: "#FF4444",
    defaultValue: 50,
    summary: "Flat in default, then an ECG-like heartbeat appears and intensifies while dragging.",
    description:
      "The Pain slider represents the sensation of pain. On hover, the track transforms into a heartbeat monitor, a subtle signal that something is wrong. On active, as the user drags the thumb, the heartbeat intensifies and the track pulses deeper red, visualizing increasing pain.",
    whereToUse:
      "Useful in a symptom-check UI where users rate discomfort from mild to severe before booking care.",
    mockExample:
      "Telehealth intake card: \"How intense is your pain right now?\" The ECG feedback communicates urgency without extra text.",
    howItWorks:
      "A standard range input drives an SVG line. Hover morphs the line into a pulse waveform, and active drag increases waveform amplitude and red glow based on value."
  },
  tired: {
    name: "Tired",
    page: "tired.html",
    accent: "#FF8C00",
    defaultValue: 12,
    summary: "Transforms from quiet battery outline to an energizing fill of green recharge bars.",
    description:
      "The Tired slider represents the feeling of exhaustion. On hover, it transforms into an empty battery, signaling low energy. On active, the battery fills up with green bars, visualizing a recharge from empty to full.",
    whereToUse:
      "Great for wellness and habit trackers that ask users to log their current energy level.",
    mockExample:
      "Morning check-in flow: \"Energy meter\" starts empty and fills as the user drags toward a more recharged state.",
    howItWorks:
      "The range value maps to battery segments. Hover reveals the battery form, while active drag progressively lights green bars to indicate recharge."
  },
  cold: {
    name: "Cold",
    page: "cold.html",
    accent: "#4444FF",
    defaultValue: 40,
    summary: "A thermometer-inspired slider with blue fill that climbs as cold intensity rises.",
    description:
      "The Cold slider represents the sensation of freezing. On hover, it transforms into a thermometer with a neutral tone. On active, the thermometer turns blue, visualizing dropping temperature and intense cold.",
    whereToUse:
      "Ideal for climate-control interfaces or game HUDs where body temperature feedback matters.",
    mockExample:
      "Survival game status panel: \"Cold Exposure\" rises in blue while the player navigates snow areas.",
    howItWorks:
      "The hidden range input controls thermometer fill height and marker position. Hover adds neutral ticks; active state switches to electric blue and animates fill intensity."
  },
  hot: {
    name: "Hot",
    page: "hot.html",
    accent: "#FF4500",
    defaultValue: 56,
    summary: "A matchstick slider where flame and stem glow hotter as interaction intensifies.",
    description:
      "The Hot slider represents the sensation of burning heat. On hover, it transforms into a match with a flickering flame. On active, the match turns red and the flame intensifies, visualizing rising heat.",
    whereToUse:
      "Useful for spice/heat controls in food apps or thermal simulation controls in interactive stories.",
    mockExample:
      "Recipe app dial: \"Spice Heat\" uses the match animation to show mild-to-burning intensity in one gesture.",
    howItWorks:
      "A custom SVG match reacts to range movement. Hover activates flame flicker, and active drag scales flame shape, stem glow, and color saturation."
  },
  dizzy: {
    name: "Dizzy",
    page: "dizzy.html",
    accent: "#FFD700",
    defaultValue: 72,
    summary: "A spiral slider with orbital thumb motion and disorienting yellow distortion when active.",
    description:
      "The Dizzy slider represents the feeling of losing balance. On hover, it transforms into a spiral with the thumb orbiting around it. On active, the spiral distorts and turns yellow, visualizing complete disorientation.",
    whereToUse:
      "Fits motion-sickness trackers, XR comfort settings, or narrative moments that simulate disorientation.",
    mockExample:
      "VR comfort setup: \"Dizziness sensitivity\" lets users preview instability through controlled visual distortion.",
    howItWorks:
      "The range value maps to a point on a generated spiral path. Hover adds orbital drift; active adds waveform distortion, yellow glow, and jittered motion."
  },
  anxious: {
    name: "Anxious",
    page: "anxious.html",
    accent: "#8B5CF6",
    defaultValue: 52,
    summary: "A trembling violet line that turns into rapid erratic oscillation under active drag.",
    description:
      "The Anxious slider represents the feeling of anxiety. On hover, the track begins to tremble with small vibrations. On active, the vibrations become chaotic and erratic, visualizing a full panic state.",
    whereToUse:
      "Appropriate for emotional journaling tools where users log stress intensity quickly.",
    mockExample:
      "Mood diary modal: \"Anxiety level\" starts calm but shakes as users drag upward, making state change legible.",
    howItWorks:
      "An SVG path is procedurally jittered each frame. Hover uses low-amplitude noise; active increases amplitude and randomness, while the thumb remains value-controlled."
  },
  love: {
    name: "Love",
    page: "love.html",
    accent: "#FF69B4",
    defaultValue: 46,
    summary: "Soft pink pulse on hover that evolves into a heart-like waveform during active drag.",
    description:
      "The Love slider represents the feeling of being in love. On hover, the track transforms into a soft heartbeat wave. On active, the waveform intensifies and shapes into a heart, visualizing the overwhelming rush of love.",
    whereToUse:
      "Great for social apps, storytelling interfaces, or music experiences that capture affection intensity.",
    mockExample:
      "Playlist reaction module: \"How much do you love this track?\" turns the slider into a living heartbeat.",
    howItWorks:
      "The standard range input controls thumb position while a pink path morphs between line, gentle pulse, and heart-like peaks in active state."
  },
  angry: {
    name: "Angry",
    page: "angry.html",
    accent: "#CC0000",
    defaultValue: 30,
    summary: "A rage slider that morphs into a bomb and explodes into fragments at maximum value.",
    description:
      "The Angry slider represents the feeling of rage. On hover, it transforms into a bomb with a lit fuse. On active, the bomb grows and glows red. On explode, the bomb detonates into fragments, visualizing uncontrollable anger.",
    whereToUse:
      "Works in game UI or expressive storytelling moments where rage escalation should feel dramatic and physical.",
    mockExample:
      "Character state editor: \"Rage meter\" grows unstable as users drag, then detonates when maxed out.",
    howItWorks:
      "Default view remains a range line. Hover swaps to bomb geometry, active scales bomb glow with value, and a max-value threshold triggers a timed fragment explosion animation."
  }
};

const SVG_NS = "http://www.w3.org/2000/svg";
const sliders = [];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const n2 = (v) => Number(v.toFixed(2));

function createSvg(tag, attrs = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  return el;
}

function noise(seed) {
  const v = Math.sin(seed * 12.9898) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
}

function linePath(x1, y, x2) {
  return `M ${n2(x1)} ${n2(y)} L ${n2(x2)} ${n2(y)}`;
}

function ecgPath(x1, x2, yMid, amp, time, jitter = 1) {
  const step = 8;
  const spikeSpan = 5;
  let d = `M ${x1} ${yMid}`;
  let i = 0;
  for (let x = x1 + step; x <= x2; x += step) {
    const phase = i % spikeSpan;
    let y = yMid + Math.sin((x + time * 0.16) * 0.08) * amp * 0.18;
    if (phase === 1) y -= amp * 1.3;
    if (phase === 2) y += amp * 0.8;
    if (phase === 3) y -= amp * 0.45;
    y += noise(i + time * 0.004) * jitter;
    d += ` L ${n2(x)} ${n2(y)}`;
    i += 1;
  }
  return d;
}

function anxiousPath(x1, x2, yMid, amp, time, chaotic = false) {
  const points = 44;
  let d = `M ${x1} ${yMid}`;
  for (let i = 1; i <= points; i += 1) {
    const t = i / points;
    const x = lerp(x1, x2, t);
    const base = noise(i * 1.21 + time * (chaotic ? 0.021 : 0.012));
    const extra = chaotic ? noise(i * 2.7 + time * 0.039) * 0.9 : 0;
    const y = yMid + (base + extra) * amp;
    d += ` L ${n2(x)} ${n2(y)}`;
  }
  return d;
}

function softPulsePath(x1, x2, yMid, amp, time, active = false) {
  const points = 56;
  let d = `M ${x1} ${yMid}`;
  const period = active ? 34 : 70;
  for (let i = 1; i <= points; i += 1) {
    const t = i / points;
    const x = lerp(x1, x2, t);
    const local = ((x - x1) + time * (active ? 0.2 : 0.12)) % period;
    const phase = local / period;
    let y;

    if (active) {
      const wave = Math.sin(Math.PI * phase);
      const lobe = Math.sin(2 * Math.PI * phase);
      const heart = wave * Math.max(0, lobe);
      y = yMid - heart * amp * 1.4 + Math.sin((i + time * 0.02) * 0.8) * 1.1;
    } else {
      y = yMid + Math.sin((i + time * 0.014) * 0.6) * (amp * 0.55);
      if (i % 14 === 8) y -= amp * 1.2;
      if (i % 14 === 9) y += amp * 0.4;
    }

    d += ` L ${n2(x)} ${n2(y)}`;
  }
  return d;
}

function tiredTone(v) {
  if (v < 50) {
    const t = v / 50;
    const g = Math.round(68 + 136 * t);
    return `rgb(255, ${g}, 68)`;
  }
  if (v < 75) {
    return "#FFD43B";
  }
  const t = (v - 75) / 25;
  const r = Math.round(255 - 101 * t);
  const g = Math.round(212 - 37 * t);
  const b = Math.round(59 + 21 * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function coldTone(v) {
  const t = clamp(v / 100, 0, 1);
  const r = Math.round(82 - 82 * t);
  const g = Math.round(147 - 91 * t);
  const b = 255;
  return `rgb(${r}, ${g}, ${b})`;
}

function loveHeartWavePath(x1, x2, yMid, time, intensity = 1) {
  const points = 320;
  const hearts = [
    { c: 0.30, w: 0.118, cycles: 11, amp: 22 },
    { c: 0.80, w: 0.13, cycles: 12, amp: 26 }
  ];

  let d = "";

  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const x = lerp(x1, x2, t);
    let y = yMid + noise(t * 520 + time * 0.008) * (0.7 + intensity * 0.2);

    hearts.forEach((h) => {
      const u = (t - h.c) / h.w;
      if (Math.abs(u) > 1) return;

      const body = Math.pow(Math.max(0, 1 - Math.abs(u)), 0.58);
      const notch = 1 - 0.72 * Math.exp(-Math.pow(u / 0.2, 2));
      const topEnv = body * notch * 0.52;
      const bottomEnv = body * 1.58;

      const local = ((u + 1) / 2) * Math.PI * 2 * h.cycles + time * 0.016;
      const carrier = Math.sin(local);
      const env = carrier >= 0 ? topEnv : bottomEnv;
      const amp = h.amp * intensity;
      const bias = body * amp * 0.22;

      y += -carrier * amp * env + bias;
    });

    y = clamp(y, 10, 110);
    d += `${i === 0 ? "M" : "L"} ${n2(x)} ${n2(y)} `;
  }

  return d.trim();
}

function spiralPath(cx, cy, turns, radius, phase, distort, t) {
  const steps = 170;
  let d = "";
  for (let i = 0; i <= steps; i += 1) {
    const p = i / steps;
    const angle = phase + p * turns * Math.PI * 2;
    const r = 6 + p * radius + Math.sin(angle * 3 + t * 0.015) * distort;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    d += `${i === 0 ? "M" : "L"} ${n2(x)} ${n2(y)} `;
  }
  return d.trim();
}

function spiralPoint(cx, cy, turns, radius, phase, distort, t, p) {
  const angle = phase + p * turns * Math.PI * 2;
  const r = 6 + p * radius + Math.sin(angle * 3 + t * 0.015) * distort;
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r
  };
}

function flamePath(scale, wobble) {
  const cx = 160;
  const base = 42;
  const h = 24 * scale;
  const w = 9 * scale;
  return [
    `M ${n2(cx)} ${n2(base - h)}`,
    `C ${n2(cx - w * 0.3 + wobble)} ${n2(base - h * 0.45)}, ${n2(cx - w * 1.1)} ${n2(base - h * 0.05)}, ${n2(cx - w * 0.75)} ${n2(base + 4)}`,
    `C ${n2(cx - w * 0.25)} ${n2(base + 1)}, ${n2(cx - w * 0.28)} ${n2(base + 10)}, ${n2(cx)} ${n2(base + 14)}`,
    `C ${n2(cx + w * 0.2)} ${n2(base + 9)}, ${n2(cx + w * 0.72)} ${n2(base + 2)}, ${n2(cx + w * 0.78)} ${n2(base - 6)}`,
    `C ${n2(cx + w * 1.05)} ${n2(base - h * 0.2)}, ${n2(cx + w * 0.35 - wobble)} ${n2(base - h * 0.55)}, ${n2(cx)} ${n2(base - h)}`,
    "Z"
  ].join(" ");
}

class EmotionSlider {
  constructor(el) {
    this.el = el;
    this.key = el.dataset.emotion;
    this.config = EMOTIONS[this.key];

    if (!this.config) return;

    this.value = clamp(Number(el.dataset.value ?? this.config.defaultValue ?? 50), 0, 100);
    this.previewState = el.dataset.previewState || "";
    this.link = el.dataset.link || "";
    this.hovered = false;
    this.active = false;
    this.exploded = this.previewState === "explode";
    this.explosionStart = 0;
    this.pointerMoved = false;
    this.pointerStartValue = this.value;
    this.dragPointerId = null;

    this.el.style.setProperty("--accent", this.config.accent);

    this.stage = document.createElement("div");
    this.stage.className = "slider-stage";

    this.svg = createSvg("svg", {
      viewBox: "0 0 320 120",
      class: "slider-svg",
      "aria-hidden": "true"
    });

    this.input = document.createElement("input");
    this.input.type = "range";
    this.input.className = "slider-input";
    this.input.min = "0";
    this.input.max = "100";
    this.input.step = "1";
    this.input.value = String(this.value);
    this.input.setAttribute("aria-label", this.config.name + " slider");

    this.valueBadge = document.createElement("div");
    this.valueBadge.className = "slider-value-badge";
    this.valueBadge.textContent = Math.round(this.value) + "%";

    if (this.previewState) {
      this.el.classList.add("is-preview");
      this.input.disabled = true;
    }

    this.stage.append(this.svg, this.input, this.valueBadge);
    this.el.append(this.stage);

    this.renderer = this.createRenderer();
    this.bindEvents();
    sliders.push(this);
  }

  bindEvents() {
    if (this.previewState) return;

    this.el.addEventListener("mouseenter", () => {
      this.hovered = true;
    });

    this.el.addEventListener("mouseleave", () => {
      this.hovered = false;
      this.active = false;
      this.setBadgeVisible(false);
    });

    this.input.addEventListener("pointerdown", () => {
      this.active = true;
      this.hovered = true;
      this.pointerMoved = false;
      this.pointerStartValue = this.value;
      this.setBadgeVisible(true);
    });

    this.stage.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      this.active = true;
      this.hovered = true;
      this.pointerMoved = false;
      this.pointerStartValue = this.value;
      this.dragPointerId = event.pointerId;
      this.stage.setPointerCapture(event.pointerId);
      this.setValueFromPointerEvent(event);
      this.setBadgeVisible(true);
      event.preventDefault();
    });

    this.stage.addEventListener("pointermove", (event) => {
      if (this.dragPointerId !== event.pointerId) return;
      this.setValueFromPointerEvent(event);
      this.setBadgeVisible(true);
      event.preventDefault();
    });

    this.stage.addEventListener("pointerup", (event) => {
      if (this.dragPointerId !== event.pointerId) return;
      this.dragPointerId = null;
      this.active = false;
      this.setBadgeVisible(false);
      if (!this.pointerMoved && this.link) {
        window.location.href = this.link;
      }
      event.preventDefault();
    });

    this.stage.addEventListener("pointercancel", (event) => {
      if (this.dragPointerId !== event.pointerId) return;
      this.dragPointerId = null;
      this.active = false;
      this.setBadgeVisible(false);
    });

    window.addEventListener("pointerup", () => {
      this.active = false;
      this.dragPointerId = null;
      this.setBadgeVisible(false);
    });

    this.input.addEventListener("focus", () => {
      this.hovered = true;
    });

    this.input.addEventListener("blur", () => {
      this.active = false;
      this.setBadgeVisible(false);
    });

    this.input.addEventListener("input", (event) => {
      this.value = clamp(Number(event.target.value), 0, 100);
      this.updateBadgeText();
      if (this.active || this.dragPointerId !== null) {
        this.setBadgeVisible(true);
      }
      if (Math.abs(this.value - this.pointerStartValue) > 1) {
        this.pointerMoved = true;
      }
      if (this.key === "angry" && this.value >= 100 && !this.exploded) {
        this.triggerExplosion(performance.now());
      }
    });
  }

  toSvgPoint(event) {
    const rect = this.stage.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 320;
    const y = ((event.clientY - rect.top) / rect.height) * 120;
    return { x, y };
  }

  pointToValue(x, y) {
    if (this.key === "cold") {
      return clamp(((92 - y) / 72) * 100, 0, 100);
    }
    if (this.key === "hot") {
      return clamp(((98 - y) / 74) * 100, 0, 100);
    }
    if (this.key === "tired") {
      return clamp(((x - 108) / 96) * 100, 0, 100);
    }
    if (this.key === "dizzy") {
      const cx = 145;
      const cy = 62;
      const dist = Math.hypot(x - cx, y - cy);
      const p = clamp((dist - 6) / 46, 0.12, 0.96);
      return clamp(((p - 0.12) / 0.84) * 100, 0, 100);
    }
    if (this.key === "angry") {
      const cx = 160;
      const cy = 66;
      let deg = (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
      if (deg < -70) deg += 360;
      deg = clamp(deg, -70, 270);
      return clamp(((deg + 70) / 3.4), 0, 100);
    }
    return clamp(((x - 24) / 272) * 100, 0, 100);
  }

  setValueFromPointerEvent(event) {
    const { x, y } = this.toSvgPoint(event);
    const nextValue = this.pointToValue(x, y);
    if (Math.abs(nextValue - this.value) > 0.2) {
      this.value = nextValue;
      this.input.value = String(Math.round(nextValue));
      this.updateBadgeText();
      this.updateBadgePosition();
      if (Math.abs(this.value - this.pointerStartValue) > 1) {
        this.pointerMoved = true;
      }
      if (this.key === "angry" && this.value >= 99.8 && !this.exploded) {
        this.triggerExplosion(performance.now());
      }
    }
  }


  updateBadgeText() {
    if (!this.valueBadge) return;
    this.valueBadge.textContent = Math.round(this.value) + "%";
  }

  getThumbPoint(ts = performance.now()) {
    const progress = this.value / 100;

    if (this.key === "tired") {
      return { x: lerp(108, 204, progress) + 3, y: 79 };
    }

    if (this.key === "cold") {
      return { x: 170, y: lerp(92, 20, progress) + 3 };
    }

    if (this.key === "hot") {
      return { x: 160, y: lerp(98, 24, progress) };
    }

    if (this.key === "dizzy") {
      const active = this.active;
      const hover = this.hovered || this.active;
      const phase = hover || active ? ts * 0.0012 : 0;
      const distort = active ? 4 + Math.abs(Math.sin(ts * 0.013)) * 3.8 : hover ? 0.8 : 0;
      const point = spiralPoint(145, 62, active ? 3.15 : 2.82, 46, phase, distort, ts, clamp(0.12 + progress * 0.84, 0.1, 0.98));
      return { x: point.x, y: point.y };
    }

    if (this.key === "angry") {
      const cx = 160;
      const cy = 66;
      const angle = (-70 + this.value * 3.4) * (Math.PI / 180);
      return {
        x: cx + Math.cos(angle) * 34,
        y: cy + Math.sin(angle) * 34
      };
    }

    const y = this.key === "love" && this.active ? 54 : 60;
    return { x: lerp(24, 296, progress), y };
  }

  updateBadgePosition(ts = performance.now()) {
    if (!this.valueBadge) return;
    const point = this.getThumbPoint(ts);
    const left = clamp((point.x / 320) * 100, 0, 100);
    const top = clamp((point.y / 120) * 100, 0, 100);
    this.valueBadge.style.left = left + "%";
    this.valueBadge.style.top = top + "%";
  }

  setBadgeVisible(visible) {
    if (!this.valueBadge) return;
    this.updateBadgeText();
    this.updateBadgePosition();
    this.valueBadge.classList.toggle("is-visible", Boolean(visible));
  }

  isHoverState() {
    if (!this.previewState) return this.hovered;
    return ["hover", "active", "explode"].includes(this.previewState);
  }

  isActiveState() {
    if (!this.previewState) return this.active;
    return ["active", "explode"].includes(this.previewState);
  }

  triggerExplosion(ts) {
    this.exploded = true;
    this.explosionStart = ts;
  }

  update(ts) {
    if (!this.renderer) return;

    if (this.exploded && this.previewState !== "explode") {
      const elapsed = ts - this.explosionStart;
      if (elapsed > 1000) {
        this.exploded = false;
        this.value = 0;
        this.input.value = "0";
      }
    }

    this.renderer(ts, {
      hover: this.isHoverState(),
      active: this.isActiveState(),
      exploded: this.exploded
    });

    if (this.valueBadge && this.valueBadge.classList.contains("is-visible")) {
      this.updateBadgePosition(ts);
    }
  }

  createRenderer() {
    switch (this.key) {
      case "pain":
        return createPainRenderer(this);
      case "tired":
        return createTiredRenderer(this);
      case "cold":
        return createColdRenderer(this);
      case "hot":
        return createHotRenderer(this);
      case "dizzy":
        return createDizzyRenderer(this);
      case "anxious":
        return createAnxiousRenderer(this);
      case "love":
        return createLoveRenderer(this);
      case "angry":
        return createAngryRenderer(this);
      default:
        return null;
    }
  }
}

function createPainRenderer(slider) {
  const glow = createSvg("path", {
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 6,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    opacity: 0.08
  });
  const track = createSvg("path", {
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  });
  const thumb = createSvg("circle", { cx: 160, cy: 60, r: 7, fill: "#ffffff" });
  slider.svg.append(glow, track, thumb);

  return (ts, state) => {
    const x1 = 24;
    const x2 = 296;
    const mid = 60;
    const amp = state.active ? 18 + slider.value * 0.035 : state.hover ? 10 : 0;
    const path = amp > 0 ? ecgPath(x1, x2, mid, amp, ts, state.active ? 2.2 : 1.2) : linePath(x1, mid, x2);
    const baseColor = state.active ? "#ff1d1d" : state.hover ? slider.config.accent : "#f4f4f4";
    const glowOpacity = state.active
      ? 0.28 + Math.abs(Math.sin(ts * 0.013)) * 0.32
      : state.hover
      ? 0.2
      : 0.05;

    track.setAttribute("d", path);
    glow.setAttribute("d", path);
    track.setAttribute("stroke", baseColor);
    glow.setAttribute("stroke", baseColor);
    glow.setAttribute("opacity", String(glowOpacity));

    const thumbX = lerp(x1, x2, slider.value / 100);
    thumb.setAttribute("cx", String(n2(thumbX)));
    thumb.setAttribute("cy", String(mid));
    thumb.setAttribute("r", state.active ? "7.8" : "7");
  };
}

function createTiredRenderer(slider) {
  const body = createSvg("rect", {
    x: 108,
    y: 45,
    width: 90,
    height: 30,
    rx: 2,
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 2
  });

  const tip = createSvg("rect", {
    x: 198,
    y: 53,
    width: 8,
    height: 14,
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 2
  });

  const bars = [];
  for (let i = 0; i < 5; i += 1) {
    const bar = createSvg("rect", {
      x: 113 + i * 16,
      y: 50,
      width: 12,
      height: 20,
      rx: 1,
      fill: "#f4f4f4",
      opacity: 0
    });
    bars.push(bar);
    slider.svg.append(bar);
  }

  const thumb = createSvg("rect", {
    x: 108,
    y: 76,
    width: 6,
    height: 6,
    fill: "#ffffff"
  });

  slider.svg.append(body, tip, thumb);

  return (_ts, state) => {
    const isColored = state.hover || state.active;
    const outlineColor = isColored ? tiredTone(slider.value) : "#f4f4f4";
    body.setAttribute("stroke", outlineColor);
    tip.setAttribute("stroke", outlineColor);

    const lit = state.active ? Math.max(1, Math.ceil((slider.value / 100) * 5)) : 0;
    bars.forEach((bar, idx) => {
      bar.setAttribute("fill", outlineColor);
      bar.setAttribute("opacity", idx < lit ? "0.95" : "0");
    });

    const thumbX = lerp(108, 204, slider.value / 100);
    thumb.setAttribute("x", String(n2(thumbX)));
  };
}

function createColdRenderer(slider) {
  const tubeLine = createSvg("line", {
    x1: 160,
    y1: 20,
    x2: 160,
    y2: 74,
    stroke: "#f4f4f4",
    "stroke-width": 8,
    "stroke-linecap": "round"
  });

  const levelLine = createSvg("line", {
    x1: 160,
    y1: 74,
    x2: 160,
    y2: 74,
    stroke: "#f4f4f4",
    "stroke-width": 5,
    "stroke-linecap": "round",
    opacity: 0
  });

  const bulb = createSvg("circle", {
    cx: 160,
    cy: 92,
    r: 14,
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 2
  });

  const bulbGlow = createSvg("circle", {
    cx: 160,
    cy: 92,
    r: 14,
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 5,
    opacity: 0
  });

  const ticks = createSvg("g", {});
  for (let i = 0; i < 9; i += 1) {
    const y = 22 + i * 6.2;
    ticks.append(
      createSvg("line", {
        x1: 149.5,
        y1: y,
        x2: 154.5,
        y2: y,
        stroke: "#ffffff",
        "stroke-width": 1,
        opacity: 0.4
      })
    );
  }

  const thumb = createSvg("rect", {
    x: 167,
    y: 86,
    width: 6,
    height: 6,
    fill: "#ffffff"
  });

  slider.svg.append(bulbGlow, levelLine, tubeLine, ticks, bulb, thumb);

  return (_ts, state) => {
    const hover = state.hover || state.active;
    const coldColor = coldTone(slider.value);
    const color = hover ? coldColor : "#f4f4f4";

    tubeLine.setAttribute("stroke", color);
    bulb.setAttribute("stroke", color);
    levelLine.setAttribute("stroke", hover ? coldColor : "#f4f4f4");
    bulbGlow.setAttribute("stroke", coldColor);

    [...ticks.children].forEach((tick) => {
      tick.setAttribute("stroke", hover ? coldColor : "#ffffff");
      tick.setAttribute("opacity", hover ? "0.95" : "0.4");
    });

    const progress = slider.value / 100;
    const topY = 20;
    const bottomY = 74;
    const levelY = lerp(bottomY, topY, progress);
    levelLine.setAttribute("y1", String(n2(bottomY)));
    levelLine.setAttribute("y2", String(n2(levelY)));
    levelLine.setAttribute("opacity", hover ? "1" : "0");

    const glowOpacity = state.active ? 0.34 + progress * 0.4 : hover ? 0.14 + progress * 0.18 : 0;
    bulbGlow.setAttribute("opacity", String(glowOpacity));

    const thumbY = lerp(92, 20, slider.value / 100);
    thumb.setAttribute("y", String(n2(thumbY)));
  };
}

function createHotRenderer(slider) {
  const stem = createSvg("line", {
    x1: 160,
    y1: 24,
    x2: 160,
    y2: 98,
    stroke: "#f4f4f4",
    "stroke-width": 3,
    "stroke-linecap": "round"
  });

  const flame = createSvg("path", {
    d: flamePath(1, 0),
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 1.6,
    "stroke-linejoin": "round"
  });

  const glow = createSvg("path", {
    d: flamePath(1.07, 0),
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 6,
    opacity: 0
  });

  const stemGlow = createSvg("line", {
    x1: 160,
    y1: 24,
    x2: 160,
    y2: 98,
    stroke: "#f4f4f4",
    "stroke-width": 8,
    "stroke-linecap": "round",
    opacity: 0
  });

  const thumb = createSvg("polygon", {
    points: "160,84 165,89 160,94 155,89",
    fill: "#ffffff"
  });

  slider.svg.append(glow, stemGlow, flame, stem, thumb);

  return (ts, state) => {
    const active = state.active;
    const hover = state.hover;
    const color = active ? "#ff1900" : hover ? "#ff7a4a" : "#f4f4f4";
    const flameScale = active ? 1.08 + slider.value * 0.0038 : hover ? 1.02 : 1;
    const wobble = Math.sin(ts * (active ? 0.04 : 0.02)) * (active ? 1.6 : 0.8);

    flame.setAttribute("d", flamePath(flameScale, wobble));
    glow.setAttribute("d", flamePath(flameScale + 0.06, wobble * 0.45));

    flame.setAttribute("stroke", color);
    stem.setAttribute("stroke", color);
    glow.setAttribute("stroke", color);
    glow.setAttribute("opacity", active ? String(0.22 + Math.abs(Math.sin(ts * 0.013)) * 0.45) : hover ? "0.28" : "0.12");

    stemGlow.setAttribute("stroke", color);
    stemGlow.setAttribute("opacity", active ? String(0.18 + slider.value / 320) : hover ? "0.08" : "0");

    const y = lerp(98, 24, slider.value / 100);
    const points = `${n2(160)},${n2(y - 5)} ${n2(165)},${n2(y)} ${n2(160)},${n2(y + 5)} ${n2(155)},${n2(y)}`;
    thumb.setAttribute("points", points);
    thumb.setAttribute("fill", active ? "#ffffff" : "#f4f4f4");
  };
}

function createDizzyRenderer(slider) {
  const glow = createSvg("path", {
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 4,
    opacity: 0
  });

  const track = createSvg("path", {
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 1.7,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  });

  const thumb = createSvg("circle", {
    cx: 210,
    cy: 64,
    r: 4.6,
    fill: "#ffffff"
  });

  slider.svg.append(glow, track, thumb);

  return (ts, state) => {
    const active = state.active;
    const hover = state.hover;
    const phase = hover || active ? ts * 0.0012 : 0;
    const distort = active ? 4 + Math.abs(Math.sin(ts * 0.013)) * 3.8 : hover ? 0.8 : 0;
    const d = spiralPath(145, 62, active ? 3.15 : 2.82, 46, phase, distort, ts);
    const color = active ? "#FFD700" : hover ? slider.config.accent : "#f4f4f4";

    track.setAttribute("d", d);
    glow.setAttribute("d", d);
    track.setAttribute("stroke", color);
    glow.setAttribute("stroke", color);
    glow.setAttribute("opacity", active ? "0.3" : hover ? "0.22" : "0");

    const point = spiralPoint(
      145,
      62,
      active ? 3.15 : 2.82,
      46,
      phase,
      distort,
      ts,
      clamp(0.12 + (slider.value / 100) * 0.84, 0.1, 0.98)
    );

    thumb.setAttribute("cx", String(n2(point.x)));
    thumb.setAttribute("cy", String(n2(point.y)));
    thumb.setAttribute("fill", active ? "#fff68b" : "#ffffff");
  };
}

function createAnxiousRenderer(slider) {
  const glow = createSvg("path", {
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 5,
    opacity: 0.08,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  });

  const track = createSvg("path", {
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  });

  const thumb = createSvg("circle", {
    cx: 160,
    cy: 60,
    r: 6,
    fill: "#ffffff"
  });

  slider.svg.append(glow, track, thumb);

  return (ts, state) => {
    const x1 = 24;
    const x2 = 296;
    const mid = 60;

    let d;
    if (!state.hover && !state.active) {
      d = linePath(x1, mid, x2);
    } else {
      const amp = state.active ? 22 : 8;
      d = anxiousPath(x1, x2, mid, amp, ts, state.active);
    }

    track.setAttribute("d", d);
    glow.setAttribute("d", d);
    const lineColor = state.hover || state.active ? slider.config.accent : "#f4f4f4";
    track.setAttribute("stroke", lineColor);
    glow.setAttribute("stroke", lineColor);
    glow.setAttribute("opacity", state.active ? "0.35" : state.hover ? "0.2" : "0.06");

    const x = lerp(x1, x2, slider.value / 100);
    thumb.setAttribute("cx", String(n2(x)));
    thumb.setAttribute("cy", String(mid));
  };
}

function createLoveRenderer(slider) {
  const glow = createSvg("path", {
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 6,
    opacity: 0.08,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  });

  const track = createSvg("path", {
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  });

  const thumb = createSvg("circle", {
    cx: 160,
    cy: 60,
    r: 7,
    fill: "#ffffff"
  });

  slider.svg.append(glow, track, thumb);

  return (ts, state) => {
    const x1 = 24;
    const x2 = 296;
    const mid = state.active ? 54 : 60;

    let path;
    if (!state.hover && !state.active) {
      path = linePath(x1, mid, x2);
    } else if (state.active) {
      path = loveHeartWavePath(x1, x2, mid, ts, 1 + slider.value / 130);
    } else {
      path = loveHeartWavePath(x1, x2, mid, ts, 0.82);
    }

    track.setAttribute("d", path);
    glow.setAttribute("d", path);
    const lineColor = state.active ? "#ff00d9" : state.hover ? slider.config.accent : "#f4f4f4";
    track.setAttribute("stroke", lineColor);
    glow.setAttribute("stroke", lineColor);
    glow.setAttribute("opacity", state.active ? "0.44" : state.hover ? "0.26" : "0.05");

    const x = lerp(x1, x2, slider.value / 100);
    thumb.setAttribute("cx", String(n2(x)));
    thumb.setAttribute("cy", String(mid));
    thumb.setAttribute("fill", state.active ? "#ffd6ea" : "#ffffff");
  };
}

function createAngryRenderer(slider) {
  const bombGroup = createSvg("g", {});

  const shellGlow = createSvg("circle", {
    cx: 160,
    cy: 66,
    r: 38,
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 12,
    opacity: 0
  });

  const shellFill = createSvg("circle", {
    cx: 160,
    cy: 66,
    r: 34,
    fill: "#c00000",
    opacity: 0
  });

  const shell = createSvg("circle", {
    cx: 160,
    cy: 66,
    r: 34,
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 2
  });

  const fuse = createSvg("line", {
    x1: 186,
    y1: 41,
    x2: 202,
    y2: 25,
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 2,
    "stroke-linecap": "round"
  });

  const fuseRing = createSvg("circle", {
    cx: 206,
    cy: 21,
    r: 5,
    fill: "none",
    stroke: "#f4f4f4",
    "stroke-width": 2
  });

  const spark = createSvg("circle", {
    cx: 206,
    cy: 21,
    r: 2.3,
    fill: "#f4f4f4",
    opacity: 0
  });

  const rays = [];
  const raysGroup = createSvg("g", {});
  for (let i = 0; i < 10; i += 1) {
    const glow = createSvg("line", {
      x1: 160,
      y1: 20,
      x2: 160,
      y2: 6,
      stroke: "#f4f4f4",
      "stroke-width": 9,
      "stroke-linecap": "square",
      opacity: 0
    });
    const ray = createSvg("line", {
      x1: 160,
      y1: 20,
      x2: 160,
      y2: 6,
      stroke: "#f4f4f4",
      "stroke-width": 4,
      "stroke-linecap": "square",
      opacity: 0
    });
    rays.push({ glow, ray, angle: (i / 10) * Math.PI * 2 });
    raysGroup.append(glow, ray);
  }

  const fragmentsGroup = createSvg("g", {});
  const fragments = [];
  for (let i = 0; i < 14; i += 1) {
    const piece = createSvg("rect", {
      x: 157,
      y: 63,
      width: i % 2 === 0 ? 7 : 4,
      height: i % 3 === 0 ? 7 : 4,
      fill: i % 3 === 0 ? "none" : "#ff2d2d",
      stroke: "#ff2d2d",
      "stroke-width": i % 3 === 0 ? 1.5 : 0,
      opacity: 0
    });
    fragments.push({
      el: piece,
      vx: Math.cos((i / 14) * Math.PI * 2) * (1.3 + (i % 3) * 0.38),
      vy: Math.sin((i / 14) * Math.PI * 2) * (1.3 + ((i + 1) % 3) * 0.3),
      rot: (i % 2 === 0 ? 1 : -1) * (1.1 + i * 0.04)
    });
    fragmentsGroup.append(piece);
  }

  const thumb = createSvg("circle", {
    cx: 194,
    cy: 66,
    r: 8,
    fill: "#ffffff"
  });

  bombGroup.append(raysGroup, shellGlow, shellFill, shell, fuse, fuseRing, spark);
  slider.svg.append(bombGroup, fragmentsGroup, thumb);

  return (ts, state) => {
    const active = state.active;
    const hover = state.hover;
    const cx = 160;
    const cy = 66;
    const radius = 34;
    const angle = (-70 + slider.value * 3.4) * (Math.PI / 180);
    const thumbX = cx + Math.cos(angle) * radius;
    const thumbY = cy + Math.sin(angle) * radius;
    thumb.setAttribute("cx", String(n2(thumbX)));
    thumb.setAttribute("cy", String(n2(thumbY)));

    if (state.exploded) {
      const elapsed = slider.previewState === "explode" ? 0.45 : clamp((ts - slider.explosionStart) / 860, 0, 1);

      shell.setAttribute("opacity", "0");
      shellFill.setAttribute("opacity", "0");
      shellGlow.setAttribute("opacity", "0");
      fuse.setAttribute("opacity", "0");
      fuseRing.setAttribute("opacity", "0");
      spark.setAttribute("opacity", "0");
      thumb.setAttribute("opacity", "0");

      rays.forEach((item, idx) => {
        const rStart = 44;
        const rEnd = 60 + (idx % 3) * 4;
        const ang = item.angle;
        const x1 = cx + Math.cos(ang) * rStart;
        const y1 = cy + Math.sin(ang) * rStart;
        const x2 = cx + Math.cos(ang) * rEnd;
        const y2 = cy + Math.sin(ang) * rEnd;
        item.glow.setAttribute("x1", String(n2(x1)));
        item.glow.setAttribute("y1", String(n2(y1)));
        item.glow.setAttribute("x2", String(n2(x2)));
        item.glow.setAttribute("y2", String(n2(y2)));
        item.glow.setAttribute("opacity", "0.3");
        item.ray.setAttribute("x1", String(n2(x1)));
        item.ray.setAttribute("y1", String(n2(y1)));
        item.ray.setAttribute("x2", String(n2(x2)));
        item.ray.setAttribute("y2", String(n2(y2)));
        item.ray.setAttribute("stroke", "#090909");
        item.ray.setAttribute("opacity", "1");
      });

      fragments.forEach((piece) => {
        const distance = 108 * elapsed;
        const x = cx + piece.vx * distance;
        const y = cy + piece.vy * distance;
        const rot = piece.rot * 260 * elapsed;
        piece.el.setAttribute(
          "transform",
          `translate(${n2(x)} ${n2(y)}) rotate(${n2(rot)}) translate(-3 -3)`
        );
        piece.el.setAttribute("opacity", String(1 - elapsed));
      });
      return;
    }

    fragments.forEach((piece) => piece.el.setAttribute("opacity", "0"));
    thumb.setAttribute("opacity", "1");
    shell.setAttribute("opacity", "1");
    fuse.setAttribute("opacity", "1");
    fuseRing.setAttribute("opacity", "1");

    const fillOpacity = active ? 0.25 + (slider.value / 100) * 0.72 : hover ? 0.08 : 0;
    const shellOpacity = active ? 0.3 + (slider.value / 100) * 0.5 : hover ? 0.14 : 0;
    shellFill.setAttribute("opacity", String(fillOpacity));
    shellGlow.setAttribute("opacity", String(shellOpacity));

    const pulse = active ? 1 + slider.value * 0.0026 + Math.sin(ts * 0.02) * 0.02 : 1;
    bombGroup.setAttribute(
      "transform",
      `translate(${cx} ${cy}) scale(${n2(pulse)}) translate(${-cx} ${-cy})`
    );

    const shellColor = active ? "#ff0000" : hover ? "#b30000" : "#f4f4f4";
    shell.setAttribute("stroke", shellColor);
    shellGlow.setAttribute("stroke", shellColor);
    fuse.setAttribute("stroke", shellColor);
    fuseRing.setAttribute("stroke", shellColor);

    const flicker = 2.2 + Math.abs(Math.sin(ts * 0.035)) * (active ? 2.8 : hover ? 1.5 : 0.4);
    spark.setAttribute("r", String(n2(flicker)));
    spark.setAttribute("fill", active ? "#ffd76e" : "#ffb400");
    spark.setAttribute("opacity", hover || active ? "1" : "0");

    if (active) {
      rays.forEach((item, idx) => {
        const rStart = 44;
        const amp = 10 + slider.value * 0.08 + Math.sin(ts * 0.017 + idx) * 2.5;
        const rEnd = rStart + amp;
        const x1 = cx + Math.cos(item.angle) * rStart;
        const y1 = cy + Math.sin(item.angle) * rStart;
        const x2 = cx + Math.cos(item.angle) * rEnd;
        const y2 = cy + Math.sin(item.angle) * rEnd;
        item.glow.setAttribute("x1", String(n2(x1)));
        item.glow.setAttribute("y1", String(n2(y1)));
        item.glow.setAttribute("x2", String(n2(x2)));
        item.glow.setAttribute("y2", String(n2(y2)));
        item.glow.setAttribute("opacity", "0.32");
        item.ray.setAttribute("x1", String(n2(x1)));
        item.ray.setAttribute("y1", String(n2(y1)));
        item.ray.setAttribute("x2", String(n2(x2)));
        item.ray.setAttribute("y2", String(n2(y2)));
        item.ray.setAttribute("stroke", "#d10000");
        item.ray.setAttribute("opacity", "1");
      });
      fuse.setAttribute("opacity", "0");
      fuseRing.setAttribute("opacity", "0");
      spark.setAttribute("opacity", "0");
    } else {
      rays.forEach((item) => {
        item.glow.setAttribute("opacity", "0");
        item.ray.setAttribute("opacity", "0");
      });
    }
  };
}

function renderIndexGrid() {
  const grid = document.getElementById("component-grid");
  if (!grid) return;

  grid.innerHTML = EMOTION_ORDER.map((key, idx) => {
    const item = EMOTIONS[key];
    const no = String(idx + 1).padStart(2, "0");
    return `
      <article class="component-card" data-href="${item.page}" style="--accent:${item.accent};">
        <div class="card-top card-meta">
          <p class="component-num">${no} / 08</p>
          <a class="card-link" href="${item.page}">Open Docs →</a>
        </div>
        <h3>${item.name}</h3>
        <p>${item.summary}</p>
        <div class="emotion-slider" data-emotion="${key}" data-value="${item.defaultValue}" data-link="${item.page}"></div>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".component-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a") || event.target.closest(".emotion-slider")) return;
      const href = card.getAttribute("data-href");
      if (href) window.location.href = href;
    });
  });
}

function renderDetailPage() {
  const key = document.body.dataset.detailEmotion;
  if (!key) return;

  const emotion = EMOTIONS[key];
  if (!emotion) return;
  const orderIndex = EMOTION_ORDER.indexOf(key);
  const orderText = `${String(orderIndex + 1).padStart(2, "0")} / ${String(EMOTION_ORDER.length).padStart(2, "0")}`;

  document.documentElement.style.setProperty("--detail-accent", emotion.accent);
  document.title = `${emotion.name} | Sliders That Feel`;

  const title = document.getElementById("detail-title");
  const order = document.getElementById("detail-index");
  const bgText = document.getElementById("detail-bg-text");
  const description = document.getElementById("detail-description");
  const whereToUse = document.getElementById("where-to-use");
  const mockExample = document.getElementById("mock-example");
  const howItWorks = document.getElementById("how-it-works");

  if (title) title.textContent = emotion.name;
  if (order) order.textContent = orderText;
  if (bgText) bgText.textContent = emotion.name.toUpperCase();
  if (description) description.textContent = emotion.description;
  if (whereToUse) whereToUse.textContent = emotion.whereToUse;
  if (mockExample) mockExample.textContent = emotion.mockExample;
  if (howItWorks) howItWorks.textContent = emotion.howItWorks;

  const mainDemo = document.getElementById("detail-main-slider");
  if (mainDemo) {
    mainDemo.dataset.emotion = key;
    mainDemo.dataset.value = String(emotion.defaultValue);
  }

  const stateGrid = document.getElementById("state-grid");
  if (stateGrid) {
    const states = [
      { id: "default", label: "Default", value: emotion.defaultValue },
      { id: "hover", label: "Hover", value: emotion.defaultValue },
      { id: "active", label: "Active", value: 84 }
    ];

    if (key === "angry") {
      states.push({ id: "explode", label: "Explode", value: 100 });
    }

    stateGrid.innerHTML = states
      .map(
        (state) => `
        <article class="state-card">
          <h3>${state.label}</h3>
          <div class="emotion-slider" data-emotion="${key}" data-value="${state.value}" data-preview-state="${state.id}"></div>
        </article>
      `
      )
      .join("");
  }
}

function initSliders() {
  document.querySelectorAll(".emotion-slider").forEach((el) => {
    if (!el.dataset.emotion) return;
    if (el.dataset.initialized === "true") return;
    el.dataset.initialized = "true";
    new EmotionSlider(el);
  });
}

function tick(ts) {
  sliders.forEach((slider) => slider.update(ts));
  window.requestAnimationFrame(tick);
}

document.addEventListener("DOMContentLoaded", () => {
  renderIndexGrid();
  renderDetailPage();
  initSliders();
  window.requestAnimationFrame(tick);
});
