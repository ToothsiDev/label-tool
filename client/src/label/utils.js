export const colorMapping = {
  red: '#B03060',
  orange: '#FE9A76',
  yellow: '#FFD700',
  olive: '#32CD32',
  green: '#016936',
  teal: '#008080',
  blue: '#0E6EB8',
  violet: '#EE82EE',
  purple: '#B413EC',
  pink: '#FF1493',
  brown: '#A52A2A',
  gray: '#A0A0A0',
  black: '#000000',
};

export function convertPoint(p) {
  return {
    lat: p.lat,
    lng: p.lng,
  };
}

export function lighten(col, amt) {
  let usePound = false;
  if (col[0] === '#') {
    col = col.slice(1);
    usePound = true;
  }
  const num = parseInt(col, 16);
  let r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00ff) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  let g = (num & 0x0000ff) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
}

export function genId() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

export const shortcuts = '1234567890qwe';
export const colors = [
  'red',
  'blue',
  'green',
  'violet',
  'orange',
  'brown',
  'yellow',
  'olive',
  'teal',
  'purple',
  'pink',
  'black',
];

export const gradeArr = [
  'Grade 1: No malocclusions observed',
  'Grade 2: Extremely minor malocclusions, including contact point displacements less than 1 mm (No overbite, overjet, crossbite or craniofacial anomalies observed)',
  'Grade 3: Minor malocclusions which can be corrected by moving one or two teeth slightly (No overbite,overjet, crossbite or craniofacial anomalies observed)',
  'Grade 4: Mild malocclusions which can be corrected by moving several teeth (less than 6) slightly (No overbite, overjet, crossbite or craniofacial anomalies observed)',
  'Grade 5: Mild malocclusions which can be corrected by moving serveral teeth together (No overbite, overjet, crossbite or craniofacial anomalies observed)',
  'Grade 6: Moderate malocclusions which can be corrected by moving one or two teeth deeply / Moderate contact point displacements (>2mm and < 6mm) / Little or mild overbite, overjet or crossbite',
  'Grade 7: Moderate malocclusions which can be corrected by moving several teeth (less than 6) deeply / Moderate overbite, overjet or crossbite which can be corrected by othodontics only',
  'Grade 8: Severe malocclusions which can be corrected by moving several teeth together deeply / Increased and complete overbite with gingival or palatal trauma',
  'Grade 9: Severe malocclusions which requires moving almost all teeth together. / Severe contact point displacements. / Extreme lateral or anterior open bites. / Possible craniofacial anomalies observed',
  'Grade 10: Mixed of different malocclusions. (Impeded eruption of teeth due to crowding, displacement, the presence of supernumerary teeth, retained deciduous teeth, and any pathologic cause./ Extensive hypodon-tia with restorative implications requiring preprosthetic orthodontics. /Complete overbite/ Submerged deciduous teeth/ Craniofacial anomalies',
];
