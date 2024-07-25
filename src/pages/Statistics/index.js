import React from 'react'
import UsersTable from '../../components/Statistics/UserTable'
import SessionsTable from '../../components/Statistics/SessionsTable'
import AgendasTable from '../../components/Statistics/AgendasTable'


const Statistics = () => {
  return (
    <div className='table-sheet'>
      <UsersTable/>
      <SessionsTable/>
      <AgendasTable />
      
    </div>
  )
}

export default Statistics
