# Production package: China's Guerrilla War, 1927–1949 ("The Army That Ran Away and Won")

The Major Revolution · episode 3 · 1920x1080 @ 25 fps · runtime 12:43 · narration Kokoro bm_george (speed 1.10)

## What was made
- **Script and fact sheet:** `guerrilla/script.txt` and `guerrilla/plan_and_facts.md`. 201 fragments, 1,762 words.
- **Shots:** 110 shots in 12 chapters plus a cold open (median 6.9 s, 8.5 cuts a minute).
- **Visuals:** every shot is drawn by the engine, plus 17 archival photos and one painting (Wikimedia Commons), all treated in the house sepia.
- **Portrait medallions with real photos:** Mao (1925 and Yan'an), Zhu De, Zhou Enlai, Chiang Kai-shek, Otto Braun, Edgar Snow and Prachanda. Zhang Xueliang uses the drawn bust because no free photo came down.
- **Sound:** an original score in A minor pentatonic (the march theme, the lament, Nationalist chords and the three-note RULE motif), synthesised effects from 356 cues, and ducking under the voice. Mastered to −14 LUFS with two-pass loudnorm, AAC 320k.

## Spine device: the Sixteen Characters
The spine is Mao's formula 敌进我退 · 敌驻我扰 · 敌疲我打 · 敌退我追, brushed in the Ma Shan Zheng font (OFL).
- **Born:** written in ch 2 (S24–S26).
- **Line 1:** stamped red in ch 3 (S32). It cracks under Braun in ch 4 (S39) and heals at Zunyi in ch 5 (S46).
- **Line 2:** ch 8 (S74).
- **Line 1 again:** flashes on "Mao simply walked away" in ch 10 (S85).
- **Line 3:** ch 10 (S92).
- **Line 4 and complete:** ch 11 (S94).
- **Flies out:** to Vietnam, Peru and Nepal in ch 12 (S104).

## Planted object: the three rules (October 1927) and the sweet potato
- **Plant:** S18 (1:40). The rule sheet, the sweet potato drops on rule two, and the REMEMBER tag.
- **Echo:** S27. The rule is crossed out and replaced by the needle and thread.
- **Payoff:** S96–S98 (10:50, 85%). The same sheet, tag and motif, then the soldiers asleep on the Shanghai pavements (the cold-open plate).

## Locations (one plate each, reused for callbacks)
1. `shanghaiStreet`: night/red for 1927, dawn with sleepers for 1949. Cold open = ch 11.
2. `jinggang`: ch 1, 2, 5, 12.
3. `jiangxi`: ch 1, 3, 10, 12.
4. `blockhouses`: ch 4, 5.
5. `riverX`: the Xiang, and the Yangtze when wide.
6. `luding`: the Luding Bridge.
7. `snowGrass`: the Snow Mountains and the grasslands.
8. `yanan`: the Yan'an caves.
9. `xian`: Xi'an, 1936.
10. `northChina`: the railway and the Great Wall, including the Three Alls.
11. `tiananmen49`: Tiananmen, 1949.
12. Maps: `cnMap`, now on a new East Asia land layer with Natural Earth country borders, and `worldMap`.

## Engine changes (extensions only)
- **core:** `mixColor` and `hex` now accept rgb()/rgba() strings, so nested colour mixing works. The Brush font is registered.
- **art:**
  - Red Army star cap, officer's peaked cap, German-style helmet, Japanese helmet, parted hair and collar tabs.
  - `star5`, plus crowd hats (`star`, `stahl`, `jhelm`) and `toolSet`.
  - 19 new CH specs.
- **gfx:**
  - `sixteen` (the spine), `ruleSheet`, `sweetPotato`, `needleThread`, and `archival` (the worn-print photo insert with caption and credit).
  - Real portraits for the new keys; MAPS is exported; new places.
- **plates:** the 11 plates above, plus `lyingSoldier`, `redFlag` (1928–37 flag), `prcFlag` (1949), `blockhouse`, `trainCN`, `cnBorders`, and an `obelisk` option on `tiananmen`.
- **tts:** speed can be set with `TTS_SPEED`, and the lexicon has 27 new names.
- **mix.py:** a new score map for this episode. The Taiping version is kept as `audio/mix_taiping_backup.py`.

## Sensitivity
- No gore anywhere:
  - The 1927 purge, the Three Alls and Changchun are shown as silhouettes, crimson tints, empty or burning villages and human icons.
  - Nanjing 1937 is a text card only.
- The archival photos show soldiers and leaders only, never victims.

## Shot list
| id | start | dur | trans | description |
|---|---|---|---|---|
| S01 | 0:00.0 | 7.0 | cut | Shanghai at dawn, May 1949 (cold-open plate = ch11): the street, mist; date-line. |
| S02 | 0:07.0 | 5.8 | cut | Close: a Red Army soldier asleep on the pavement, rifle in his arms; Mao medallion; a shop shutter half open behind. "They had just taken the city." |
| S03 | 0:12.7 | 4.2 | cut | Shut doors along the shophouses; soldiers asleep outside them. NOT ONE HOME. |
| S04 | 0:16.9 | 6.5 | black | 1927: the Jinggang Mountains at dusk; a thin column of beaten men climbs the path. UNDER 1,000. |
| S05 | 0:23.4 | 6.9 | whip | Map: 1934–35, the Long March route races across China. MOST NEVER FINISHED. |
| S06 | 0:30.3 | 1.8 | cut | Map: China fills red. NOW IT HELD CHINA. |
| S07 | 0:32.2 | 8.7 | ink | Title card: a column on a ridge against a red dusk; "an army that kept running away" / "win the most populous country on earth?" then THE ARMY THAT RAN AWAY — AND WON · China's guerrilla war 1927–1949. |
| S08 | 0:40.9 | 3.7 | cut | Brand sting: a fuse burns across the black and lights THE MAJOR REVOLUTION. |
| S09 | 0:44.6 | 3.2 | black | Shanghai by night, April 1927 (the same street, under red light): gangsters with daggers advance in silhouette. |
| S10 | 0:47.8 | 5.2 | whip | Chiang Kai-shek: medallion (photo) and the figure in gold; a red crack runs between him and the communists' red tokens. TURNED ON HIS ALLIES. |
| S11 | 0:53.0 | 11.6 | cut | The hunt by night: silhouettes run across the red street; crimson tint; HUNDREDS / THOUSANDS (no bodies). |
| S12 | 1:04.5 | 6.5 | ink | Parchment card: THE CITIES (factory chimneys, a red workers' crowd) — the crowd greys and a DESTROYED stamp lands. |
| S13 | 1:11.0 | 7.1 | black | A secret meeting by lamplight: shadowed delegates at a table; Mao (young) stands to speak. Medallion with his 1925 photo. Date-line 7 August 1927. |
| S14 | 1:18.0 | 4.2 | cut | Quote card (reported speech, party record): "Political power grows out of the barrel of a gun." A rifle barrel rises behind. |
| S15 | 1:22.2 | 6.1 | whip | Hunan, September 1927: peasants rise under red flags in the paddies — then a steel-blue Nationalist line advances; the crowd breaks. CRUSHED. |
| S16 | 1:28.3 | 7.3 | ink | Map (Hunan–Jiangxi border): a small red token retreats from Hunan into the Jinggang Mountains. UNDER 1,000 MEN. |
| S17 | 1:35.6 | 2.8 | cut | A village road on the way up (Jinggang plate, dusk): Mao stops the ragged column and raises three fingers. THREE RULES. |
| S18 | 1:38.4 | 13.5 | cut | THE PLANT: the three rules written out, line by line; a single sweet potato drops onto rule two; the red REMEMBER tag pins on "Remember" (motif). |
| S19 | 1:51.9 | 5.7 | black | The Jinggang Mountains: mist, bamboo, the hideout village. Two bandit chiefs on a rock above the path. |
| S20 | 1:57.6 | 3.2 | cut | Mao and a bandit chief face each other; the chief's men turn red behind him. RECRUITED, NOT FOUGHT. |
| S21 | 2:00.8 | 8.6 | whip | Map: April 1928, Zhu De's column reaches the mountains (red arrow from the south-east). Zhu De medallion (photo). |
| S22 | 2:09.4 | 7.1 | cut | The hideout village: the red Army flag runs up the pole. THE FOURTH RED ARMY. Zhu and Mao side by side: commander / political chief. |
| S23 | 2:16.5 | 6.3 | ink | Split: a vast steel-blue army against a small red band: OUTNUMBERED · OUTGUNNED · SHORT OF EVERYTHING. |
| S24 | 2:22.8 | 6.8 | cut | THE SPINE IS BORN: on parchment, a brush writes the sixteen characters, four lines of four; a brush hand moves along. "By May, Mao later wrote." |
| S25 | 2:29.6 | 10.1 | cut | The formula, line by line, each with a small tactical diagram on a map sheet: blue advances / red falls back; blue halts / red harasses; blue tires / red strikes; blue retreats / red pursues. |
| S26 | 2:39.7 | 4.1 | cut | The sixteen characters lift to the top edge over the mountain plate: the spine is in place. "The whole war is written in them." |
| S27 | 2:43.8 | 12.0 | cut | ECHO: the rule sheet again — rule two is struck through; the sweet potato is replaced by a needle and thread (motif, major); PAY · RETURN. |
| S28 | 2:55.8 | 4.6 | black | Map: 1930, the Red Army moves east from the mountains into southern Jiangxi; the base area glows red. |
| S29 | 3:00.4 | 5.2 | cut | Chiang sends an army: blue arrows close on the red base. Chiang medallion. "Mao did not stand and fight." |
| S30 | 3:05.6 | 7.7 | cut | Jiangxi paddies: red soldiers fall back into a village; farmers wave them in and the doors close. Then a long blue column marches in, strung out, swallowed by mist. |
| S31 | 3:13.3 | 3.5 | whip | Tactical map: the blue column broken into segments; red arrows strike one segment at a time (three hits). |
| S32 | 3:16.8 | 10.7 | cut | Three campaigns, three FAILED stamps on Chiang's orders; then the first line of the sixteen characters is stamped red. |
| S33 | 3:27.5 | 9.6 | ink | Ruijin, November 1931: the congress hall with red flags and the banner CHINESE SOVIET REPUBLIC; then the real 1931 founding parade photo. |
| S34 | 3:37.1 | 3.7 | cut | Its own laws, money and army: a list over the real photo of Red Army soldiers, 1931. |
| S35 | 3:40.8 | 11.2 | black | Something darker: a lamp-lit room; shadows of interrogators over a kneeling prisoner (silhouettes only); crimson tint grows; TRAITORS? / UNDER TORTURE / THOUSANDS SHOT (by most estimates) — medallions grey with red slashes. |
| S35b | 3:52.0 | 9.0 | cut | Thousands shot (by most estimates): rows of Red Army medallions grey and take a red slash; "the revolution was already eating its own". |
| S36 | 4:01.0 | 10.2 | black | 1933: stone blockhouses rise one by one on every ridge, joined by roads. Chiang medallion; FIFTH ATTEMPT. |
| S37 | 4:11.3 | 9.4 | cut | Map: a ring of blockhouse dots around the red base; it creeps inward month by month and tightens like a noose. THOUSANDS · LIKE A NOOSE. |
| S38 | 4:20.6 | 8.6 | whip | New leaders: Mao's medallion greys and slides aside; Otto Braun's medallion (photo) takes the centre — "Moscow's man". |
| S39 | 4:29.2 | 8.0 | cut | The Red Army attacks a blockhouse line uphill in the open; volleys from the towers; crimson as they fall back. The first line of the spine cracks. |
| S40 | 4:37.3 | 2.2 | cut | Their losses: a red crowd thins and greys on a dark field. ENORMOUS LOSSES. |
| S41 | 4:39.5 | 10.9 | ink | Map: autumn 1934, the red base shrinks inside the ring; a red arrow probes for a way out; a question mark. |
| S42 | 4:50.4 | 4.5 | black | October 1934, night: long columns slip between the blockhouses with lanterns doused. OVER 80,000. |
| S43 | 4:54.9 | 8.5 | cut | Porters haul printing presses and crates on their backs; then Mao, sick with malaria, carried on a stretcher (medallion: "by some accounts"). |
| S44 | 5:03.4 | 7.6 | whip | The Xiang River, under fire: boats and men crossing; flashes on the far bank; smoke. THE ARMY SHRANK BY HALF (by some estimates). |
| S45 | 5:11.0 | 9.7 | ink | Zunyi, January 1935: the leaders around a lamp-lit table; Braun's medallion greys ("the blame"); Mao's medallion returns in colour ("back into command"). |
| S46 | 5:20.7 | 7.4 | cut | Two-column card: PARTY HISTORY — "the turning point" / HISTORIANS — "more cautious". The cracks in the spine's first line heal: the guerrilla rules come back. |
| S47 | 5:28.1 | 10.4 | whip | Map (Chishui River): the route zig-zags, doubles back and feints — four crossings counted 1–4 as the blue arrows miss. |
| S48 | 5:38.5 | 4.0 | black | Map: May 1935, the route swings far west to the Dadu River and Luding. |
| S49 | 5:42.5 | 8.0 | cut | The Luding Bridge across the gorge: thirteen chains; the near planks are gone (they fade away on "torn up"). 13 IRON CHAINS. |
| S50 | 5:50.5 | 4.7 | cut | Close on the chains: volunteers crawl hand over hand toward the burning far end, under fire (muzzle flashes, no wounds). |
| S51 | 5:55.2 | 3.7 | cut | The same bridge, drained of colour and fire; a red DISPUTED stamp; "some historians doubt there was much of a battle at all". |
| S52 | 5:58.8 | 2.6 | whip | Either way: the planks are back and a long file of soldiers crosses the bridge. |
| S53 | 6:01.4 | 4.3 | ink | The Snow Mountains: a file of men in thin cotton climbs into a blizzard. |
| S54 | 6:05.8 | 4.0 | cut | The grasslands: fog over swamp; a line of men picks its way; one figure sinks into the fog and is gone (no body shown). |
| S55 | 6:09.8 | 8.9 | black | Map: the route reaches northern Shaanxi (Wuqi), October 1935; FEWER THAN 10,000 left. |
| S56 | 6:18.6 | 12.3 | cut | Odometers on parchment: 25,000 LI ≈ 12,500 km (Mao) against ≈ 6,000 km (measured by two British walkers). A very long way. |
| S57 | 6:30.9 | 8.7 | cut | Northern Shaanxi at dusk: a ragged handful by the caves; CORNERED · STARVING; then Chiang's medallion in cold blue and blue arrows close in — hold for the mid-roll silence. |
| S58 | 6:39.7 | 7.3 | black | Summer 1936: an American reporter arrives at the cave camp (Edgar Snow, notebook in hand); Snow medallion — his own photo in a Red Army cap. |
| S59 | 6:47.0 | 4.4 | cut | Archive photo: Mao in northern Shaanxi, 1936; the book cover RED STAR OVER CHINA (1937) slides in. |
| S60 | 6:51.4 | 4.0 | whip | Map: December 1936, Chiang flies from Nanjing to Xi'an (a plane icon traces the route) to order one last offensive. |
| S61 | 6:55.4 | 9.6 | cut | His generals: Zhang Xueliang's medallion; the map darkens Manchuria (seized by Japan, 1931). A DIFFERENT ENEMY: JAPAN. |
| S62 | 7:05.0 | 5.0 | black | Xi'an, before dawn, 12 December 1936: torches of Zhang's troops climb toward the pavilions; shots. |
| S63 | 7:10.0 | 7.4 | cut | Chiang, in his nightclothes, scrambles up the frosty hillside; he crouches among the rocks; torchlight finds him. |
| S64 | 7:17.4 | 5.1 | cut | Chiang's medallion: "the man who hunted the communists for nine years" — PRISONER stamp. |
| S65 | 7:22.5 | 11.3 | whip | Released: three medallions — Chiang, Zhang, and Zhou Enlai (the communists' envoy) — linked by a cord; UNITED FRONT AGAINST JAPAN. |
| S66 | 7:33.8 | 7.9 | cut | Zhang's medallion greys behind bars ("decades under arrest"); then the map: the blue arrows pull back from Yan'an. THE HUNT WAS OVER. FOR NOW. |
| S67 | 7:41.7 | 4.9 | black | Map: July 1937, Japan's full invasion — the occupied zone spreads from the north-east down the coast. |
| S68 | 7:46.6 | 9.6 | cut | Chiang's armies in the great battles: smoke and flashes over a city skyline; SHANGHAI FELL stamp; then a dark card: Nanjing, December 1937 — no images. |
| S69 | 7:56.2 | 5.0 | whip | Archive photo: the Eighth Route Army on the Great Wall, 1937 (Sha Fei) — renamed, and going somewhere else. |
| S70 | 8:01.3 | 2.4 | cut | Map: red arrows slip behind the Japanese front into the occupied north. BEHIND JAPANESE LINES. |
| S71 | 8:03.7 | 7.8 | cut | Pingxing Pass, September 1937: a Japanese supply column in the valley; red figures on the ridge; flashes. Then the archive photo of the battle — "a famous one". |
| S72 | 8:11.5 | 10.0 | ink | The fish and the water: a pond on parchment; red fish swim among ripples — PEOPLE = WATER, GUERRILLAS = FISH (Mao, On Guerrilla Warfare, 1937). |
| S73 | 8:21.4 | 7.0 | cut | Map: Japan holds the cities (dark dots) and the railways (dark lines); the villages between fill with red dots; recruits. |
| S74 | 8:28.4 | 5.0 | cut | The spine: the second line — ENEMY HALTS · WE HARASS — is stamped red. |
| S75 | 8:33.4 | 9.1 | black | North China, August 1940: a train on the line below the Great Wall; charges blow the rails, a bridge, a mine head — one blast per word. |
| S76 | 8:42.5 | 3.2 | cut | Archive photo: the Hundred Regiments Offensive, 1940. |
| S77 | 8:45.8 | 6.8 | whip | Japan's answer: the Three Alls — villages burn under a crimson sky (no people shown); KILL ALL · BURN ALL · LOOT ALL stamped one by one. |
| S78 | 8:52.6 | 9.5 | cut | Map: village dots across the communist base areas go out one by one; a bar of population falls by almost half ("by some estimates"). |
| S79 | 9:02.1 | 3.9 | cut | Mao's lesson: medallion (Yan'an photo) and the line NEVER SHOW YOUR FULL STRENGTH TOO EARLY over the cave homes at dusk. |
| S80 | 9:05.9 | 10.8 | whip | Map, January 1941: blue arrows close on the New Fourth Army south of the Yangtze; then two medallions (Chiang, Mao) with a widening crack between them — IN NAME ONLY. |
| S81 | 9:16.7 | 4.8 | ink | Yan'an by lamplight: a party history document — its lines are struck through and rewritten in red ("rewrote its history"); the Rectification Movement. |
| S82 | 9:21.6 | 14.0 | black | August 1945: the occupied zone drains from the map; then a counter: 40,000 party members in 1937 → over 1,000,000. |
| S83 | 9:35.6 | 6.9 | black | Map, 1946: most of China in Nationalist blue, the communist north in red patches. NO CONTEST — on paper. |
| S84 | 9:42.5 | 8.1 | cut | Bars: Chiang over 4 million men (American weapons) against perhaps 1 million communists, counting militias. |
| S85 | 9:50.6 | 12.0 | whip | Yan'an, March 1947: blue Nationalist troops enter the cave town; Mao simply walks away over the hill; the spine's first line flashes again. |
| S86 | 10:02.5 | 8.1 | cut | A village square: a land deed is torn in two; plots are handed out; the brown crowd turns red and grows. HUNDREDS OF THOUSANDS joined. |
| S87 | 10:10.6 | 5.5 | cut | Chiang's China rotting: over a dim Shanghai street, a list — INFLATION · CORRUPTION · CONSCRIPTED AT GUNPOINT — and the archive photo of Chiang, 1945. |
| S88 | 10:16.2 | 13.6 | ink | Changchun, 1948: a red ring closes around the city on the map; the gates close; grey human icons fade as the counter reads 150,000+ civilians starved (by most estimates). Then silence. |
| S89 | 10:29.7 | 3.4 | cut | Archive photo: PLA soldiers at the end of the siege (soldiers only). "In China, that siege is still rarely mentioned." |
| S90 | 10:33.1 | 4.3 | whip | Map, late 1948: three great red arrows — Manchuria, Huaihai (around Xuzhou), Beiping–Tianjin. |
| S91 | 10:37.4 | 4.7 | cut | Archive photo: Nationalist troops during the Huaihai Campaign; counter: over 500,000 lost. |
| S92 | 10:42.1 | 5.1 | cut | The spine: the third line — ENEMY TIRES · WE ATTACK — stamped red. |
| S93 | 10:47.3 | 5.3 | black | April 1949: the Yangtze (the same river plate, wide): a fleet of junks carries the army across. A MILLION TROOPS. |
| S94 | 10:52.6 | 7.9 | cut | Map: Nanjing's token flips from blue to red; then the spine's fourth line stamps red — all sixteen characters complete and glowing. |
| S95 | 11:00.5 | 2.5 | whip | Late May 1949: the Shanghai street again (cold-open plate), first light. |
| S96 | 11:03.0 | 8.0 | cut | THE PAYOFF: the same rule sheet, the sweet potato, the needle and thread and the REMEMBER tag return (motif); HARDEST TEST: China's richest city. |
| S97 | 11:11.0 | 7.9 | cut | The cold-open street: soldiers asleep along both pavements; the shutters open and shopkeepers step out, looking at them. |
| S98 | 11:18.9 | 3.7 | cut | Close on a sleeping soldier in the dawn light; THE BEST ADVERTISEMENT THE COMMUNISTS EVER HAD. |
| S99 | 11:22.7 | 8.5 | black | Tiananmen Gate, 1 October 1949: red flags and crowds; then the archive photo of Mao proclaiming the People's Republic, and the painting The Founding Ceremony of the Nation (Dong Xiwen, 1953). |
| S100 | 11:31.1 | 2.8 | whip | Map: December 1949, Chiang's blue token crosses the strait to Taiwan. |
| S101 | 11:34.0 | 5.0 | cut | The whole Long March route and the full red spine over the map of China: RAN AWAY FOR 22 YEARS — AND WON. |
| S102 | 11:39.0 | 11.0 | black | Land reform: a village square at dusk; a landlord (gold robe) kneels before a crowd in silhouette; crimson tint; the landlord medallion greys with a red slash; HUNDREDS OF THOUSANDS TO MILLIONS. |
| S103 | 11:50.0 | 4.9 | cut | Mao's medallion (Yan'an photo) on black: RULED CHINA 1949–1976 · at a terrible human cost. |
| S104 | 11:54.9 | 11.1 | whip | World map: the sixteen characters lift off China and fly out; Vietnam lights red, then Peru. |
| S105 | 12:06.0 | 9.0 | cut | Nepal: the map zooms in; 1996–2006, a ten-year "people's war"; 13,000+ dead (by most counts); MONARCHY ABOLISHED 2008; Prachanda's medallion (photo). |
| S105b | 12:15.0 | 7.2 | cut | Nepal, 2008: the monarchy is abolished (stamp over Kathmandu); Prachanda, the guerrilla leader, becomes prime minister (medallion, photo). |
| S106 | 12:22.1 | 6.9 | ink | The Jinggang Mountains again at dusk (the hideout plate): the sixteen characters glow in a row over the ridges; "still studied in military academies around the world". |
| S107 | 12:29.0 | 6.9 | cut | The fish and the water again: the fish swim; "it wins by protecting them". |
| S108 | 12:36.0 | 6.9 | cut | The final question: the water darkens and the one big fish fills the pond; WHO PROTECTS THE PEOPLE FROM IT? — dip to black. |