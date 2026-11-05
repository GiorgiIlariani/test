import React from 'react';

const Loader = (props: { size: string; border: string }) => {
  const loaderStyle = {
    width: props.size ?? '48px',
    height: props.size ?? '48px',
    borderRadius: '50%',
    display: 'inline-block',
    borderTop: `${props.border ?? '4px'} solid #4FE8E8`,
    borderRight: `${props.border ?? '4px'} solid transparent`,
    boxSizing: 'border-box'!,
    animation: 'rotation 1s linear infinite',
    position: 'relative',
  } as any;

  const afterStyle = {
    content: "''",
    boxSizing: 'border-box',
    position: 'absolute',
    left: '0',
    top: '0',
    width: props.size ?? '48px',
    height: props.size ?? '48px',
    borderRadius: '50%',
    borderBottom: `${props.border ?? '4px'} solid #9195F6`,
    borderLeft: `${props.border ?? '4px'} solid transparent`,
  } as any;

  const keyframesStyle = `
    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <div className='flex'>
      <style>{keyframesStyle}</style>
      <div style={loaderStyle}>
        <div style={afterStyle}></div>
      </div>
    </div>
  );
};

export default Loader;
