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
  return '<div class="interval info-block" style="--delay:540ms"><div>' + label + '</div><div class="interval-label">od předchozího prvního kroku</div></div>';
}

entries.forEach(([time, name, mission, date, approximate], index) => {
  const article = document.createElement('article');
  article.innerHTML = `
    <button class="time" aria-expanded="false" aria-controls="panel-${index}"><span class="ordinal">${String(index + 1).padStart(2,'0')}</span><span class="time-faces"><span class="regular">GMT ${approximate ? '≈ ' : ''}${time}</span><span class="bold" aria-hidden="true">GMT ${approximate ? '≈ ' : ''}${time}</span></span></button>
    <div class="panel" id="panel-${index}" hidden>
      <div class="screen">
        <video playsinline muted preload="metadata"></video>
      </div>
      <div class="clock"></div>
      <div class="info" aria-hidden="true"><div class="info-block" style="--delay:0ms">${name}</div><div class="info-block" style="--delay:180ms"><div>Apollo ${mission}</div><div>${date}</div></div><div class="coordinates info-block" style="--delay:360ms" aria-label="Souřadnice přistání lunárního modulu"><div>${landingSites[mission][0]}</div><div>${landingSites[mission][1]}</div></div>${intervalLabel(index)}${index === 8 ? '<div class="info-block archive-note" style="--delay:720ms">První došlap je v dochovaném záznamu zakrytý. Tento klip zachycuje pozdější skok u vlajky. Uvedený čas patří prvnímu vstupu na povrch.</div>' : index === 9 ? '<div class="info-block archive-note" style="--delay:720ms">První došlap se ve zde dohledaných filmových záznamech nepodařilo nalézt. Tento klip zachycuje pozdější práci na povrchu. Uvedený čas patří prvnímu vstupu na povrch.</div>' : index === 10 ? '<div class="info-block archive-note" style="--delay:720ms">Dochovaný záznam začíná krátce po prvním kroku. Uvedený čas patří prvnímu vstupu na povrch.</div>' : index === 11 ? '<div class="info-block archive-note" style="--delay:720ms">Tento klip zachycuje pozdější okamžik u vlajky. Uvedený čas patří prvnímu vstupu na povrch.</div>' : ''}</div>
    </div>`;
  archive.append(article);
  article.style.setProperty('--row', index + 1);
  const archiveNote = article.querySelector('.archive-note');
  if (archiveNote) {
    archiveNote.classList.remove('info-block');
    article.querySelector('.panel').append(archiveNote);
  }
  const button = article.querySelector('.time');
  const panel = article.querySelector('.panel');
  const video = article.querySelector('video');
  const clips = [
    {src: 'videos/01_armstrong.mp4', contact: 4},
    {src: 'videos/02_aldrin.mp4', contact: 4},
    {src: 'videos/03_conrad.mp4', contact: 4},
    {src: 'videos/04_bean.mp4', contact: 4},
    {src: 'videos/05_shepard.mp4', contact: 4},
    {src: 'videos/06_mitchell.mp4', contact: 4},
    {src: 'videos/07_scott.mp4', contact: 4},
    {src: 'videos/08_irwin.mp4', contact: 4},
    {src: 'videos/09_young.mp4', contact: 4, laterMoment: true},
    {src: 'videos/10_duke.mp4', contact: 4, laterMoment: true},
    {src: 'videos/11_cernan.mp4', contact: 4, laterMoment: true},
    {src: 'videos/12_schmitt.mp4', contact: 4, laterMoment: true},
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
    if (!playing) return;
    tick(performance.now());
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
      button.scrollIntoView({block:'start', behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    }
    active = close;
    replay();

  };
});

const navigation = document.createElement('nav');
navigation.className = 'project-links';
navigation.setAttribute('aria-label', 'O projektu');
navigation.innerHTML = '<button data-dialog="annotation-dialog">ANOTACE</button><button data-dialog="sources-dialog">ZDROJE</button><a href="https://www.instagram.com/matejlesser/" target="_blank" rel="noopener">INSTAGRAM</a>';
archive.append(navigation);

const readingPanels = [...document.querySelectorAll('.reading-panel')];
readingPanels.forEach(panel => archive.append(panel));
function closeReadingPanels() {
  readingPanels.forEach(panel => { panel.hidden = true; });
  navigation.querySelectorAll('button').forEach(button => button.setAttribute('aria-expanded', 'false'));
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
