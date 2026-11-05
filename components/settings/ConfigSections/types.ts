import { ListType, SectionNames, SetState } from 'types';
import { SectionLoadStatus } from '../SettingDropdownSection/useSettingDropdownSection';

export type Props = {
  activeSection: SectionNames;
  setActiveSection: SetState<SectionNames>;
  setNotResponseError: SetState<boolean>;
};

export type DeleteFieldTarget = {
  id: number;
  name: string;
  label: string;
};

export type SaveFieldInput = {
  id?: number;
  parentId?: number;
  title: string;
  enabled?: boolean;
};

export type SaveSeniorityInput = SaveFieldInput;

export type DepartmentTableDragArgs = {
  search: string;
  onReorder: (fromIndex: number, toIndex: number) => void;
};

export type SectionProps = {
  fields: ListType[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onDelete: (field: DeleteFieldTarget) => void;
  onSave?: (input: SaveFieldInput) => Promise<void>;
  onReorderChild?: (
    sourceParentIndex: number,
    destinationParentIndex: number,
    fromIndex: number,
    toIndex: number,
  ) => void;
  loading: boolean;
};

export type Args = {
  setActiveSection: SetState<SectionNames>;
  sectionStatus: Record<SectionNames, SectionLoadStatus>;
  retrySection: (section: SectionNames) => void;
};
