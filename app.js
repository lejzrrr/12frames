const entries = [
  ['02:56:15','Neil Armstrong',11,'21.07.1969',false],
  ['03:15:16','Buzz Aldrin',11,'21.07.1969',false],
  ['11:44:22','Charles Conrad',12,'19.11.1969',false],
  ['12:13:50','Alan Bean',12,'19.11.1969',false],
  ['14:54','Alan Shepard',14,'05.02.1971',false],
  ['14:59:10','Edgar Mitchell',14,'05.02.1971',true],
  ['13:29:42','David Scott',15,'31.07.1971',true],
  ['13:37','James Irwin',15,'31.07.1971',true],
  ['16:57:54','John Young',16,'21.04.1972',true],
  ['17:00:24','Charles Duke',16,'21.04.1972',true],
  ['02:44','Eugene Cernan',17,'12.12.1972',true],
  ['02:48','Harrison Schmitt',17,'12.12.1972',true],
];
// Lunar-module coordinates, NASA NSSDCA, Mean Earth/Polar Axis DE421.
// https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html
const landingSites = {
  11: ['0.67416° N', '23.47314° E'],
  12: ['3.0128° S', '23.4219° W'],
  14: ['3.64589° S', '17.47194° W'],
  15: ['26.13239° N', '3.63330° E'],
  16: ['8.9734° S', '15.5011° E'],
  17: ['20.1911° N', '30.7723° E'],
};
const archive = document.querySelector('#archive');
let active = null;


function format(total) {
  const ms = Math.max(0, Math.round(total));
  const seconds = Math.floor(ms / 1000);
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map(n => String(n).padStart(2, '0')).join(':') + '.' + String(ms % 1000).padStart(3, '0');
}

function intervalLabel(index) {
  if (index === 0) return '';
  const timestamp = entry => {
    const [day, month, year] = entry[3].split('.').map(Number);
    const [hour, minute, second = 0] = entry[0].split(':').map(Number);
    return Date.UTC(year, month - 1, day, hour, minute, second);
  };
  const current = entries[index];
  const previous = entries[index - 1];
  let seconds = Math.round((timestamp(current) - timestamp(previous)) / 1000);
  const uncertain = current[4] || previous[4] || current[0].split(':').length < 3 || previous[0].split(':').length < 3;
  const days = Math.floor(seconds / 86400);
  seconds %= 86400;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  const remainder = seconds % 60;
  const pair = value => String(value).padStart(2, '0');
  const clock = [hours, minutes, ...(!uncertain ? [remainder] : [])].map(pair).join(':');
  const label = (uncertain ? '≈ ' : '') + '+ ' + (days ? days + ' d ' : '') + clock;
  return '<div class="interval info-block" style="--delay:540ms"><div>' + label + '</div><div class="interval-label" data-en="Since the previous first step">od předchozího prvního kroku</div></div>';
}

