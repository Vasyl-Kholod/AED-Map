import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { CSSTransition } from 'react-transition-group';
import React, {
  useEffect,
  useState,
  Suspense
} from 'react';
import {
  Route,
  Switch,
  Redirect,
  useHistory
} from 'react-router-dom';

import media from 'shared/consts/media';
import { cancelToken } from 'shared/utils';
import { socketAuthOpen } from 'shared/websocket';

import { validateUser } from 'modules/Auth/api';

import SignInModal from 'modules/Auth/submodules/SignIn/components/SignInModal';
import ResetPassword from 'modules/Auth/submodules/Reset/submodules/ResetPassword';
import SignUpPassword from 'modules/Auth/submodules/SignUp/submodules/SignUpPassword';

import { withHocs } from './hocs';
import { Main } from './components';
import './App.css';

const StartModal = React.lazy(() =>
  import('../modules/MapHolder/components/StartModal')
);
const StartModalMobile = React.lazy(() =>
  import(
    '../modules/MapHolder/components/StartModal/StartModalMobile'
  )
);

const ValidateCancelToken = cancelToken();

const useStyles = makeStyles({
  mainStyle: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%'
  },
  startModalFadeEnter: {
    opacity: 0,
    transform: 'translateY(-150px)'
  },
  startModalFadeEnterActive: {
    opacity: 1,
    transform: 'translateY(0)',
    transition:
      'opacity 0.5s ease, transform 0.5s ease-in-out'
  },
  startModalFadeExit: {
    opacity: 1
  },
  startModalFadeExitActive: {
    opacity: 0,
    transform: 'translateY(150px)',
    transition:
      'opacity 0.5s linear, transform 0.5s ease-in-out'
  },
  startModalFadeAppear: {
    opacity: 0,
    transform: 'translateY(150px)'
  },
  startModalFadeAppearActive: {
    opacity: 1,
    transform: 'translateY(0)',
    transition:
      'opacity 0.5s linear, transform 0.5s ease-in-out'
  }
});

const App = ({
  fail,
  user,
  success,
  mapData,
  location,
  searchInput,
  makeItemActive
}) => {
  const classes = useStyles();
  const transitionClasses = {
    enter: classes.startModalFadeEnter,
    enterActive: classes.startModalFadeEnterActive,
    exit: classes.startModalFadeExit,
    exitActive: classes.startModalFadeExitActive,
    appear: classes.startModalFadeAppear,
    appearActive: classes.startModalFadeAppearActive
  };
  const { pathname, search } = location;
  const closeModal =
    sessionStorage.getItem('startModal') === 'close';
  const [isStartModalOpen, setStartModal] = useState(
    !closeModal
  );
  const history = useHistory();
  const [didMount, setDidMount] = useState(false);
  const [screenWidth, setScreenWidth] = useState();

  if (pathname === '/' && search && mapData.length) {
    makeItemActive(search.split('=')[1]);
  }

  useEffect(() => {
    setDidMount(true);
    (async () => {
      try {
        const { data, headers } = await validateUser();
        const { authorization } = headers;
        success(data, authorization);
        socketAuthOpen();
        setStartModal(false);
      } catch (e) {
        fail();
      }
    })();

    return () => {
      ValidateCancelToken.cancel();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (didMount) history.push('/');
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
  }, [searchInput]);

  return (
    <div className="App">
      <div className={classes.mainStyle}>
        <Switch>
          <Route
            path="/admin"
            exact
            component={SignInModal}
          />
          <Route
            path="/signup/:email/:token"
            component={SignUpPassword}
          />
          <Route
            path="/reset/:email/:token"
            component={ResetPassword}
          />
          <Route path="/" component={Main} />
          <Redirect from="*" to="/" />
        </Switch>
      </div>
      {location.pathname === '/' && (
        <CSSTransition
          in={isStartModalOpen}
          classNames={transitionClasses}
          appear
          timeout={1000}
          unmountOnExit
        >
          {screenWidth < media.ipad &&
          window.orientation !== 90 ? (
            <Suspense
              fallback={
                <div>Завантаження модального вікна...</div>
              }
            >
              <StartModalMobile
                setStartModal={setStartModal}
              />
            </Suspense>
          ) : (
            <Suspense fallback={<div>Завантаження...</div>}>
              <StartModal setStartModal={setStartModal} />
            </Suspense>
          )}
        </CSSTransition>
      )}
    </div>
  );
};

App.defaultProps = {
  user: null
};

App.propTypes = {
  success: PropTypes.func.isRequired,
  fail: PropTypes.func.isRequired,
  mapData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      address: PropTypes.string,
      location: PropTypes.shape({
        type: PropTypes.string,
        coordinates: PropTypes.arrayOf(PropTypes.number)
      })
    })
  ).isRequired,
  makeItemActive: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired
  }).isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  })
};

export default withHocs(App);
