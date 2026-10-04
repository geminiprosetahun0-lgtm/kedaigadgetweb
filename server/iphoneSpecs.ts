export interface ModelConfig {
  id: string;
  name: string;
  series: string; // '17' | '16' | '15' | '14' | '13' | '12' | '11' | 'X' | 'SE' | '8'
  storages: string[];
}

export const IPHONE_MODELS: Record<string, ModelConfig> = {
  // iPhone 17 Series
  '17pm': { id: '17pm', name: 'iPhone 17 Pro Max', series: '17', storages: ['256 GB', '512 GB', '1 TB', '2 TB'] },
  '17p': { id: '17p', name: 'iPhone 17 Pro', series: '17', storages: ['256 GB', '512 GB', '1 TB'] },
  '17air': { id: '17air', name: 'iPhone 17 Air / Slim', series: '17', storages: ['128 GB', '256 GB', '512 GB'] },
  '17base': { id: '17base', name: 'iPhone 17', series: '17', storages: ['128 GB', '256 GB', '512 GB'] },

  // iPhone 16 Series
  '16pm': { id: '16pm', name: 'iPhone 16 Pro Max', series: '16', storages: ['256 GB', '512 GB', '1 TB'] },
  '16p': { id: '16p', name: 'iPhone 16 Pro', series: '16', storages: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  '16plus': { id: '16plus', name: 'iPhone 16 Plus', series: '16', storages: ['128 GB', '256 GB', '512 GB'] },
  '16base': { id: '16base', name: 'iPhone 16', series: '16', storages: ['128 GB', '256 GB', '512 GB'] },

  // iPhone 15 Series
  '15pm': { id: '15pm', name: 'iPhone 15 Pro Max', series: '15', storages: ['256 GB', '512 GB', '1 TB'] },
  '15p': { id: '15p', name: 'iPhone 15 Pro', series: '15', storages: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  '15plus': { id: '15plus', name: 'iPhone 15 Plus', series: '15', storages: ['128 GB', '256 GB', '512 GB'] },
  '15base': { id: '15base', name: 'iPhone 15', series: '15', storages: ['128 GB', '256 GB', '512 GB'] },

  // iPhone 14 Series
  '14pm': { id: '14pm', name: 'iPhone 14 Pro Max', series: '14', storages: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  '14p': { id: '14p', name: 'iPhone 14 Pro', series: '14', storages: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  '14plus': { id: '14plus', name: 'iPhone 14 Plus', series: '14', storages: ['128 GB', '256 GB', '512 GB'] },
  '14base': { id: '14base', name: 'iPhone 14', series: '14', storages: ['128 GB', '256 GB', '512 GB'] },

  // iPhone 13 Series
  '13pm': { id: '13pm', name: 'iPhone 13 Pro Max', series: '13', storages: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  '13p': { id: '13p', name: 'iPhone 13 Pro', series: '13', storages: ['128 GB', '256 GB', '512 GB', '1 TB'] },
  '13base': { id: '13base', name: 'iPhone 13', series: '13', storages: ['128 GB', '256 GB', '512 GB'] },
  '13mini': { id: '13mini', name: 'iPhone 13 mini', series: '13', storages: ['128 GB', '256 GB', '512 GB'] },

  // iPhone 12 Series
  '12pm': { id: '12pm', name: 'iPhone 12 Pro Max', series: '12', storages: ['128 GB', '256 GB', '512 GB'] },
  '12p': { id: '12p', name: 'iPhone 12 Pro', series: '12', storages: ['128 GB', '256 GB', '512 GB'] },
  '12base': { id: '12base', name: 'iPhone 12', series: '12', storages: ['64 GB', '128 GB', '256 GB'] },
  '12mini': { id: '12mini', name: 'iPhone 12 mini', series: '12', storages: ['64 GB', '128 GB', '256 GB'] },

  // iPhone 11 Series
  '11pm': { id: '11pm', name: 'iPhone 11 Pro Max', series: '11', storages: ['64 GB', '256 GB', '512 GB'] },
  '11p': { id: '11p', name: 'iPhone 11 Pro', series: '11', storages: ['64 GB', '256 GB', '512 GB'] },
  '11base': { id: '11base', name: 'iPhone 11', series: '11', storages: ['64 GB', '128 GB', '256 GB'] },

  // iPhone X / XS / XR
  'xsmax': { id: 'xsmax', name: 'iPhone XS Max', series: 'X', storages: ['64 GB', '256 GB', '512 GB'] },
  'xs': { id: 'xs', name: 'iPhone XS', series: 'X', storages: ['64 GB', '256 GB', '512 GB'] },
  'xr': { id: 'xr', name: 'iPhone XR', series: 'X', storages: ['64 GB', '128 GB', '256 GB'] },
  'x': { id: 'x', name: 'iPhone X', series: 'X', storages: ['64 GB', '256 GB'] },

  // iPhone SE & 8 Series
  'se3': { id: 'se3', name: 'iPhone SE (Gen 3)', series: 'SE', storages: ['64 GB', '128 GB', '256 GB'] },
  'se2': { id: 'se2', name: 'iPhone SE (Gen 2)', series: 'SE', storages: ['64 GB', '128 GB', '256 GB'] },
  '8plus': { id: '8plus', name: 'iPhone 8 Plus', series: '8', storages: ['64 GB', '128 GB', '256 GB'] },
  '8base': { id: '8base', name: 'iPhone 8', series: '8', storages: ['64 GB', '128 GB', '256 GB'] },
};

export const SERIES_LIST = [
  { id: '17', label: 'iPhone 17 Series', models: ['17pm', '17p', '17air', '17base'] },
  { id: '16', label: 'iPhone 16 Series', models: ['16pm', '16p', '16plus', '16base'] },
  { id: '15', label: 'iPhone 15 Series', models: ['15pm', '15p', '15plus', '15base'] },
  { id: '14', label: 'iPhone 14 Series', models: ['14pm', '14p', '14plus', '14base'] },
  { id: '13', label: 'iPhone 13 Series', models: ['13pm', '13p', '13base', '13mini'] },
  { id: '12', label: 'iPhone 12 Series', models: ['12pm', '12p', '12base', '12mini'] },
  { id: '11', label: 'iPhone 11 Series', models: ['11pm', '11p', '11base'] },
  { id: 'X', label: 'iPhone X / XS / XR', models: ['xsmax', 'xs', 'xr', 'x'] },
  { id: 'SE', label: 'iPhone SE Series', models: ['se3', 'se2'] },
  { id: '8', label: 'iPhone 8 / 8 Plus', models: ['8plus', '8base'] },
];
