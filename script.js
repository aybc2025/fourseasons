// גלילת כפתור "בואו נתחיל"
document.getElementById("scrollToSeasons")?.addEventListener("click", () => {
  const el = document.getElementById("seasons");
  if (el) el.scrollIntoView({ behavior: "smooth" });
});

// נתוני טקסט לכל עונה להסבר
const seasonInfo = {
  spring: {
    title: "אביב — מה שומעים במוזיקה?",
    text: [
      "ב\"אביב\" של ויואלדי שומעים ציפורים שרות, נחלים זורמים וגשם עדין.",
      "לפעמים יש גם רעמים וברקים – אבל אחר כך הכול נרגע שוב.",
      "המוזיקה שמחה, קופצנית ומרגישה כמו פריחה אחרי חורף ארוך."
    ]
  },
  summer: {
    title: "קיץ — מה שומעים במוזיקה?",
    text: [
      "בקיץ יש חום כבד, והאנשים והחיות מתעייפים מהשמש החזקה.",
      "במוזיקה שומעים איך מתקרבת סערה גדולה עם רעמים וברקים.",
      "בסוף יש קטע מהיר מאוד שמספר על גשם חזק וברד שמכים בשדה."
    ]
  },
  autumn: {
    title: "סתיו — מה שומעים במוזיקה?",
    text: [
      "בסתיו ויואלדי כתב על חגיגת הקציר – אנשים שרים ורוקדים אחרי שהשדה התמלא.",
      "אחרי החגיגה כולם נרדמים – שומעים מוזיקה שקטה ונעימה.",
      "בסוף שומעים צייד: ריצה, כלבים, קרני צייד… עד שהכל נרגע."
    ]
  },
  winter: {
    title: "חורף — מה שומעים במוזיקה?",
    text: [
      "בחורף המוזיקה קרירה וחדה – כמו רוח חזקה ושלג שמקפיא.",
      "שומעים אנשים רצים על קרח ומחליקים, כמעט נופלים.",
      "באמצע יש קטע שקט וחמים ליד האש, ואז שוב חוזרים לקור והרוח."
    ]
  }
};

// השמעת עונה מסוימת
function playSeasonAudio(season) {
  const ids = {
    spring: "audio-spring",
    summer: "audio-summer",
    autumn: "audio-autumn",
    winter: "audio-winter"
  };

  // לעצור הכל
  Object.values(ids).forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  });

  const audio = document.getElementById(ids[season]);
  if (audio) {
    audio.play().catch(() => {
      // במכשירים ניידים צריך לעתים אינטראקציה לפני השמעה
      console.warn("לא ניתן לנגן אוטומטית – ייתכן שצריך לגעת במסך.");
    });
  }

  const details = seasonInfo[season];
  const container = document.getElementById("seasonDetails");
  if (details && container) {
    container.innerHTML = `
      <h3>${details.title}</h3>
      ${details.text.map((line) => `<p>${line}</p>`).join("")}
    `;
  }
}

// האזנה לכפתורי העונות
document.querySelectorAll(".play-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const season = e.currentTarget.getAttribute("data-season");
    if (season) {
      playSeasonAudio(season);
    }
  });
});

// משחק ניחושים
let currentRandomSeason = null;

const seasons = ["spring", "summer", "autumn", "winter"];

document.getElementById("playRandomClip")?.addEventListener("click", () => {
  const rnd = Math.floor(Math.random() * seasons.length);
  currentRandomSeason = seasons[rnd];
  playSeasonAudio(currentRandomSeason);
  const fb = document.getElementById("gameFeedback");
  if (fb) {
    fb.textContent = "הקטע מתנגן... נסו לנחש איזו עונה זו!";
    fb.style.color = "#e5e7eb";
  }
});

document.querySelectorAll(".guess-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const guess = e.currentTarget.getAttribute("data-guess");
    const fb = document.getElementById("gameFeedback");
    if (!fb) return;
    if (!currentRandomSeason) {
      fb.textContent = "קודם נלחץ על \"נגן קטע אקראי\" 🙂";
      fb.style.color = "#facc15";
      return;
    }
    if (guess === currentRandomSeason) {
      fb.textContent = "כל הכבוד! ניחוש מדויק 👏";
      fb.style.color = "#4ade80";
    } else {
      fb.textContent = "לא נורא, נסו שוב… אולי זו עונה אחרת? 🙂";
      fb.style.color = "#f97373";
    }
  });
});

// רישום Service Worker (אם נתמך)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .catch((err) => console.warn("Service worker registration failed", err));
  });
}
