import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../Select';
import { ControlledSelectProps } from './types';

const ControlledSelect: React.FC<ControlledSelectProps> = ({
  items,
  value,
  onValueChange,
  placeholder,
  renderValue,
  valueClassName,
  triggerClassName,
  contentClassName,
  triggerId,
  size,
  side,
  align,
  alignItemWithTrigger = false,
  chevronInheritsColor,
  hideChevron,
  ...selectProps
}) => {
  return (
    <Select
      {...selectProps}
      items={items}
      value={value}
      onValueChange={(selectedValue) => onValueChange(selectedValue as string | number)}
    >
      <SelectTrigger
        id={triggerId}
        size={size}
        chevronInheritsColor={chevronInheritsColor}
        hideChevron={hideChevron}
        className={triggerClassName}
      >
        <SelectValue className={valueClassName} placeholder={placeholder}>
          {renderValue}
        </SelectValue>
      </SelectTrigger>

      <SelectContent
        side={side}
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        className={contentClassName}
      >
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ControlledSelect;
