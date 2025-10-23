import { PRIORITY_COLORS } from './constants';

export const getPriorityValue = label => {
  return PRIORITY_COLORS.find(item => item.label === label)?.value;
};

export const getPriorityLabel = value => {
  return PRIORITY_COLORS.find(item => item.value === value)?.label;
};

export const getPriorityColorByTheme = (label, theme = 'Light') => {
  const priority = PRIORITY_COLORS.find(item => item.label === label);
  if (!priority) return null;

  return theme === 'Dark' && priority.darkValue ? priority.darkValue : priority.value;
};

export const getAllPriorityLabels = () => {
  return PRIORITY_COLORS.map(item => item.label);
};

export const getAllPriorityValues = () => {
  return PRIORITY_COLORS.map(item => item.value);
};
