// גלילת כפתור "בואו נתחיל"
document.getElementById("scrollToSeasons")?.addEventListener("click", () => {
  const el = document.getElementById("seasons");
  if (el) el.scrollIntoView({ behavior: "smooth" });
});

// מיפוי מזהי האודיו לכל עונה
const audioIds = {
  spring: "audio-spring",
  summer: "audio-summer",
  autumn: "audio-autumn",
  winter: "audio-winter"
};

// פונקציה שעוצרת את כל קבצי האודיו
function stopAllAudio() {
  Object.values(audioIds).forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  });
}

// נתוני טקסט לכל עונה להסבר
const seasonInfo = {
  spring: {
    title: "אביב — מה שומעים במוזיקה?",
    text: [
      'ב"אביב" של ויואלדי שומעים ציפורים שרות, נחלים זורמים וגשם עדין.',
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
  // קודם עוצרים הכול
  stopAllAudio();

  const audioId = audioIds[season];
  const audio = audioId ? document.getElementById(audioId) : null;
  if (audio) {
    audio.play().catch(() => {
      // במכשירים ניידים צריך לעתים אינטראקציה לפני השמעה
      console.warn("לא ניתן לנגן אוטומטית – ייתכן שצריך לגעת במסך.");
    });
  }

  // עדכון טקסט ההסבר
  const details = seasonInfo[season];
  const container = document.getElementById("seasonDetails");
  if (details && container) {
    container.innerHTML = `
      <h3>${details.title}</h3>
      ${details.text.map((line) => `<p>${line}</p>`).join("")}
    `;
  }
}

// האזנה לכפתורי "נגן" של העונות
document.querySelectorAll(".play-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const season = e.currentTarget.getAttribute("data-season");
    if (season) {
      playSeasonAudio(season);
    }
  });
});

// האזנה לכפתורי "הפסק מוזיקה" של העונות
document.querySelectorAll(".stop-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const season = e.currentTarget.getAttribute("data-season");
    if (season && audioIds[season]) {
      const audio = document.getElementById(audioIds[season]);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } else {
      // ליתר ביטחון – אם אין עונה, עוצר את הכול
      stopAllAudio();
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

// כפתור "הפסק את כל המוזיקה" במשחק
document.getElementById("stopAllAudio")?.addEventListener("click", () => {
  stopAllAudio();
  const fb = document.getElementById("gameFeedback");
  if (fb) {
    fb.textContent = "המוזיקה נעצרה. אפשר להמשיך ולשחק או לנגן שוב 🙂";
    fb.style.color = "#9ca3af";
  }
});

document.querySelectorAll(".guess-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const guess = e.currentTarget.getAttribute("data-guess");
    const fb = document.getElementById("gameFeedback");
    if (!fb) return;

    if (!currentRandomSeason) {
      fb.textContent = 'קודם נלחץ על "נגן קטע אקראי" 🙂';
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
