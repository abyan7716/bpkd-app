// components/CustomLogin.jsx
import React from 'react'
import { Box, H2, FormGroup, Label, Input, Button, Illustration } from '@adminjs/design-system'

const CustomLogin = (props) => {
  const { action, message } = props
  return (
    <Box height="100vh" flex alignItems="center" justifyContent="center" variant="grey">
      <Box bg="white" p="xxl" rounded width={['100%', '400px']}>
        <Illustration variant="Astronaut" width={80} height={80} />
        <H2 textAlign="center" mb="lg">Login Admin BPKD</H2>
        {message && <Box mb="lg" color="danger">{message}</Box>}
        <Box as="form" action={action} method="POST">
          <FormGroup>
            <Label>Email</Label>
            <Input name="email" type="email" required />
          </FormGroup>
          <FormGroup>
            <Label>Password</Label>
            <Input name="password" type="password" required />
          </FormGroup>
          <Button variant="contained" color="primary" width="100%" mt="lg">Login</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default CustomLogin
