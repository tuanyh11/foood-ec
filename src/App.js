
import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom'
import {useAuthSlice} from './redux/hooks'
import { useEffect } from 'react';
import {useDispatch} from 'react-redux'
import {publicRoutes } from './router'

function App() {

  const userInfo = {
    userName: 'tuan leo',
    userId: '507f1f77bcf86cd799439011',
    createdAt: new Date().toLocaleDateString(),
    avatar: 'https://img.freepik.com/premium-photo/young-handsome-man-with-beard-isolated-keeping-arms-crossed-frontal-position_1368-132662.jpg?w=2000'
  }

  const dispatch = useDispatch()

  const [user, authActions] = useAuthSlice()

  useEffect(() => {
    dispatch(authActions.userLogin(userInfo))
  }, [])


  return (
      <Routes>
        <Route path='/' element={<Navigate to="/home"/>}/>
        {publicRoutes.map((route, index) => {
          const Layout = route.layout
          const Component = route.component
          return <Route key={index} path={route.path} element={
            <Layout>
              <Component/>
            </Layout>
          } />
        })}
      </Routes>
  );
}

export default App;
