import { Card, Switch } from 'components';
import { Skills } from 'types';
import { useFormContext } from 'react-hook-form';
import { SHORT_COMPETENCY_RATES } from 'config';

const SkillsCardShowMode: React.FC = () => {
  const { getValues } = useFormContext<{ skills: Skills[] }>();

  return (
    <Card noMargin={true} noPadding={true}>
      <div className='grid grid-cols-4 grow gap-4 items-center mb-2 text-xs text-muted-foreground'>
        <div>Skill</div>
        <div>Experience</div>
        <div>Competence rate</div>
        <div className='justify-self-end'>Update AUT</div>
      </div>

      <ul>
        {getValues('skills').map((item) => {
          return (
            <li key={item.id} className='grid grid-cols-4 grow gap-4 items-center h-10'>
              <div className='truncate'>{item.title as string}</div>

              <div className='flex items-center gap-2.5'>
                <div className='flex items-baseline gap-0.5'>
                  <p>{item.years_of_experience}</p>
                  <p className='text-xs'>{item.years_of_experience === 1 ? 'Yr' : 'Yrs'}</p>
                </div>

                <div className='flex items-baseline gap-0.5'>
                  <p>{item.months_of_experience}</p>
                  <p className='text-xs'>Mos</p>
                </div>
              </div>

              <div>
                {SHORT_COMPETENCY_RATES?.find((el) => el.id == item.competency_rate)?.title ?? (
                  <span className='text-muted-foreground/50'>-</span>
                )}
              </div>

              <div className='justify-self-end'>
                <Switch checked={!!item.is_preferred} disabled />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
};

export default SkillsCardShowMode;
