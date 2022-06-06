import { isEqual } from 'lodash';
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

  const isMobileView =
    !isEqual(window.orientation, 90) &&
    screenWidth < media.ipad;
  const SidebarCmp = isMobileView ? SidebarMobile : Sidebar;
  const MapHolderCmp = isMobileView
    ? MapHolderMobile
    : MapHolder;

  return (
    <Suspense
      fallback={<div>Завантаження меню і мапи...</div>}
    >
      <SidebarCmp
        visible={visible}
        setVisible={setVisible}
      />
      <MapHolderCmp
        visible={visible}
        setVisible={setVisible}
      />
    </Suspense>
  );
};

export { Main };
