import React, {
  Suspense,
  useEffect,
  useState
} from 'react';

import media from 'shared/consts/media';

const Sidebar = React.lazy(() => import('modules/Sidebar'));
const SidebarMobile = React.lazy(() =>
  import('modules/Sidebar/SidebarMobile')
);
const MapHolder = React.lazy(() =>
  import('modules/MapHolder')
);
const MapHolderMobile = React.lazy(() =>
  import('modules/MapHolder/MapHolderMobile')
);

const Main = searchInput => {
  const [visible, setVisible] = useState(true);
  const [screenWidth, setScreenWidth] = useState();

  useEffect(() => {
    setScreenWidth(window.innerWidth);
  }, [searchInput]);

  return (
    <>
      {screenWidth < media.ipad &&
      window.orientation !== 90 ? (
        <>
          <Suspense
            fallback={
              <div>Завантаження меню і мапи...</div>
            }
          >
            <SidebarMobile
              setVisible={setVisible}
              visible={visible}
            />
            <MapHolderMobile
              setVisible={setVisible}
              visible={visible}
            />
          </Suspense>
        </>
      ) : (
        <>
          <Suspense
            fallback={
              <div>Завантаження меню і мапи...</div>
            }
          >
            <Sidebar
              setVisible={setVisible}
              visible={visible}
            />
            <MapHolder
              setVisible={setVisible}
              visible={visible}
            />
          </Suspense>
        </>
      )}
    </>
  );
};

export default Main;
