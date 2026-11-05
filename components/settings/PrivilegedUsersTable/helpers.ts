export const TABLE_HEADS: { label: string }[] = [
  { label: 'Name' },
  { label: 'Role' },
  { label: 'Status' },
  { label: '' },
];

const ROLE_BADGE_STYLES = [
  'bg-indigo-50 text-indigo-900',
  'bg-sky-50 text-sky-900',
  'bg-violet-50 text-violet-900',
  'bg-teal-50 text-teal-900',
  'bg-orange-50 text-orange-900',
  'bg-pink-50 text-pink-900',
];

export const getRoleBadgeStyle = (role: string) => {
  const hash = [...(role ?? '')].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ROLE_BADGE_STYLES[hash % ROLE_BADGE_STYLES.length];
};
