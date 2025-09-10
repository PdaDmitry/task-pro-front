import { useDispatch, useSelector } from 'react-redux';

const HomePage = () => {
  const currentUser = useSelector(state => state.auth.user);
  // console.log('currentUser', currentUser);

  return (
    <>
      <div>HomePage</div>
    </>
  );
};

export default HomePage;
