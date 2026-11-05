import { ErrorModal, ExclamationCircle } from 'components';
import { ErrorModalProps } from './types';

const StaffingErrorModal = (props: ErrorModalProps) => (
  <ErrorModal
    confirmText='Yes, Delete'
    modalMessage={`Are you sure you want to delete ${props.employeeDeleteModal.first_name} 
from this term? All logged hours associated with ${props.employeeDeleteModal.first_name}
 will be deleted from all tracked weeks.`}
    modalTitle='Remove Employee'
    confirmButtonColor='bg-red-600'
    confirmButtonFocusColor='focus:ring-red-500'
    confirmButtonHoverColor='hover:bg-red-700'
    icon={<ExclamationCircle size='24' />}
    iconBackgroundColor='bg-red-100'
    closeHandler={() =>
      props.setEmployeeDeleteModal({
        isOpen: false,
        index: 0,
        employee_id: 0,
        first_name: '',
      })
    }
    confirmFunction={() => {
      props.removeTerm(props.employeeDeleteModal.index, props.employeeDeleteModal.employee_id);
      props.setEmployeeDeleteModal({
        isOpen: false,
        index: 0,
        employee_id: 0,
        first_name: '',
      });
    }}
  />
);

export default StaffingErrorModal;
