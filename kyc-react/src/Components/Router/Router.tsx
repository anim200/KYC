import {Routes,Route} from 'react-router-dom'
import Form from '../../Pages/KycFormPage'

const Router = () => {
  return (
    <Routes>
        
        <Route path='/form' element={<Form/>}/>
    </Routes>
  )
}

export default Router