const astronautBios = {
  "Neil Armstrong": {
    portrait: "portraits/armstrong.jpg",
    born: "1930-08-05", died: "2012-08-25", selected: 1962,
    flights: "Gemini 8, Apollo 11",
    url: "https://www.nasa.gov/humans-in-space/astronauts/former-astronauts/former-astronaut-neil-a-armstrong/",
  },
  "Buzz Aldrin": {
    portrait: "portraits/aldrin.jpg",
    born: "1930-01-20", died: null, selected: 1963,
    flights: "Gemini 12, Apollo 11",
    url: "https://www.nasa.gov/former-astronaut-edwin-buzz-aldrin/",
  },
  "Charles Conrad": {
    portrait: "portraits/conrad.jpg",
    born: "1930-06-02", died: "1999-07-08", selected: 1962,
    flights: "Gemini 5, Gemini 11, Apollo 12, Skylab 2",
    url: "https://www.nasa.gov/former-astronaut-charles-pete-conrad-jr/",
  },
  "Alan Bean": {
    portrait: "portraits/bean.jpg",
    born: "1932-03-15", died: "2018-05-26", selected: 1963,
    flights: "Apollo 12, Skylab 3",
    url: "https://www.nasa.gov/former-astronaut-alan-bean/",
  },
  "Alan Shepard": {
    portrait: "portraits/shepard.jpg",
    born: "1923-11-18", died: "1998-07-21", selected: 1959,
    flights: "Mercury-Redstone 3, Apollo 14",
    url: "https://www.nasa.gov/former-astronaut-alan-shepard/",
  },
  "Edgar Mitchell": {
    portrait: "portraits/mitchell.jpg",
    born: "1930-09-17", died: "2016-02-04", selected: 1966,
    flights: "Apollo 14",
    url: "https://www.nasa.gov/wp-content/uploads/2016/01/mitchell_edgar.pdf",
  },
  "David Scott": {
    portrait: "portraits/scott.jpg",
    born: "1932-06-06", died: null, selected: 1963,
    flights: "Gemini 8, Apollo 9, Apollo 15",
    url: "https://www.nasa.gov/former-astronaut-david-r-scott/",
  },
  "James Irwin": {
    portrait: "portraits/irwin.jpg",
    born: "1930-03-17", died: "1991-08-08", selected: 1966,
    flights: "Apollo 15",
    url: "https://www.nasa.gov/wp-content/uploads/2016/01/irwin_james.pdf",
  },
  "John Young": {
    portrait: "portraits/young.jpg",
    born: "1930-09-24", died: "2018-01-05", selected: 1962,
    flights: "Gemini 3, Gemini 10, Apollo 10, Apollo 16, STS-1, STS-9",
    url: "https://www.nasa.gov/former-astronaut-john-w-young/",
  },
  "Charles Duke": {
    portrait: "portraits/duke.jpg",
    born: "1935-10-03", died: null, selected: 1966,
    flights: "Apollo 16",
    url: "https://www.nasa.gov/wp-content/uploads/2016/01/duke_charles.pdf",
  },
  "Eugene Cernan": {
    portrait: "portraits/cernan.jpg",
    born: "1934-03-14", died: "2017-01-16", selected: 1963,
    flights: "Gemini 9A, Apollo 10, Apollo 17",
    url: "https://www.nasa.gov/former-astronaut-eugene-a-cernan/",
  },
  "Harrison Schmitt": {
    portrait: "portraits/schmitt.jpg",
    born: "1935-07-03", died: null, selected: 1965,
    flights: "Apollo 17",
    url: "https://www.nasa.gov/former-astronaut-harrison-schmitt/",
  },
};

