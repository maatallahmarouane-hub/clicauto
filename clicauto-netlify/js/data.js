'use strict';

/* ─── YEARS ─── */
const YEARS = Array.from({ length: 27 }, (_, i) => 2026 - i); // 2026 → 2000

/* ─── BRANDS + MODELS ─── */
const BRANDS = [
  {
    id: 'peugeot', name: 'Peugeot',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#002C75"/><circle cx="16" cy="12" r="4" fill="none" stroke="white" stroke-width="1.8"/><path d="M12.5 16.5C12.5 16.5 14 20 16 20C18 20 19.5 16.5 19.5 16.5" stroke="white" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M14 20L13.5 25H18.5L18 20" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.5 9.5L12.5 10.5M20.5 9.5L19.5 10.5M16 7.5V9" stroke="white" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    models: ['106','205','206','207','208 1','208 2','306','307','308 1','308 2','308 3','405','406','407','408','504','508 1','508 2','2008 1','2008 2','3008 1','3008 2','5008 1','5008 2','Partner 1','Partner 2','Partner 3','Rifter','Expert 1','Expert 2','Expert 3','Boxer 1','Boxer 2','Boxer 3']
  },
  {
    id: 'dacia', name: 'Dacia',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#172A5E"/><path d="M7 22L16 10L25 22" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M10.5 22L16 14.5L21.5 22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    models: ['Logan 1','Logan 2','Logan 3','Sandero 1','Sandero 2','Sandero 3','Sandero Stepway 1','Sandero Stepway 2','Sandero Stepway 3','Duster 1','Duster 2','Duster 3','Dokker','Lodgy','Spring','Jogger']
  },
  {
    id: 'renault', name: 'Renault',
    logo: `<svg viewBox="0 0 32 32" fill="none"><rect x="1" y="1" width="30" height="30" rx="6" fill="#EFCC00"/><polygon points="16,5 20,16 16,27 12,16" fill="#1A1A1A"/></svg>`,
    models: ['Clio 1','Clio 2','Clio 3','Clio 4','Clio 5','Mégane 1','Mégane 2','Mégane 3','Mégane 4','Laguna 1','Laguna 2','Laguna 3','Scenic 1','Scenic 2','Scenic 3','Scenic 4','Kangoo 1','Kangoo 2','Kangoo 3','Trafic 2','Trafic 3','Master 2','Master 3','Twingo 1','Twingo 2','Twingo 3','Symbol 1','Symbol 2','Symbol 3','Captur 1','Captur 2','Kadjar','Koleos 1','Koleos 2','Arkana','Fluence','Zoe','Express','11','12','18','19','21']
  },
  {
    id: 'volkswagen', name: 'Volkswagen',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#00235F"/><circle cx="16" cy="16" r="13" fill="none" stroke="white" stroke-width=".5" opacity=".4"/><path d="M11 8.5L16 17.5L21 8.5" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M8 17L11 23.5L16 17.5L21 23.5L24 17" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    models: ['Golf 3','Golf 4','Golf 5','Golf 6','Golf 7','Golf 8','Polo 3','Polo 4','Polo 5','Polo 6','Passat B5','Passat B6','Passat B7','Passat B8','Tiguan 1','Tiguan 2','T-Roc','T-Cross','Touareg 1','Touareg 2','Touareg 3','Touran 1','Touran 2','Touran 3','Caddy 3','Caddy 4','Caddy 5','Transporter T5','Transporter T6','Jetta 5','Jetta 6','Jetta 7','Sharan 1','Sharan 2','Crafter','Arteon','Amarok','Beetle']
  },
  {
    id: 'hyundai', name: 'Hyundai',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#002C5F"/><path d="M10 22V10" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M22 22V10" stroke="white" stroke-width="3" stroke-linecap="round"/><path d="M10.3 16.8Q13 14 16 14Q19 14 21.7 16.8" stroke="white" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>`,
    models: ['i10 1','i10 2','i10 3','i20 1','i20 2','i20 3','i30 1','i30 2','i30 3','i40','Accent 3','Accent 4','Accent 5','Elantra 5','Elantra 6','Elantra 7','Tucson 1','Tucson 2','Tucson 3','Tucson 4','Santa Fe 1','Santa Fe 2','Santa Fe 3','Santa Fe 4','Kona 1','Kona 2','Creta 1','Creta 2','Sonata 5','Sonata 6','Sonata 7','Sonata 8','ix35','Getz','H1','H100']
  },
  {
    id: 'kia', name: 'Kia',
    logo: `<svg viewBox="0 0 44 22" fill="none"><rect width="44" height="22" rx="3" fill="#000"/><path d="M7 16V6L10 11L13 6V16" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M18 6V16" stroke="white" stroke-width="1.8" stroke-linecap="round"/><path d="M23 6V16M23 6C27.5 6 30 7.5 30 11C30 14.5 27.5 16 23 16" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M35 6V16M38 6L34.5 11L38 16" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
    models: ['Picanto 1','Picanto 2','Picanto 3','Rio 2','Rio 3','Rio 4','Ceed 1','Ceed 2','Ceed 3','Sportage 2','Sportage 3','Sportage 4','Sportage 5','Sorento 1','Sorento 2','Sorento 3','Sorento 4','Cerato 2','Cerato 3','Cerato 4','Soul 1','Soul 2','Soul 3','Stonic','Niro 1','Niro 2','Stinger','Carnival','Pregio','K2700']
  },
  {
    id: 'ford', name: 'Ford',
    logo: `<svg viewBox="0 0 48 26" fill="none"><ellipse cx="24" cy="13" rx="23" ry="12" fill="#003499"/><ellipse cx="24" cy="13" rx="19.5" ry="9" fill="none" stroke="#4A7CD4" stroke-width=".8"/><path d="M11 18V8H19M11 13H17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M25 8V18" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M29 8C34.5 8 37 9.5 37 13C37 16.5 34.5 18 29 18" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`,
    models: ['Fiesta 5','Fiesta 6','Fiesta 7','Focus 1','Focus 2','Focus 3','Focus 4','Mondeo 3','Mondeo 4','Mondeo 5','Kuga 1','Kuga 2','Kuga 3','Puma','EcoSport','Ranger T6','Ranger T7','Mustang 5','Mustang 6','S-Max 1','S-Max 2','C-Max 1','C-Max 2','Transit Connect 2','Transit Connect 3','Transit Custom 1','Transit Custom 2','Ka','B-Max','Tourneo Courier']
  },
  {
    id: 'toyota', name: 'Toyota',
    logo: `<svg viewBox="0 0 44 26" fill="none"><rect width="44" height="26" rx="4" fill="#CC0000"/><ellipse cx="22" cy="13" rx="8" ry="11.5" stroke="white" stroke-width="2.2" fill="none"/><ellipse cx="22" cy="13" rx="20.5" ry="7" stroke="white" stroke-width="2.2" fill="none"/><path d="M5.5 7Q22 3 38.5 7" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`,
    models: ['Yaris 1','Yaris 2','Yaris 3','Yaris 4','Corolla E11','Corolla E12','Corolla E14','Corolla E16','Corolla E21','Auris 1','Auris 2','Camry 6','Camry 7','Camry 8','RAV4 2','RAV4 3','RAV4 4','RAV4 5','Land Cruiser 100','Land Cruiser 200','Land Cruiser 300','Land Cruiser Prado 120','Land Cruiser Prado 150','Hilux 7','Hilux 8','C-HR','Prius 2','Prius 3','Prius 4','Fortuner 1','Fortuner 2','Avensis 2','Avensis 3','Aygo 1','Aygo 2']
  },
  {
    id: 'citroen', name: 'Citroën',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#C01010"/><path d="M8 12 L16 7 L24 12" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 17 L16 12 L24 17" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    models: ['Saxo','Xsara','Xsara Picasso','C1 1','C1 2','C2','C3 1','C3 2','C3 3','C3 Aircross 1','C3 Aircross 2','C4 1','C4 2','C4 3','C4 Cactus','C4 Picasso 1','C4 Picasso 2','C5 1','C5 2','C5 Aircross','C-Elysée','Berlingo 1','Berlingo 2','Berlingo 3','Jumpy 1','Jumpy 2','Jumpy 3','Jumper 1','Jumper 2','Jumper 3','Nemo']
  },
  {
    id: 'seat', name: 'SEAT',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#E2001A"/><path d="M20.5 10.5Q23 14 20.5 17L16 21.5Q13.5 24 11 21.5L9.5 20Q7 17.5 9.5 14.5L15 9Q17.5 6.5 20 9L20.5 10.5Z" stroke="white" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M20.5 10.5L16 15M12 21L16 17" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    models: ['Ibiza 2','Ibiza 3','Ibiza 4','Ibiza 5','Leon 1','Leon 2','Leon 3','Leon 4','Arona','Ateca','Tarraco','Toledo 2','Toledo 3','Toledo 4','Alhambra 2','Mii','Altea']
  },
  {
    id: 'skoda', name: 'Škoda',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#1A6139"/><path d="M10 10Q22 10 22 16Q22 22 10 22" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M13 13L24 7.5" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M13 19L24 24.5" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    models: ['Fabia 1','Fabia 2','Fabia 3','Fabia 4','Octavia 1','Octavia 2','Octavia 3','Octavia 4','Superb 2','Superb 3','Karoq','Kodiaq','Kamiq','Rapid','Scala','Yeti','Roomster']
  },
  {
    id: 'nissan', name: 'Nissan',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#C3002F"/><circle cx="16" cy="16" r="11" fill="none" stroke="white" stroke-width="1.2"/><path d="M6 16H26" stroke="white" stroke-width="2.2" stroke-linecap="round"/><path d="M7.5 13C7.5 13 10 9.5 16 9.5S24.5 13 24.5 13" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M7.5 19C7.5 19 10 22.5 16 22.5S24.5 19 24.5 19" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>`,
    models: ['Micra K11','Micra K12','Micra K13','Micra K14','Juke 1','Juke 2','Qashqai 1','Qashqai 2','Qashqai 3','X-Trail T30','X-Trail T31','X-Trail T32','X-Trail T33','Navara D40','Navara D23','Note 1','Note 2','Patrol Y60','Patrol Y61','Patrol Y62','Pathfinder R50','Pathfinder R51','Almera N15','Almera N16','Tiida','Sunny','Leaf']
  },
  {
    id: 'fiat', name: 'Fiat',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#A01017"/><circle cx="16" cy="16" r="11" fill="none" stroke="white" stroke-width=".7" opacity=".5"/><path d="M9.5 8.5H22.5M16 8.5V23.5M11 13.5H19" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    models: ['Punto 1','Punto 2','Grande Punto','Punto Evo','Panda 1','Panda 2','Panda 3','500','500L','500X','Tipo 2','Bravo 2','Linea','Doblo 1','Doblo 2','Doblo 3','Ducato 3','Ducato 4','Fiorino 3','Stilo']
  },
  {
    id: 'opel', name: 'Opel',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#141414"/><ellipse cx="16" cy="16" rx="11" ry="7" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5"/><path d="M10 16 L22 16" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    models: ['Corsa B','Corsa C','Corsa D','Corsa E','Corsa F','Astra F','Astra G','Astra H','Astra J','Astra K','Astra L','Insignia A','Insignia B','Mokka 1','Mokka B','Zafira A','Zafira B','Zafira C','Meriva A','Meriva B','Vectra B','Vectra C','Crossland X','Crossland','Grandland X','Grandland','Vivaro A','Vivaro B','Vivaro C','Movano A','Movano B','Combo C','Combo D','Combo E','Antara']
  },
  {
    id: 'bmw', name: 'BMW',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="white" stroke="#1a1a1a" stroke-width="1.5"/><path d="M16 1 A15 15 0 0 1 31 16 L16 16 Z" fill="#0066B1"/><path d="M16 31 A15 15 0 0 1 1 16 L16 16 Z" fill="#0066B1"/><circle cx="16" cy="16" r="9.5" fill="white" stroke="#1a1a1a" stroke-width="1.5"/><path d="M16 6.5 A9.5 9.5 0 0 1 25.5 16 L16 16 Z" fill="#0066B1"/><path d="M16 25.5 A9.5 9.5 0 0 1 6.5 16 L16 16 Z" fill="#0066B1"/></svg>`,
    models: ['Série 1 E87','Série 1 F20','Série 1 F40','Série 2 F22','Série 2 G42','Série 2 Active Tourer F45','Série 2 Active Tourer U06','Série 3 E46','Série 3 E90','Série 3 F30','Série 3 G20','Série 4 F32','Série 4 G22','Série 5 E60','Série 5 F10','Série 5 G30','Série 7 F01','Série 7 G11','Série 7 G70','X1 E84','X1 F48','X1 U11','X2 F39','X2 U10','X3 E83','X3 F25','X3 G01','X4 F26','X4 G02','X5 E53','X5 E70','X5 F15','X5 G05','X6 E71','X6 F16','X6 G06','Z4 E85','Z4 E89','Z4 G29','M3','M5']
  },
  {
    id: 'mercedes', name: 'Mercedes-Benz',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="white" stroke="#ccc" stroke-width="0.5"/><circle cx="16" cy="16" r="11" fill="none" stroke="#888" stroke-width="0.8"/><line x1="16" y1="5" x2="16" y2="16" stroke="#222" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="16" x2="25.5" y2="21" stroke="#222" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="16" x2="6.5" y2="21" stroke="#222" stroke-width="2" stroke-linecap="round"/></svg>`,
    models: ['Classe A W168','Classe A W169','Classe A W176','Classe A W177','Classe B W245','Classe B W246','Classe B W247','Classe C W202','Classe C W203','Classe C W204','Classe C W205','Classe C W206','Classe E W210','Classe E W211','Classe E W212','Classe E W213','Classe S W220','Classe S W221','Classe S W222','Classe S W223','GLA 1','GLA 2','GLB','GLC 1','GLC 2','GLE 1','GLE 2','GLS 1','GLS 2','CLA 1','CLA 2','CLK W208','CLK W209','Vito W638','Vito W639','Vito W447','Sprinter 2','Sprinter 3','Citan']
  },
  {
    id: 'audi', name: 'Audi',
    logo: `<svg viewBox="0 0 58 22" fill="none"><rect width="58" height="22" rx="3" fill="#1A1A1A"/><circle cx="8" cy="11" r="8.5" stroke="#aaa" stroke-width="2" fill="none"/><circle cx="21" cy="11" r="8.5" stroke="#aaa" stroke-width="2" fill="none"/><circle cx="34" cy="11" r="8.5" stroke="#aaa" stroke-width="2" fill="none"/><circle cx="47" cy="11" r="8.5" stroke="#aaa" stroke-width="2" fill="none"/></svg>`,
    models: ['A1 8X','A1 GB','A3 8L','A3 8P','A3 8V','A3 8Y','A4 B5','A4 B6','A4 B7','A4 B8','A4 B9','A5 8T','A5 F5','A6 C5','A6 C6','A6 C7','A6 C8','A8 D2','A8 D3','A8 D4','A8 D5','Q2','Q3 8U','Q3 F3','Q5 8R','Q5 FY','Q7 4L','Q7 4M','Q8','TT 8N','TT 8J','TT 8S','R8','e-tron']
  },
  {
    id: 'honda', name: 'Honda',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#CC0000"/><path d="M10 22 L10 10 L13.5 10 L13.5 15 L18.5 15 L18.5 10 L22 10 L22 22 L18.5 22 L18.5 17.5 L13.5 17.5 L13.5 22 Z" fill="white"/></svg>`,
    models: ['Civic 7','Civic 8','Civic 9','Civic 10','Civic 11','Accord 7','Accord 8','Accord 9','Jazz 1','Jazz 2','Jazz 3','Jazz 4','CR-V 3','CR-V 4','CR-V 5','HR-V 1','HR-V 2','HR-V 3','City 5','City 6','City 7','CR-Z']
  },
  {
    id: 'mazda', name: 'Mazda',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#1B0000"/><path d="M16 8 C10 10 8 14 10 16 C8 18 10 22 16 24 C22 22 24 18 22 16 C24 14 22 10 16 8Z" fill="none" stroke="white" stroke-width="1.5"/><ellipse cx="16" cy="16" rx="4" ry="7" fill="white" opacity="0.9"/></svg>`,
    models: ['Mazda 2 DJ','Mazda 3 BK','Mazda 3 BL','Mazda 3 BM','Mazda 3 BP','Mazda 6 GH','Mazda 6 GJ','Mazda 6 GL','CX-3','CX-30','CX-5 1','CX-5 2','CX-60','MX-5 NC','MX-5 ND','BT-50','323']
  },
  {
    id: 'mitsubishi', name: 'Mitsubishi',
    logo: `<svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="4" fill="#E8001A"/><polygon points="6.5,10.5 16,5 25.5,10.5 16,16" fill="white" stroke="#E8001A" stroke-width="0.8"/><polygon points="25.5,10.5 25.5,21.5 16,27 16,16" fill="white" stroke="#E8001A" stroke-width="0.8"/><polygon points="16,27 6.5,21.5 6.5,10.5 16,16" fill="white" stroke="#E8001A" stroke-width="0.8"/></svg>`,
    models: ['Lancer 9','Lancer 10','Outlander 1','Outlander 2','Outlander 3','ASX 1','ASX 2','ASX 3','Eclipse Cross 1','Eclipse Cross 2','L200 4','L200 5','L300','Pajero 3','Pajero 4','Space Star','Galant']
  },
  {
    id: 'suzuki', name: 'Suzuki',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#1A3A8A"/><path d="M22 10Q19 7.5 15 8.5Q11 9.5 10 13.5Q9 17 11.5 19L22 21.5Q24.5 22 23.5 24.5Q22.5 27 19 27Q15.5 27 13.5 24.5" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>`,
    models: ['Swift 2','Swift 3','Swift 4','Vitara 3','Grand Vitara 2','Vitara 4','S-Cross 1','S-Cross 2','Jimny 3','Jimny 4','Baleno 2','Ignis 2','Alto','Celerio','SX4 1','SX4 S-Cross']
  },
  {
    id: 'volvo', name: 'Volvo',
    logo: `<svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="4" fill="#003E74"/><circle cx="14.5" cy="15.5" r="10.5" stroke="white" stroke-width="2" fill="none"/><path d="M22 8.5L28 3M22.5 3H28.5V9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    models: ['S40 2','S60 2','S60 3','S90 2','V40','V50','V60 1','V60 2','V70 3','V90 2','XC40','XC60 1','XC60 2','XC70','XC90 1','XC90 2']
  },
  {
    id: 'land-rover', name: 'Land Rover',
    logo: `<svg viewBox="0 0 52 26" fill="none"><rect x="1" y="1" width="50" height="24" rx="12" fill="#1A3A1A"/><rect x="1" y="1" width="50" height="24" rx="12" fill="none" stroke="#3A6A3A" stroke-width=".8"/><rect x="8" y="6" width="16" height="14" rx="2.5" fill="none" stroke="white" stroke-width="1.4"/><rect x="28" y="6" width="16" height="14" rx="2.5" fill="none" stroke="white" stroke-width="1.4"/><path d="M8 13h16M28 13h16" stroke="white" stroke-width=".6" opacity=".5"/></svg>`,
    models: ['Defender 1','Defender 2','Discovery 3','Discovery 4','Discovery 5','Freelander 1','Freelander 2','Range Rover 3','Range Rover 4','Range Rover 5','Range Rover Sport 1','Range Rover Sport 2','Range Rover Sport 3','Range Rover Evoque 1','Range Rover Evoque 2','Range Rover Velar']
  },
  {
    id: 'jeep', name: 'Jeep',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#2D2D2D"/><rect x="5" y="9" width="22" height="14" rx="2" fill="none" stroke="white" stroke-width="1.4"/><rect x="7.5" y="11" width="2.5" height="10" rx="1.2" fill="white"/><rect x="11.5" y="11" width="2.5" height="10" rx="1.2" fill="white"/><rect x="15.5" y="11" width="2.5" height="10" rx="1.2" fill="white"/><rect x="19.5" y="11" width="2.5" height="10" rx="1.2" fill="white"/></svg>`,
    models: ['Wrangler TJ','Wrangler JK','Wrangler JL','Cherokee XJ','Cherokee KJ','Cherokee KL','Grand Cherokee WK','Grand Cherokee WK2','Grand Cherokee WL','Compass 1','Compass 2','Renegade','Avenger']
  },
  {
    id: 'porsche', name: 'Porsche',
    logo: `<svg viewBox="0 0 32 32" fill="none"><path d="M16 2L28 8V24L16 30L4 24V8Z" fill="#1A1A1A" stroke="#B8960C" stroke-width="1.2"/><path d="M16 8L22 11V18L16 21L10 18V11Z" fill="#B8960C"/><path d="M10 11H22M10 14.5H22M10 18H22" stroke="#1A1A1A" stroke-width=".8"/><path d="M13 8.5L16 7L19 8.5" stroke="#B8960C" stroke-width=".8" fill="none"/></svg>`,
    models: ['911','Cayenne','Macan','Panamera','Taycan','718 Boxster','718 Cayman','Cayenne Coupé']
  },
  {
    id: 'alfa', name: 'Alfa Romeo',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#1A1A1A" stroke="#B8960C" stroke-width=".8"/><line x1="16" y1="1.5" x2="16" y2="30.5" stroke="#B8960C" stroke-width=".8" opacity=".7"/><rect x="1.5" y="7" width="14.5" height="18" fill="#C8102E"/><path d="M5 11V20M5 11H12M5 15.5H10" stroke="white" stroke-width="1.8" stroke-linecap="round"/><path d="M16.5 11C19 11 23 12.5 23 16C23 19.5 19 21 16.5 21" fill="none" stroke="#ccc" stroke-width="2"/><path d="M17.5 16C21 15 22.5 18.5 18.5 20" fill="#006B3F"/></svg>`,
    models: ['147','156','159','Giulietta','MiTo','Giulia','Stelvio','Tonale','Brera','Spider 916','4C']
  },
  {
    id: 'chevrolet', name: 'Chevrolet',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#C8A000"/><path d="M5 14 L11 14 L11 18 L14 18 L14 14 L27 14 L27 18 L24 18 L24 22 L5 22Z" fill="white" opacity="0.95"/></svg>`,
    models: ['Aveo T250','Aveo T300','Cruze 1','Cruze 2','Spark M300','Spark M400','Captiva 1','Captiva 2','Trax 1','Trax 2','Orlando','Lacetti','Nubira','Epica','Malibu 8','Malibu 9']
  },
  {
    id: 'jaguar', name: 'Jaguar',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#1A1A1A"/><path d="M8 13Q9 9 14 9Q18 9 20 12L22 10Q24 8 26 10Q27 12 25 14Q22 17 16 20Q14 21 12 23Q10 25 10 27Q8 24 9 21Q10 18 12 16" stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M20 12Q23 13 24 16" stroke="white" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>`,
    models: ['XE','XF','XJ','E-Pace','F-Pace','I-Pace','F-Type','XK']
  },
  {
    id: 'mini', name: 'MINI',
    logo: `<svg viewBox="0 0 40 24" fill="none"><circle cx="12" cy="12" r="11.5" fill="#1A1A1A" stroke="white" stroke-width="1.2"/><circle cx="12" cy="12" r="7" fill="none" stroke="white" stroke-width="1.5"/><circle cx="28" cy="12" r="11.5" fill="#1A1A1A" stroke="white" stroke-width="1.2"/><circle cx="28" cy="12" r="7" fill="none" stroke="white" stroke-width="1.5"/><rect x="12" y="9.5" width="16" height="5" fill="#1A1A1A"/></svg>`,
    models: ['One','Cooper','Cooper S','JCW','Clubman','Countryman','Paceman','Cabrio','Coupe','Roadster']
  },
  {
    id: 'isuzu', name: 'Isuzu',
    logo: `<svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="15" fill="#CC0000"/><path d="M9 10H23M9 16H19M9 22H23" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    models: ['D-Max','TFR','NPR','NKR','NQR','Trooper','Rodeo','Mu-X']
  },
];

/* ─── CATEGORIES ─── */
const CATEGORIES = [
  { id: 'feux-arriere', name: 'Feux Rouges',  icon: 'taillight', img: 'assets/categories/feux-arriere.png' },
  { id: 'portes',       name: 'Portes',       icon: 'door',      img: 'assets/categories/portes.png'       },
  { id: 'pare-chocs',   name: 'Pare-chocs',   icon: 'bumper',    img: 'assets/categories/pare-chocs.png'   },
  { id: 'ailes',        name: 'Ailes',        icon: 'fender',    img: 'assets/categories/ailes.png'        },
  { id: 'optiques',     name: 'Optiques',     icon: 'headlight', img: 'assets/categories/optiques.png'     },
  { id: 'retroviseurs', name: 'Rétroviseurs', icon: 'mirror',    img: 'assets/categories/retroviseurs.png' },
  { id: 'capots',       name: 'Capots',       icon: 'hood',      img: 'assets/categories/capots.png'       },
  { id: 'coffres',      name: 'Coffres',      icon: 'trunk',     img: 'assets/categories/coffres.png'      },
];

/* ─── PART ILLUSTRATIONS (SVG) ─── */
const PART_SVG = {
  tl:`<svg viewBox="0 0 120 80" fill="none"><rect x="3" y="3" width="114" height="74" rx="10" stroke="#CC0000" stroke-width="2" fill="#FFF5F5"/><rect x="8" y="8" width="48" height="64" rx="7" fill="#CC0000" opacity=".12" stroke="#CC0000" stroke-width="1.5"/><circle cx="32" cy="40" r="19" fill="#CC0000" opacity=".18"/><circle cx="32" cy="40" r="11" fill="#CC0000" opacity=".55"/><circle cx="32" cy="40" r="5" fill="#FF4444" opacity=".9"/><rect x="62" y="8" width="50" height="30" rx="6" fill="#CC0000" opacity=".3" stroke="#AA0000" stroke-width="1"/><rect x="62" y="42" width="50" height="30" rx="6" fill="#880000" opacity=".2" stroke="#880000" stroke-width="1"/></svg>`,
  hl:`<svg viewBox="0 0 120 80" fill="none"><path d="M4 10 L48 4 L58 10 L58 70 L48 76 L4 70 Z" fill="#F0F4FF" stroke="#6688CC" stroke-width="1.8"/><ellipse cx="31" cy="40" rx="19" ry="24" fill="#E0EAFF" stroke="#4466BB" stroke-width="1.5"/><circle cx="31" cy="40" r="11" fill="#FBBF24" opacity=".75"/><circle cx="31" cy="40" r="5" fill="white" opacity=".9"/><line x1="58" y1="40" x2="116" y2="40" stroke="#FBBF24" stroke-width="3.5" stroke-dasharray="9 5" opacity=".7"/><line x1="58" y1="28" x2="110" y2="18" stroke="#FBBF24" stroke-width="2" stroke-dasharray="7 4" opacity=".4"/><line x1="58" y1="52" x2="110" y2="62" stroke="#FBBF24" stroke-width="2" stroke-dasharray="7 4" opacity=".4"/></svg>`,
  fb:`<svg viewBox="0 0 120 80" fill="none"><rect x="3" y="22" width="114" height="44" rx="14" fill="#2A2A2A" stroke="#444" stroke-width="1.5"/><rect x="10" y="28" width="36" height="30" rx="5" fill="#3A3A3A" stroke="#555" stroke-width="1"/><rect x="74" y="28" width="36" height="30" rx="5" fill="#3A3A3A" stroke="#555" stroke-width="1"/><rect x="32" y="30" width="56" height="12" rx="6" fill="#333" stroke="#666" stroke-width="1"/><rect x="0" y="34" width="12" height="16" rx="4" fill="#222"/><rect x="108" y="34" width="12" height="16" rx="4" fill="#222"/></svg>`,
  rb:`<svg viewBox="0 0 120 80" fill="none"><rect x="3" y="14" width="114" height="50" rx="10" fill="#2A2A2A" stroke="#444" stroke-width="1.5"/><rect x="10" y="20" width="28" height="22" rx="4" fill="#8B1A1A" opacity=".85"/><rect x="82" y="20" width="28" height="22" rx="4" fill="#8B1A1A" opacity=".85"/><rect x="44" y="22" width="32" height="10" rx="5" fill="#6B1A1A" opacity=".8"/><rect x="38" y="52" width="44" height="8" rx="4" fill="#3A3A3A"/></svg>`,
  fen:`<svg viewBox="0 0 120 80" fill="none"><defs><linearGradient id="pfg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#E0E0E0"/><stop offset="100%" stop-color="#A8A8A8"/></linearGradient></defs><path d="M10 76 C10 36 32 10 112 4 L112 76 Z" fill="url(#pfg)" stroke="#999" stroke-width="1.5"/><path d="M10 76 C10 36 32 10 112 4" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2.5"/><path d="M30 76 C30 52 46 30 112 22 L112 76 Z" fill="rgba(255,255,255,.15)"/></svg>`,
  dr:`<svg viewBox="0 0 120 80" fill="none"><defs><linearGradient id="pdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#D8D8D8"/><stop offset="100%" stop-color="#B0B0B0"/></linearGradient></defs><rect x="6" y="4" width="108" height="72" rx="7" fill="url(#pdg)" stroke="#999" stroke-width="1.5"/><rect x="12" y="10" width="96" height="36" rx="5" fill="rgba(255,255,255,.3)" stroke="#CCC" stroke-width="1"/><rect x="14" y="12" width="92" height="30" rx="4" fill="rgba(180,220,255,.25)"/><circle cx="98" cy="54" r="5" fill="#888" stroke="#666" stroke-width="1.5"/><circle cx="98" cy="54" r="2.5" fill="#AAA"/></svg>`,
  mir:`<svg viewBox="0 0 120 80" fill="none"><defs><linearGradient id="pmg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#D0D0D0"/><stop offset="100%" stop-color="#989898"/></linearGradient></defs><path d="M20 8 C4 8 4 26 4 40 C4 54 4 72 20 72 L62 66 L62 14 Z" fill="url(#pmg)" stroke="#999" stroke-width="1.5"/><path d="M20 16 C9 18 8 30 8 40 C8 50 9 62 20 64 L56 60 L56 20 Z" fill="rgba(190,225,255,.45)" stroke="#BBB" stroke-width="1"/><path d="M62 14 L62 66 L88 60 L88 20 Z" fill="#C8C8C8" stroke="#AAA" stroke-width="1.5"/><rect x="86" y="34" width="22" height="12" rx="3" fill="#B8B8B8" stroke="#999" stroke-width="1"/></svg>`,
  hood:`<svg viewBox="0 0 120 80" fill="none"><defs><linearGradient id="phg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#DEDEDE"/><stop offset="100%" stop-color="#A8A8A8"/></linearGradient></defs><path d="M4 58 C7 24 28 8 60 4 C92 8 113 24 116 58 L116 70 Q60 76 4 70 Z" fill="url(#phg)" stroke="#999" stroke-width="1.5"/><path d="M4 58 C7 24 28 8 60 4 C92 8 113 24 116 58" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2.5"/><path d="M20 60 C22 36 36 18 60 14 C84 18 98 36 100 60" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1.5"/></svg>`,
  trunk:`<svg viewBox="0 0 120 80" fill="none"><defs><linearGradient id="ptg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#D8D8D8"/><stop offset="100%" stop-color="#A8A8A8"/></linearGradient></defs><rect x="4" y="6" width="112" height="68" rx="8" fill="url(#ptg)" stroke="#999" stroke-width="1.5"/><path d="M4 26 L116 26" stroke="#BBB" stroke-width="1.5"/><path d="M8 8 C8 8 60 14 112 8" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2"/><rect x="44" y="62" width="32" height="8" rx="4" fill="#999" stroke="#888" stroke-width="1"/></svg>`,
  gr:`<svg viewBox="0 0 120 80" fill="none"><rect x="4" y="4" width="112" height="72" rx="7" fill="#F5F5F5" stroke="#CCC" stroke-width="1.5"/><line x1="4" y1="22" x2="116" y2="22" stroke="#DDD" stroke-width="2"/><line x1="4" y1="40" x2="116" y2="40" stroke="#DDD" stroke-width="2"/><line x1="4" y1="58" x2="116" y2="58" stroke="#DDD" stroke-width="2"/><line x1="30" y1="4" x2="30" y2="76" stroke="#DDD" stroke-width="1.5"/><line x1="60" y1="4" x2="60" y2="76" stroke="#DDD" stroke-width="1.5"/><line x1="90" y1="4" x2="90" y2="76" stroke="#DDD" stroke-width="1.5"/></svg>`,
  gl:`<svg viewBox="0 0 120 80" fill="none"><rect x="4" y="4" width="112" height="72" rx="8" fill="#D6EAF8" opacity=".7" stroke="#AED6F1" stroke-width="2"/><path d="M4 30 Q60 50 116 30" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/><path d="M4 50 Q60 70 116 50" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.5"/></svg>`,
  fc:`<svg viewBox="0 0 120 80" fill="none"><rect x="18" y="8" width="84" height="64" rx="12" fill="#F0F0F0" stroke="#CCC" stroke-width="1.5"/><rect x="26" y="16" width="68" height="48" rx="8" fill="#E8E8E8" stroke="#BBB" stroke-width="1"/><circle cx="60" cy="40" r="16" fill="#DDD" stroke="#AAA" stroke-width="1.5"/><circle cx="60" cy="40" r="8" fill="#CCC"/></svg>`,
  sp:`<svg viewBox="0 0 120 80" fill="none"><path d="M4 68 L10 36 L110 36 L116 68 Z" fill="#E8E8E8" stroke="#BBB" stroke-width="1.5"/><path d="M10 36 L18 20 L102 20 L110 36" fill="#F0F0F0" stroke="#CCC" stroke-width="1.5"/><rect x="4" y="66" width="112" height="8" rx="4" fill="#CCC"/></svg>`,
  rad:`<svg viewBox="0 0 120 80" fill="none"><rect x="4" y="4" width="112" height="72" rx="6" fill="#F5F5F5" stroke="#CCC" stroke-width="1.5"/><line x1="22" y1="4" x2="22" y2="76" stroke="#CCC" stroke-width="2"/><line x1="40" y1="4" x2="40" y2="76" stroke="#CCC" stroke-width="2"/><line x1="58" y1="4" x2="58" y2="76" stroke="#CCC" stroke-width="2"/><line x1="76" y1="4" x2="76" y2="76" stroke="#CCC" stroke-width="2"/><line x1="94" y1="4" x2="94" y2="76" stroke="#CCC" stroke-width="2"/></svg>`,
};

/* ─── CATEGORY ICONS ─── */
const CAT_ICON = {
  bumper:   (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="14" width="36" height="16" rx="8"/><line x1="12" y1="22" x2="14" y2="22"/><line x1="30" y1="22" x2="32" y2="22"/><path d="M8 14 L8 10 M36 14 L36 10"/></svg>`,
  door:     (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="4" width="28" height="36" rx="3"/><rect x="12" y="8" width="20" height="12" rx="2"/><circle cx="30" cy="26" r="2"/></svg>`,
  fender:   (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 38 C6 16 18 6 40 4 L40 38 Z"/><circle cx="16" cy="36" r="5"/></svg>`,
  headlight:(a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8 L22 4 L28 8 L28 36 L22 40 L4 36 Z"/><ellipse cx="16" cy="22" rx="8" ry="10"/><circle cx="16" cy="22" r="4"/><line x1="28" y1="22" x2="40" y2="22"/><line x1="28" y1="16" x2="38" y2="12"/><line x1="28" y1="28" x2="38" y2="32"/></svg>`,
  taillight:(a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="10" width="32" height="24" rx="6"/><rect x="8" y="12" width="14" height="20" rx="4" stroke="${a?'#FF453A':'#FF453A'}" opacity="${a?'1':'.5'}"/><circle cx="15" cy="22" r="5" stroke="${a?'#FF453A':'#FF453A'}" opacity="${a?'1':'.5'}"/></svg>`,
  hood:     (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 30 C4 14 14 6 22 4 C30 6 40 14 42 30"/><rect x="2" y="30" width="40" height="6" rx="3"/></svg>`,
  radiator: (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="36" height="28" rx="4"/><line x1="12" y1="8" x2="12" y2="36"/><line x1="20" y1="8" x2="20" y2="36"/><line x1="28" y1="8" x2="28" y2="36"/><line x1="36" y1="8" x2="36" y2="36"/></svg>`,
  glass:    (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 34 L4 10 L40 10 L36 34 Z"/><line x1="4" y1="10" x2="40" y2="10"/><path d="M10 20 Q22 26 34 20"/></svg>`,
  mirror:   (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8 C2 8 2 20 2 22 C2 24 2 36 6 36 L24 32 L24 12 Z"/><path d="M24 12 L24 32 L36 28 L36 16 Z"/></svg>`,
  trunk:    (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="36" height="28" rx="4"/><path d="M4 18 L40 18"/><rect x="17" y="30" width="10" height="4" rx="2"/></svg>`,
  radio:    (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="36" height="24" rx="4"/><rect x="8" y="14" width="20" height="16" rx="2"/><circle cx="34" cy="18" r="3"/><circle cx="34" cy="28" r="2"/></svg>`,
  seat:     (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6 L8 26 Q8 32 14 32 L30 32 Q36 32 36 26 L36 6"/><path d="M8 32 L8 38"/><path d="M36 32 L36 38"/><path d="M6 6 L38 6"/></svg>`,
  acc:      (a) => `<svg viewBox="0 0 44 44" fill="none" stroke="${a?'#0A84FF':'#8E8E93'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="22" cy="22" r="16"/><circle cx="22" cy="22" r="6"/><line x1="22" y1="6" x2="22" y2="14"/><line x1="22" y1="30" x2="22" y2="38"/><line x1="6" y1="22" x2="14" y2="22"/><line x1="30" y1="22" x2="38" y2="22"/></svg>`,
};
