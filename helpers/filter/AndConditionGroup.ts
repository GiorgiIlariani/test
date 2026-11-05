import Condition from 'helpers/filter/Condition';
import {
  Budgeting,
  Candidate,
  Department,
  Employee,
  EmployeeVacations,
  PrivilegedUsers,
  ProjectDashboard,
  RejectedCandidates,
  Skill,
  VacationsArray,
} from 'types';
import BracketCondition from 'helpers/filter/BracketCondition';
import { FilterableArrays } from './types';
import { objectKeys } from 'helpers/typescriptUtils';

class AndConditionGroup {
  constructor() {
    this.conditions = [];
  }

  conditions: Condition[];

  /**
   *filters array based on conditionsproject
   *
   * @param filterable
   * @returns {FilterableArrays}
   */
  filterArray(filterable: FilterableArrays) {
    const [{ category }] = this.conditions;
    const ids = this.conditions.map((el) => el.id);

    const dateFilters = this.conditions.filter((el) => el.filter_type === 'date');
    return (filterable as any[]).filter((filterable: Candidate | Employee) => {
      if (category == 'skills') {
        return AndConditionGroup.determineIfFilterableHasAllTheSkills(filterable, ids);
      } else if (category == 'department') {
        return AndConditionGroup.determineIfFilterableHasAllTheDepartment(
          filterable as Employee,
          ids,
        );
      } else if (category == 'seniority') {
        return AndConditionGroup.determineIfFilterableHasSeniorityLevels(filterable, ids);
      } else if (category == 'job_title') {
        return AndConditionGroup.determineIfFilterableHasPositions(filterable, ids);
      } else if (category == 'employee' || category == 'candidate' || category == 'project') {
        return AndConditionGroup.determineIfFilterableIs(filterable, ids);
      } else if (category == 'rejected_candidate') {
      } else if (category == 'project_budget') {
        return AndConditionGroup.determineIfFilterableIsBudgetProject(filterable as Budgeting, ids);
      } else if (category == 'rejected_candidate') {
      } else if (category == 'budget') {
        return AndConditionGroup.determineIfFilterableHasTitle(filterable as Budgeting, ids);
      } else if (category == 'rejected_candidate') {
        return AndConditionGroup.determineIfFilterableIsRejected(
          filterable as RejectedCandidates,
          ids,
        );
      } else if (category == 'rejected_by') {
        return AndConditionGroup.determineIfFilterableIsRejectedByUs(
          filterable as RejectedCandidates,
          ids,
        );
      } else if (category == 'assigned_to') {
        return AndConditionGroup.determineIfFilterableHasRecruiter(filterable as Candidate, ids);
      } else if (category == 'project_owners') {
        return AndConditionGroup.determineIfFilterableHasOwner(filterable as ProjectDashboard, ids);
      } else if (category == 'budget_project_owners') {
        return AndConditionGroup.determineIfFilterableBudgetHasProjectOwner(
          filterable as Budgeting,
          ids,
        );
      } else if (category == 'term_status') {
        return AndConditionGroup.determineIfFilterableHasTerms(filterable as ProjectDashboard, ids);
      } else if (category == 'project_date' && dateFilters.length) {
        return AndConditionGroup.determineIfFilterableIsActiveBetweenDates(
          filterable as ProjectDashboard,
          dateFilters,
        );
      } else if (category == 'rejected_at' && dateFilters.length) {
        return AndConditionGroup.determineIfFilterableRejectedCandidatesIsActiveBetweenDates(
          filterable as RejectedCandidates,
          dateFilters,
        );
      } else if (category === 'hr_interview_date' && dateFilters.length) {
        return AndConditionGroup.determineIfFilterableHrInterviewIsBetweenDates(
          filterable as Candidate,
          dateFilters,
        );
      } else if (category === 'approval_status') {
        return AndConditionGroup.determineIfFilterableHasVacationApprovalStatus(
          filterable as VacationsArray,
          ids,
        );
      } else if (category === 'excluded_from_invoice') {
        return AndConditionGroup.determineIfFilterableVacationWasExcludedFromInvoice(
          filterable as VacationsArray,
          ids,
        );
      } else if (category === 'vacation_type') {
        return AndConditionGroup.determineIfFilterableHasVacationType(
          filterable as VacationsArray,
          ids,
        );
      } else if (category === 'role') {
        return AndConditionGroup.determineIfFilterableHasRole(filterable as PrivilegedUsers, ids);
      } else if (category === 'email') {
        return AndConditionGroup.determineIfFilterableHasEmail(filterable as PrivilegedUsers, ids);
      } else if (category === 'vacation_projects') {
        return AndConditionGroup.determineIfFilterableHasProjects(
          filterable as EmployeeVacations,
          ids,
        );
      } else if (category === 'project_members') {
        return AndConditionGroup.determineIfFilterableHasProjectMembers(
          filterable as ProjectDashboard,
          ids,
        );
      } else if (category === 'project_type') {
        return AndConditionGroup.determineIfFilterableHasProjectStatus(
          filterable as ProjectDashboard,
          ids,
        );
      }
    });
  }