function biographyDate(isoDate) {
  const date = new Date(isoDate + 'T00:00:00Z');
  const options = {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'};
  const cs = date.toLocaleDateString('cs-CZ', options);
  const en = date.toLocaleDateString('en-GB', options);
  return `<time datetime="${isoDate}" data-en="${en}">${cs}</time>`;
}

entries.forEach(([time, name, mission, date, approximate], index) => {
  const bio = astronautBios[name];
  const article = document.createElement('article');
  article.innerHTML = `
    <button class="time" aria-expanded="false" aria-controls="panel-${index}"><span class="ordinal">${String(index + 1).padStart(2,'0')}</span><span class="time-faces"><span class="regular">GMT ${approximate ? '<span class="time-approximation" aria-hidden="true">≈ </span>' : ''}${time}${approximate ? '<sup class="time-asterisk" aria-hidden="true">*</sup><span class="time-approximation-label" data-en="approximate time">přibližný čas</span>' : ''}</span></span></button>
    <div class="panel" id="panel-${index}" hidden>
      <button type="button" class="mobile-back" data-en="↑ Back to times">↑ Zpět k časům</button>
      <div class="screen">
        <video playsinline muted preload="metadata"></video>
      </div>
      <div class="clock"></div>
      ${index + 1 < entries.length ? `
        <button type="button" class="next-frame" hidden
          aria-label="Další záběr" data-en-label="Next clip">
          ${String(index + 2).padStart(2, '0')} →
        </button>` : ''}
      <div class="info" aria-hidden="true"><div class="info-block caption-mission" style="--delay:180ms"><div>Apollo <span class="caption-number">${mission}</span></div><div class="caption-number">${date}</div></div><div class="coordinates info-block" style="--delay:360ms" aria-label="Souřadnice přistání lunárního modulu" data-en-label="Lunar module landing coordinates"><div>${landingSites[mission][0]}</div><div>${landingSites[mission][1]}</div></div>${intervalLabel(index)}${index === 8 ? '<div class="info-block archive-note" style="--delay:720ms" data-en="The first step is obscured in the surviving footage. This clip shows a later jump beside the flag. The time shown is for the first step.">První došlap je v dochovaném záznamu zakrytý. Tento klip zachycuje pozdější skok u vlajky. Uvedený čas patří prvnímu vstupu na povrch.</div>' : index === 9 ? '<div class="info-block archive-note" style="--delay:720ms" data-en="No footage of the first step was found in the archives consulted. This clip shows later work on the surface. The time shown is for the first step.">První došlap se ve zde dohledaných filmových záznamech nepodařilo nalézt. Tento klip zachycuje pozdější práci na povrchu. Uvedený čas patří prvnímu vstupu na povrch.</div>' : index === 10 ? '<div class="info-block archive-note" style="--delay:720ms" data-en="The surviving footage begins shortly after the first step. The time shown is for the first step.">Dochovaný záznam začíná krátce po prvním kroku. Uvedený čas patří prvnímu vstupu na povrch.</div>' : index === 11 ? '<div class="info-block archive-note" style="--delay:720ms" data-en="This clip shows a later moment beside the flag. The time shown is for the first step.">Tento klip zachycuje pozdější okamžik u vlajky. Uvedený čas patří prvnímu vstupu na povrch.</div>' : ''}</div>
      <aside class="astronaut-story" aria-labelledby="story-${index}">
        <h2 id="story-${index}">${name}</h2>
        <img class="astronaut-portrait" src="${bio.portrait}" alt="" loading="lazy">
        <dl class="astronaut-facts">
          <div><dt data-en="Born">Narození</dt><dd>${biographyDate(bio.born)}</dd></div>
          ${bio.died ? `<div><dt data-en="Died">Úmrtí</dt><dd>${biographyDate(bio.died)}</dd></div>` : ''}
          <div><dt data-en="Selected by NASA">Výběr do NASA</dt><dd>${bio.selected}</dd></div>
          <div><dt data-en="Spaceflights">Lety do vesmíru</dt><dd>${bio.flights}</dd></div>
        </dl>
        <a href="${bio.url}" target="_blank" rel="noopener">NASA ↗</a>
      </aside>
    </div>`;
  archive.append(article);
  article.style.setProperty('--row', index + 1);
  const archiveNote = article.querySelector('.archive-note');
  if (archiveNote) {
    archiveNote.classList.remove('info-block');
    article.querySelector('.astronaut-story').before(archiveNote);
  }
  const button = article.querySelector('.time');
  const panel = article.querySelector('.panel');
  const mobileBack = panel.querySelector('.mobile-back');
  mobileBack.onclick = () => {
    close();
    active = null;
    button.focus({preventScroll: true});
    button.scrollIntoView({block: 'nearest', behavior: 'instant'});
  };
  const nextFrame = panel.querySelector('.next-frame');
  if (nextFrame) {
    nextFrame.onclick = () => {
      const nextTime = document.querySelector(`[aria-controls="panel-${index + 1}"]`);
      nextTime.focus({preventScroll: true});
      nextTime.click();
    };
  }
  const video = article.querySelector('video');
  const clips = [
    {src: '01_armstrong.mp4', contact: 4},
    {src: '02_aldrin.mp4', contact: 4},
    {src: '03_conrad.mp4', contact: 4},
    {src: '04_bean.mp4', contact: 4},
    {src: '05_shepard.mp4', contact: 4},
    {src: '06_mitchell.mp4', contact: 4},
    {src: '07_scott.mp4', contact: 4},
    {src: '08_irwin.mp4', contact: 4},
    {src: '09_young.mp4', contact: 4, laterMoment: true},
    {src: '10_duke.mp4', contact: 4, laterMoment: true},
    {src: '11_cernan.mp4', contact: 4, laterMoment: true},
    {src: '12_schmitt.mp4', contact: 4, laterMoment: true},
  ];
  const clip = clips[index] || null;
  if (clip) video.src = clip.src;
  const contact = clip ? clip.contact : 4;
  const clock = article.querySelector('.clock');
  const info = article.querySelector('.info');
  const parts = time.split(':').map(Number);
  const target = (parts[0]*3600 + parts[1]*60 + (parts[2] || 0))*1000;
  let animation;
  let start;
  let playing = false;

  function stop() {
    cancelAnimationFrame(animation);
    video.pause();
    playing = false;
  }
  function close() {
    stop();
    panel.hidden = true;
    button.setAttribute('aria-expanded','false');
  }
  function tick(now) {
    if (!playing) return;
    const elapsed = clip ? video.currentTime : (now - start)/1000;
    clock.textContent = clip?.laterMoment ? (approximate ? '≈ ' : '') + time : format(target - contact * 1000 + Math.min(contact,elapsed)*1000);
    info.classList.toggle('visible', elapsed >= contact);
    info.setAttribute('aria-hidden', String(elapsed < contact));
    if (clip ? !video.ended : elapsed < 8) animation = requestAnimationFrame(tick);
    else playing = false;
  }
  async function replay() {
    stop();
    if (nextFrame) nextFrame.hidden = true;
    panel.scrollTop = 0;
    info.classList.remove('visible');
    info.setAttribute('aria-hidden', 'true');
    clock.textContent = clip?.laterMoment ? (approximate ? '≈ ' : '') + time : format(target - contact * 1000);
    start = performance.now();
    playing = true;
    if (clip) {
      video.currentTime = 0;
      const attempt = video.play();
      if (attempt) attempt.catch(() => { stop(); });
    }
    animation = requestAnimationFrame(tick);
  }
  video.tabIndex = 0;
  video.dataset.enLabel = 'Video — ' + name + '. Click or press Space to pause or resume.';
  video.setAttribute('aria-label', 'Video — ' + name + '. Kliknutím nebo mezerníkem pozastavit a pokračovat.');
  function togglePlayback() {
    if (video.ended) { replay(); return; }
    if (video.paused) {
      playing = true;
      video.play().then(() => {
        cancelAnimationFrame(animation);
        animation = requestAnimationFrame(tick);
      }).catch(stop);
    } else stop();
  }
  video.addEventListener('click', togglePlayback);
  video.addEventListener('keydown', event => {
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      togglePlayback();
    }
  });
  video.addEventListener('ended', () => {
    if (panel.hidden) return;
    if (nextFrame) nextFrame.hidden = false;
    if (playing) tick(performance.now());
  });
  button.onclick = () => {
    closeReadingPanels();
    if (button.getAttribute('aria-expanded') === 'true') {
      replay();
      return;
    }
    if (active) active();
    panel.hidden = false;
    button.setAttribute('aria-expanded','true');
    if (window.matchMedia('(max-width: 760px)').matches) {
      mobileBack.focus({preventScroll: true});
      panel.scrollIntoView({block: 'start', behavior: 'instant'});
    }
    active = close;
    replay();

  };
});

