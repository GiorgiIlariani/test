import { useProfileTable } from './useProfileTable';

const ProfileTable = () => {
  const {
    columns,
    columnTitles,
    rows,
    getStatusStyle,
    handleSubmit,
    toggleMenu,
    activeMenu,
    statusArr,
    isLoading,
  } = useProfileTable();

  return (
    <div className='max-w-full w-full flex overflow-auto'>
      {isLoading ? (
        <div className='grid grid-flow-col auto-cols-max border border-zinc-200 rounded-md max-h-[calc(100vh-10rem)] overflow-auto'>
          {Array.from({ length: 12 }).map((_, ci) => (
            <div
              key={ci}
              className={`first:min-w-0 min-w-40 border-r border-zinc-200 last:border-0 ${
                ci < 2 ? (!ci ? 'sticky left-0 text-center z-10' : 'sticky left-12.25 z-10') : ''
              }`}
            >
              <div
                className={`bg-indigo-50 z-5 py-4 border-b border-zinc-200 text-indigo-900 text-xs font-medium sticky top-0 flex gap-1 items-center ${
                  !ci ? 'px-4 justify-center' : 'px-6'
                }`}
              >
                {ci === 0 ? (
                  <span>#</span>
                ) : (
                  <div className='h-4  w-20 bg-gray-300 animate-pulse'></div>
                )}
              </div>
              {Array.from({ length: 20 }).map((_, ri) => {
                return (
                  <div
                    key={ri}
                    className={`py-4 border-b border-zinc-200 last:border-0 bg-white ${
                      !ci ? 'px-4' : 'px-6'
                    } relative`}
                  >
                    <div
                      className={`h-4 ${ci === 0 ? 'w-12' : 'w-20'} bg-gray-300 animate-pulse`}
                    ></div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-flow-col auto-cols-max border border-zinc-200 rounded-md max-h-[calc(100vh-10rem)] overflow-auto'>
          {columnTitles.map((c, ci) => (
            <div
              key={c}
              className={`first:min-w-0 min-w-40 border-r border-zinc-200 last:border-0 ${
                ci < 2 ? (!ci ? 'sticky left-0 text-center z-10' : 'sticky left-12.25 z-10') : ''
              }`}
            >
              <div
                className={`bg-indigo-50 z-5 py-4 border-b border-zinc-200 text-indigo-900 text-xs font-medium sticky top-0 flex gap-1 items-center ${
                  !ci ? 'px-4 justify-center' : 'px-6'
                }`}
              >
                {c}
              </div>
              {rows.map((r, ri) => {
                const col = columns?.[ri]?.[ci];
                const status = col?.status;

                return (
                  <div
                    key={r.id}
                    className={`py-4 border-b border-zinc-200 last:border-0 bg-white ${
                      !ci ? 'px-4' : 'px-6'
                    } relative`}
                  >
                    {ci < 2 ? (
                      <span className={`text-base flex w-full ${!ci ? 'justify-center' : ''}`}>
                        {!ci ? ri + 1 : r.title}
                      </span>
                    ) : (
                      <div className='menu-container'>
                        <div
                          className={`${getStatusStyle(status)} ${
                            isLoading ? 'flex animate-pulse transition-all bg-zinc-200!' : ''
                          } ${
                            col?.loading
                              ? 'opacity-50'
                              : col?.loading === null
                              ? 'opacity-50 border border-red-600 bg-red-100'
                              : ''
                          }`}
                          onClick={() => toggleMenu(`${r.title}-${c}`)}
                        >
                          {isLoading ? <span className='w-20 h-4 flex' /> : status}
                        </div>
                        {activeMenu === `${r.title}-${c}` && (
                          <div
                            className='absolute w-48 -left-4 border border-zinc-200 rounded-md p-5 z-10 bg-white flex flex-col gap-4'
                            style={{
                              boxShadow:
                                '0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
                              top: ri > rows.length - 4 ? '-9rem' : '3rem',
                            }}
                          >
                            {statusArr.map((s) => (
                              <span
                                key={s}
                                className={getStatusStyle(s)}
                                onClick={() => r?.id && handleSubmit(col?.id, r.id, s)}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileTable;
