import React, { useState } from 'react'
import { Formik, Field, Form, ErrorMessage, FormikProps } from 'formik'
import { Alert, Box, Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material'
import { LockOutlined, PersonOutline, Visibility, VisibilityOff } from '@mui/icons-material'
import { useRouter } from 'next/router'
import api from '../apis/api'
import { setLocalStorage } from '../utils/localStorage'
export interface LoginForm {
  email: string
  password: string
}

import * as Yup from 'yup'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [error, setError] = useState(false)
  const handleSubmitForm = async (values: LoginForm, { resetForm }: { resetForm: () => void }) => {
  setError(false);
  try {
    const res = await api.post('/auth/login', values);
    const result = res.data.data
    console.log(result);
    if (result && result.access_token) {
      setLocalStorage('token', result.access_token);
      setLocalStorage('user', JSON.stringify(result.user));
      router.replace('/');
    } else {
      setError(true);
    }
  } catch (e) {
    setError(true);
  }
  resetForm();
  setShowPassword(false);
}

  const handleTogglePasswordVisibility = () => {
    setShowPassword((showPassword) => !showPassword)
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1620764840976-a6752f359c46?q=80&w=1947&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&:before': {
          content: '""',
          position: 'fixed',
          zIndex: 0,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(10, 25, 41, 0.55)',
          backdropFilter: 'blur(2px)',
        },
      }}
    >
      <Box
        width="100%"
        maxWidth={420}
        p={{ xs: 2, sm: 4 }}
        bgcolor="rgba(255,255,255,0.95)"
        borderRadius={6}
        boxShadow={6}
        sx={{
          backdropFilter: 'blur(6px)',
          borderRadius: '32px',
          mt: { xs: 2, sm: 0 },
        }}
      >
        <h1 style={{
          textAlign: 'center',
          fontWeight: 700,
          marginBottom: 28,
          fontStyle: 'italic',
          letterSpacing: 1,
          fontSize: '2rem',
          fontFamily: "'Exo 2', sans-serif",
          color: '#0a1929'
        }}>
          TOURNA MASTER
        </h1>
        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmitForm}
          validateOnBlur={true}
          validateOnChange={false}
          validateOnMount={true}
        >
          {(formProps: FormikProps<any>) => (
            <Form onSubmit={formProps.handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Login failed! Incorrect username or password
                </Alert>
              )}
              <Stack spacing={1.5} mb={2}>
                <Field
                  as={TextField}
                  color={formProps.touched.email && formProps.errors.email ? 'error' : 'primary'}
                  error={formProps.touched.email && formProps.errors.email ? true : false}
                  fullWidth
                  id="email-login"
                  label="Email"
                  name="email"
                  placeholder="Email address"
                  type="email"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline />
                      </InputAdornment>
                    )
                  }}
                />
                <ErrorMessage name="email" component="span" style={{ color: 'red', fontSize: 12 }} />
              </Stack>
              <Stack spacing={1.5} mb={2}>
                <Field
                  as={TextField}
                  color={formProps.touched.password && formProps.errors.password ? 'error' : 'primary'}
                  error={formProps.touched.password && formProps.errors.password ? true : false}
                  fullWidth
                  id="password-login"
                  label="Password"
                  name="password"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <ErrorMessage name="password" component="span" style={{ color: 'red', fontSize: 12 }} />
              </Stack>
              <Button
                size="large"
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  borderRadius: '18px',
                  backgroundColor: '#001c2e',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  letterSpacing: 1,
                  '&:hover': { backgroundColor: '#003366' },
                  py: 1.5
                }}
              >
                LOGIN
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  )
}

export default Login