const navigation = document.createElement('nav');
navigation.className = 'project-links';
navigation.setAttribute('aria-label', 'O projektu');
navigation.dataset.enLabel = 'About the project';
navigation.innerHTML = '<button type="button" class="sources-toggle" data-dialog="sources-dialog" aria-label="Zdroje" data-en-label="Sources"><span aria-hidden="true">↙</span></button><span class="language-switch"><button type="button" data-language="cs" aria-label="Čeština" aria-pressed="true">CZ</button> / <button type="button" data-language="en" aria-label="English" aria-pressed="false">EN</button></span>';
archive.append(navigation);

const readingPanels = [...document.querySelectorAll('.reading-panel')];
readingPanels.forEach(panel => archive.append(panel));
function closeReadingPanels() {
  readingPanels.forEach(panel => { panel.hidden = true; });
  navigation.querySelectorAll('[data-dialog]').forEach(button => button.setAttribute('aria-expanded', 'false'));
}
navigation.querySelectorAll('[data-dialog]').forEach(button => {
  button.setAttribute('aria-controls', button.dataset.dialog);
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    if (active) active();
    active = null;
    closeReadingPanels();
    const panel = document.getElementById(button.dataset.dialog);
    panel.hidden = false;
    panel.scrollTop = 0;
    button.setAttribute('aria-expanded', 'true');
    if (window.matchMedia('(max-width: 760px)').matches) panel.scrollIntoView({block:'start',behavior:'smooth'});
  });
});

const languageButtons = navigation.querySelectorAll('[data-language]');
const translatedText = [...document.querySelectorAll('[data-en]')].map(element => ({
  element, original: element.textContent, english: element.dataset.en,
}));
const translatedLabels = [...document.querySelectorAll('[data-en-label]')].map(element => ({
  element, original: element.getAttribute('aria-label'), english: element.dataset.enLabel,
}));

function setLanguage(language) {
  const english = language === 'en';
  document.documentElement.lang = language;
  languageButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  translatedText.forEach(item => { item.element.textContent = english ? item.english : item.original; });
  translatedLabels.forEach(item => { item.element.setAttribute('aria-label', english ? item.english : item.original); });
}
languageButtons.forEach(button => {
  button.addEventListener('click', () => {
    const language = button.dataset.language;
    setLanguage(language);
    try { localStorage.setItem('12frames-language', language); } catch {}
  });
});
try {
  if (localStorage.getItem('12frames-language') === 'en') setLanguage('en');
} catch {}
