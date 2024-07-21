import React from 'react'
import UsersTable from '../../components/Statistics/UserTable'
import SessionsTable from '../../components/Statistics/SessionsTable'
import AgendasTable from '../../components/Statistics/AgendasTable'

const Statistics = () => {
  return (
    <>
      <UsersTable/>
      <SessionsTable/>
      <AgendasTable />
    </>
  )
}

export default Statistics
