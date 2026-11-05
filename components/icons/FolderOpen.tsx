import React from 'react';

const FolderOpen: React.FC<{ className?: string; width?: string }> = (props) => {
  return (
    <svg
      width={props.width || '20'}
      className={`${props.className}`}
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M17.6552 11.821L17.3385 15.7793C17.2198 16.9906 17.1248 17.9168 14.9794 17.9168H5.02019C2.87477 17.9168 2.77977 16.9906 2.66102 15.7793L2.34436 11.821C2.28102 11.1639 2.48686 10.5543 2.85894 10.0872C2.86686 10.0793 2.86686 10.0793 2.87477 10.0714C3.31019 9.541 3.96727 9.2085 4.70352 9.2085H15.296C16.0323 9.2085 16.6814 9.541 17.1089 10.0556C17.1169 10.0635 17.1248 10.0714 17.1248 10.0793C17.5127 10.5464 17.7264 11.156 17.6552 11.821Z'
        stroke='#292D32'
        strokeMiterlimit='10'
      />
      <path
        d='M3.27051 9.5486V5.47152C3.27051 2.77985 3.94342 2.10693 6.63509 2.10693H7.64051C8.64593 2.10693 8.87551 2.40777 9.25551 2.91443L10.2609 4.26027C10.5143 4.59277 10.6647 4.7986 11.3376 4.7986H13.3563C16.048 4.7986 16.7209 5.47152 16.7209 8.16318V9.58027'
        stroke='#292D32'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M7.96582 13.9585H12.035'
        stroke='#292D32'
        strokeMiterlimit='10'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default FolderOpen;
