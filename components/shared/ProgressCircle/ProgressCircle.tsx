import { CSSProperties } from 'react';

const ProgressCircle = (props: {
  progress: number;
  baseColor: CSSProperties['color'];
  fillColor: CSSProperties['color'];
  content?: string;
  children?: React.ReactNode;
  size?: number;
  innerSize?: number;
  borderWidth?: number;
  hideContent?: boolean;
}) => {
  return (
    <section
      className='relative w-11 h-11 flex items-center justify-center'
      style={
        props.size
          ? {
              width: `${props.size + (props.borderWidth || 0.25)}rem`,
              height: `${props.size + (props.borderWidth || 0.25)}rem`,
            }
          : {}
      }
    >
      <div
        className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[#394049] z-20 bg-white'
        style={
          props.innerSize ? { width: `${props.innerSize}rem`, height: `${props.innerSize}rem` } : {}
        }
      >
        {!props.hideContent &&
          (props.content || props.children
            ? props.content ?? props.children
            : `${props.progress}%`)}
      </div>
      <div
        className='inset-0 rounded-full absolute z-0 border-white'
        style={{
          backgroundImage: `conic-gradient(${props.fillColor} ${props.progress}%, ${props.baseColor} 0)`,
        }}
      />
    </section>
  );
};

export default ProgressCircle;
