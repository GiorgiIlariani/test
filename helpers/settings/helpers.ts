export const settingsValues = {
  department: {
    isOpen: true,
    title: 'Departments',
    name: 'department',
    icon: '💼',
    tableHeading: 'Department name',
    showToggle: true,
    toggleInputName: 'is_billable',
    buttonTxt: 'Add a new department',
  },
  titles: {
    isOpen: true,
    title: 'Job titles',
    name: 'titles',
    icon: '👩‍💻',
    tableHeading: 'Titles',
    showToggle: true,
    toggleInputName: 'seniority_applicable',
    buttonTxt: 'Add a new job title',
  },
  seniority: {
    isOpen: true,
    title: 'Seniority',
    name: 'seniority',
    icon: '👔',
    tableHeading: 'Seniorities',
    showToggle: false,
    buttonTxt: 'Add a new seniority',
  },
  skills: {
    isOpen: true,
    title: 'Skills',
    name: 'skills',
    icon: '🧠',
    tableHeading: 'Skills',
    showToggle: false,
    buttonTxt: 'Add a new skill',
  },
};

export const getLocationDropDownHeight = (list: string[], defaultHeight: number | undefined) => {
  let height = list?.length * 45;
  let startHeight = defaultHeight ?? 300;
  if (height > startHeight) {
    return startHeight;
  } else {
    return height;
  }
};
