# 12 FRAMES — ASTRONAUTS

Statický web. Obsahuje všech 12 videí a lokálně uložené Space Mono včetně licence.
Není potřeba instalace ani sestavení.

## Nahrání na GitHub

1. Rozbal ZIP.
2. Do kořene nového repozitáře nahraj obsah složky 12_FRAMES_ASTRONAUTS_GITHUB. Soubor index.html musí být přímo v kořeni.
3. Zachovej složky videos a fonts včetně jejich názvů.
4. Pro web zapni GitHub Pages v Settings → Pages, ze své hlavní větve a složky / (root).

Video soubory lze při ručním uploadu přidávat po menších skupinách.
Celý ZIP do repozitáře nenahrávej, nejprve jej rozbal.

## Místní náhled

Ve složce projektu spusť:

    python3 -m http.server 4173

Otevři http://localhost:4173

## Úpravy

- app.js obsahuje seznam astronautů, časy, souřadnice a přiřazení videí.
- contact: 4 znamená došlap ve čtvrté sekundě.
- laterMoment: true zachovává statický historický čas u náhradního záběru.
- style.css obsahuje vzhled, index.html anotaci a zdroje.
- Videa jsou bez zvuku při přehrávání. Kliknutí do videa přepíná pauzu.
- Opětovné kliknutí na aktivní GMT spouští klip od začátku.

Historické časy mají různou přesnost. Značka ≈ označuje přibližné hodnoty.
Souřadnice označují polohu modulu. Milisekundy časomíry jsou součástí animace.
Odkazy na archivní zdroje jsou uvedené přímo na webu v sekci ZDROJE.
