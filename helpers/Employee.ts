import { EmployeeVacations, VacationPeriod } from 'types';

export class EmployeeModel {
  private employee: EmployeeVacations;

  private static getDefaultEmployee(): EmployeeVacations {
    return {
      id: 0,
      first_name: '',
      last_name: '',
      avatar: '',
      leave_date: '',
      join_date: '',
      job_type: '',
      request_date: '',
      department: {
        id: 0,
        title: '',
      },
      seniority: {
        id: 0,
        title: '',
      },
      position: {
        id: 0,
        title: '',
      },
      projects: [],
      vacations: [],
      total_vacation_days_per_month: {
        rejected: {
          month: '',
        },
        approved: {
          month: '',
        },
        pending: {
          month: '',
        },
      },
      employee: {
        id: 0,
        avatar: '',
        first_name: '',
        last_name: '',
      },
      vacation_periods: [],
      review_year: undefined,
    };
  }

  constructor(obj: EmployeeVacations | VacationPeriod[] | undefined) {
    if (!obj) {
      this.employee = EmployeeModel.getDefaultEmployee();
    } else if (Array.isArray(obj)) {
      this.employee = EmployeeModel.getDefaultEmployee();
      this.employee.vacation_periods = obj;
    } else {
      this.employee = obj;
    }
  }

  private id = 0;

  public isNotSet() {
    return this.id === 0;
  }

  public hasNoVacations() {
    return this.employee.vacation_periods.length === 0;
  }
  public hasMultipleCycles() {
    return this.employee.vacation_periods[0].sub_cycles.length > 1;
  }

  public isBonusPeriod() {
    return this.employee.vacation_periods[0]?.sub_cycles[0]?.is_bonus_days_period;
  }

  public isBonusExpired() {
    return new Date(this.employee.vacation_periods[0].sub_cycles[0].to) < new Date();
  }

  public sumOfVacationDaysUsed() {
    return this.employee.vacation_periods[0].sub_cycles.reduce(
      (total, currentValue) => total + currentValue?.vacation_days_used,
      0,
    );
  }

  public sumOfSickDaysUsed() {
    return this.employee.vacation_periods[0].sub_cycles.reduce(
      (total, currentValue) => total + currentValue?.sick_days_used,
      0,
    );
  }

  public numberOfBonusDaysLet() {
    const availableBonusDays =
      this.employee.vacation_periods[0].sub_cycles[0]?.available_vacation_days;
    const usedBonusDays = this.employee.vacation_periods[0].sub_cycles[0]?.vacation_days_used;

    return availableBonusDays - usedBonusDays < 0 ? 0 : availableBonusDays - usedBonusDays;
  }

  public numberOfVacationDaysLeft(isBonusPeriod?: boolean) {
    const hasMultipleCycles = this.hasMultipleCycles();

    const {
      available_vacation_days: availableVacationFirstCycle,
      vacation_days_used: usedVacationFirstCycle,
    } = this.employee.vacation_periods[0]?.sub_cycles[0] || {};

    const {
      available_vacation_days: availableVacationSecondCycle,
      vacation_days_used: usedVacationSecondCycle,
    } = this.employee.vacation_periods[0]?.sub_cycles[1] || {};

    if (isBonusPeriod) {
      return hasMultipleCycles ? availableVacationSecondCycle - usedVacationSecondCycle : 0;
    } else {
      return hasMultipleCycles
        ? availableVacationSecondCycle - usedVacationSecondCycle
        : availableVacationFirstCycle - usedVacationFirstCycle;
    }
  }

  public getAvailableBonusDates() {
    const fromDate = this.employee.vacation_periods[0]?.sub_cycles[0]?.from;
    const toDate = this.employee.vacation_periods[0]?.sub_cycles[0]?.to;

    return { fromDate, toDate };
  }

  public getAvailableVacationDates() {
    const isBonusPeriodAvailable = this.hasMultipleCycles();

    const vacationFromDate = this.employee.vacation_periods[0].from;
    const vacationToDate = this.employee.vacation_periods[0].to;

    const bonusFromDate = this.employee.vacation_periods[0].sub_cycles[1]?.from;
    const bonusToDate = this.employee.vacation_periods[0].sub_cycles[1]?.to;

    const fromDate = isBonusPeriodAvailable ? bonusFromDate : vacationFromDate;

    const toDate = isBonusPeriodAvailable ? bonusToDate : vacationToDate;

    return { fromDate, toDate };
  }

  public getEmployeeVacationsData(month: number, currentYear: number) {
    return this.employee.vacations.filter((vacation) => {
      const vacationStartDate = new Date(vacation.start_date);
      const vacationEndDate = new Date(vacation.end_date);

      if (vacationStartDate.getFullYear() === vacationEndDate.getFullYear()) {
        return vacationStartDate.getMonth() <= month && vacationEndDate.getMonth() >= month;
      } else if (
        vacationStartDate.getFullYear() < vacationEndDate.getFullYear() &&
        vacationStartDate.getFullYear() < currentYear
      ) {
        return vacationEndDate.getMonth() >= month;
      } else if (
        vacationStartDate.getFullYear() < vacationEndDate.getFullYear() &&
        vacationEndDate.getFullYear() > currentYear
      ) {
        return vacationStartDate.getMonth() <= month;
      }
    });
  }

  public getEmployeeName() {
    return this.employee?.first_name
      ? `${this.employee?.first_name} ${this.employee?.last_name}`
      : 'unassigned';
  }

  public setEmployeeVacationPeriods(vacationPeriods: VacationPeriod[]) {
    this.employee.vacation_periods = vacationPeriods;
  }
}