  static groupConditionsWithAndOperator = (conditions: Condition[]) => {
    const bracketCondition = new BracketCondition();

    for (let i = 0; i < conditions.length; i++) {
      bracketCondition.append(conditions[i]);

      if (conditions[i].conditionOperator == 'OR') {
        bracketCondition.addGroup();
      }
    }

    return bracketCondition;
  };

  static determineIfFilterableHasProjectStatus = (
    filterable: ProjectDashboard,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.type === filterableId;
    });
  };

  static determineIfFilterableHasAllTheSkills = (
    filterable: {
      skills?: Skill[];
    },
    skillIds: (number | string)[],
  ) => {
    return skillIds.every(function (skillId) {
      const employeeSkillsIds = filterable.skills?.map((el) => el.id) || [];
      return employeeSkillsIds.includes(+skillId);
    });
  };

  static determineIfFilterableHasAllTheDepartment = (
    filterable: {
      department: Department;
    },
    departmentIds: (number | string)[],
  ) => {
    return departmentIds.every(function (departmentId) {
      return filterable.department?.id == departmentId;
    });
  };

  static determineIfFilterableHasSeniorityLevels = (
    filterable: Employee | Candidate | ProjectDashboard,
    seniorityIds: (number | string)[],
  ) => {
    return seniorityIds.every(function (seniorityId) {
      return (
        ((filterable as Employee).seniority &&
          (filterable as Employee).seniority.id == seniorityId) ||
        (filterable as Candidate).seniority_id == seniorityId
      );
    });
  };

  static determineIfFilterableHasPositions = (
    filterable: Employee | Candidate | ProjectDashboard,
    positionIds: (number | string)[],
  ) => {
    return positionIds.every((positionId) => {
      return (
        ((filterable as Employee).position &&
          (filterable as Employee).position?.id == positionId) ||
        (filterable as Candidate).position_id == positionId
      );
    });
  };

  static determineIfFilterableHasRecruiter = (
    filterable: Candidate | RejectedCandidates,
    recruiterIds: (number | string)[],
  ) => {
    return recruiterIds.every((recruiterId) => {
      return (
        (filterable as Candidate).recruiter_id == recruiterId ||
        ((filterable as RejectedCandidates).assigned_to &&
          (filterable as RejectedCandidates).assigned_to.id == recruiterId)
      );
    });
  };

  static determineIfFilterableIs = (
    filterable: Candidate | Employee | ProjectDashboard,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.id == filterableId;
    });
  };
  static determineIfFilterableHasTitle = (
    filterable: Budgeting,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.title?.toLocaleLowerCase() == filterableId;
    });
  };

  static determineIfFilterableIsBudgetProject = (
    filterable: Budgeting,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable?.internal_project_id == filterableId;
    });
  };

  static determineIfFilterableIsRejected = (
    filterable: RejectedCandidates,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.candidate_id == filterableId;
    });
  };

  static determineIfFilterableIsRejectedByUs = (
    filterable: RejectedCandidates,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.rejected_by == filterableId;
    });
  };

  static determineIfFilterableHasOwner = (
    filterable: ProjectDashboard,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.owner_id == filterableId;
    });
  };

  static determineIfFilterableHasEmployees = (
    filterable: ProjectDashboard,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      if (typeof filterable.employee_ids === 'object') {
        return objectKeys(filterable.employee_ids)
          ?.map((index) => filterable.employee_ids[index])
          ?.includes(+filterableId);
      } else {
        return objectKeys(filterable.employee_ids)?.includes(+filterableId);
      }
    });
  };

  static determineIfFilterableBudgetHasProjectOwner = (
    filterable: Budgeting,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.project?.owner_id == filterableId;
    });
  };

  static determineIfFilterableHasTerms = (
    filterable: ProjectDashboard,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.terms.some((term) => {
        return term.status === filterableId;
      });
    });
  };

  static determineIfFilterableHasVacationApprovalStatus = (
    filterable: VacationsArray,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.status === filterableId;
    });
  };

  static determineIfFilterableVacationWasExcludedFromInvoice = (
    filterable: VacationsArray,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.internal_projects?.some((project) => project.is_excluded === filterableId);
    });
  };

  static determineIfFilterableHasProjects = (
    filterable: EmployeeVacations,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.projects.some((project) => project.id === filterableId);
    });
  };

  static determineIfFilterableHasProjectMembers = (
    filterable: ProjectDashboard,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.employee_ids?.some((em) => em === filterableId);
    });
  };

  static determineIfFilterableHasVacationType = (
    filterable: VacationsArray,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.type === filterableId;
    });
  };

  static determineIfFilterableIsActiveBetweenDates = (
    filterable: ProjectDashboard,
    dateFilters: Condition[],
  ) => {
    return dateFilters.every((dateFilter) => {
      let result = false;
      if (filterable.start_date) {
        const hrInterviewDate = new Date(filterable.start_date);
        hrInterviewDate.setHours(0, 0, 0, 0);
        result =
          hrInterviewDate >= dateFilter.meta!.startDate! &&
          hrInterviewDate <= dateFilter.meta!.endDate!;
      }
      return result;
    });
  };

  static determineIfFilterableHrInterviewIsBetweenDates = (
    filterable: Candidate,
    dateFilters: Condition[],
  ) => {
    return dateFilters.every((dateFilter) => {
      let result = false;
      if (filterable.hr_interview_date) {
        const hrInterviewDate = new Date(filterable.hr_interview_date);
        hrInterviewDate.setHours(0, 0, 0, 0);
        result =
          hrInterviewDate >= dateFilter.meta!.startDate! &&
          hrInterviewDate <= dateFilter.meta!.endDate!;
      }
      return result;
    });
  };

  static determineIfFilterableRejectedCandidatesIsActiveBetweenDates = (
    filterable: RejectedCandidates,
    dateFilters: Condition[],
  ) => {
    return dateFilters.every((dateFilter) => {
      let result = false;
      if (filterable.rejected_at) {
        const hrInterviewDate = new Date(filterable.rejected_at);
        hrInterviewDate.setHours(0, 0, 0, 0);
        result =
          hrInterviewDate >= dateFilter.meta!.startDate! &&
          hrInterviewDate <= dateFilter.meta!.endDate!;
      }
      return result;
    });
  };

  static determineIfFilterableHasRole = (
    filterable: PrivilegedUsers,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.role === filterableId;
    });
  };

  static determineIfFilterableHasEmail = (
    filterable: PrivilegedUsers,
    filterableIds: (number | string)[],
  ) => {
    return filterableIds.every((filterableId) => {
      return filterable.id === filterableId;
    });
  };
}

export default AndConditionGroup;
